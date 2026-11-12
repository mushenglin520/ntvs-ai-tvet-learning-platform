import { createHash } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { getRequestUser } from "@/lib/api-auth";
import { SESSION_COOKIE } from "@/lib/auth";
import { callRpc, createDataClient, DataError, readSessionToken } from "@/lib/supabase";

export async function POST(request:Request){
  const user=await getRequestUser(request); if(!user||user.role!=="teacher") return NextResponse.json({error:"僅限授權教師上傳"},{status:403});
  const form=await request.formData(); const file=form.get("file"); const year=Number(form.get("year"));
  if(!(file instanceof File)||!Number.isInteger(year)||year<100||year>200) return NextResponse.json({error:"請選擇檔案並填寫正確學年度"},{status:400});
  if(file.size>10*1024*1024) return NextResponse.json({error:"檔案超過 10 MB"},{status:413});
  const ext=path.extname(file.name).toLowerCase(); if(![".pdf",".csv"].includes(ext)) return NextResponse.json({error:"只接受 PDF 或 CSV"},{status:415});
  const buffer=Buffer.from(await file.arrayBuffer()); const sha=createHash("sha256").update(buffer).digest("hex").toUpperCase();
  const safeName=`${Date.now()}-${path.basename(file.name).replace(/[^a-zA-Z0-9._\-\u4e00-\u9fff]/g,"_")}`;
  const token=readSessionToken(request,SESSION_COOKIE); const storagePath=`${year}/${safeName}`;
  let questions:Array<Record<string,unknown>>=[];
  if(ext===".csv"){
    try {
      const records=parse(buffer,{columns:true,skip_empty_lines:true,bom:true,trim:true}) as Array<Record<string,string>>;
      questions=records.map((r,i)=>{
        if(!r.stem||!r.unit) throw new Error(`第 ${i+2} 列缺少題幹或單元`);
        return {source_type:r.source_type==="official"?"official":"ai",original_no:r.original_no||`CSV-${i+1}`,stem:r.stem,options:{A:r.option_a,B:r.option_b,C:r.option_c,D:r.option_d},answer:r.answer?.toUpperCase(),explanation:r.explanation||"待教師補充解析",unit:r.unit,difficulty:r.difficulty};
      });
    } catch(e){return NextResponse.json({error:`CSV 解析失敗：${(e as Error).message}`},{status:400});}
  }
  const {error:uploadError}=await createDataClient(token).storage.from("source-files").upload(storagePath,buffer,{contentType:file.type||undefined,upsert:false});
  if(uploadError) return NextResponse.json({error:`檔案儲存失敗：${uploadError.message}`},{status:400});
  const status=ext===".pdf"?"uploaded_pending_parse":"csv_imported_pending_review";
  try {
    const result=await callRpc<{imported:number}>("import_source_document",{p_year:year,p_url:`supabase://source-files/${storagePath}`,p_filename:file.name,p_sha256:sha,p_status:status,p_note:ext===".pdf"?"教師上傳 PDF，尚待解析與答案核對。":"教師上傳 CSV，題目預設待審。",p_questions:questions},token);
    return NextResponse.json({message:ext===".pdf"?"PDF 已保存並列為待解析來源。":`CSV 已匯入 ${result.imported} 題，全部列為待審。`});
  } catch(e){return NextResponse.json({error:e instanceof DataError?e.message:"來源登錄失敗"},{status:400});}
}
