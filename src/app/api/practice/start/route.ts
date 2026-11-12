import { NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { SESSION_COOKIE } from "@/lib/auth";
import { callRpc, DataError, readSessionToken } from "@/lib/supabase";

const schema=z.object({sourceType:z.enum(["official","ai"]),unitId:z.number().int().positive().nullable(),difficulty:z.enum(["基礎","進階","挑戰"]).nullable(),count:z.number().int().min(1).max(20)});
export async function POST(request:Request){
  const user=await getRequestUser(request); if(!user||user.role!=="student") return NextResponse.json({error:"請先以學生身分登入"},{status:401});
  const parsed=schema.safeParse(await request.json().catch(()=>({}))); if(!parsed.success) return NextResponse.json({error:"練習條件不正確"},{status:400});
  try {
    const data=await callRpc("start_exam",{p_mode:"practice",p_source_type:parsed.data.sourceType,p_unit_id:parsed.data.unitId,p_difficulty:parsed.data.difficulty,p_count:parsed.data.count},readSessionToken(request,SESSION_COOKIE));
    return NextResponse.json(data);
  } catch(e){return NextResponse.json({error:e instanceof DataError?e.message:"無法建立練習"},{status:400});}
}
