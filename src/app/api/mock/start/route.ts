import { NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { SESSION_COOKIE } from "@/lib/auth";
import { callRpc, DataError, readSessionToken } from "@/lib/supabase";

const schema=z.object({sourceType:z.enum(["official","ai"]),unitId:z.number().int().positive().nullable(),count:z.number().int().min(1).max(20),durationMin:z.number().int().min(1).max(120)});
export async function POST(request:Request){
  const user=await getRequestUser(request); if(!user||user.role!=="student") return NextResponse.json({error:"請先以學生身分登入"},{status:401});
  const p=schema.safeParse(await request.json().catch(()=>({}))); if(!p.success) return NextResponse.json({error:"考試設定不正確"},{status:400});
  try {
    const data=await callRpc("start_exam",{p_mode:"mock",p_source_type:p.data.sourceType,p_unit_id:p.data.unitId,p_difficulty:null,p_count:p.data.count},readSessionToken(request,SESSION_COOKIE));
    return NextResponse.json(data);
  } catch(e){return NextResponse.json({error:e instanceof DataError?e.message:"無法建立模擬考"},{status:400});}
}
