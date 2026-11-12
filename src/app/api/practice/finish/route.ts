import { NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { SESSION_COOKIE } from "@/lib/auth";
import { callRpc, DataError, readSessionToken } from "@/lib/supabase";

export async function POST(request:Request){
  const user=await getRequestUser(request); if(!user||user.role!=="student") return NextResponse.json({error:"未授權"},{status:401});
  const p=z.object({attemptId:z.number().int().positive()}).safeParse(await request.json().catch(()=>({}))); if(!p.success) return NextResponse.json({error:"資料不正確"},{status:400});
  try {return NextResponse.json(await callRpc("finish_practice",{p_attempt_id:p.data.attemptId},readSessionToken(request,SESSION_COOKIE)));}
  catch(e){return NextResponse.json({error:e instanceof DataError?e.message:"無法完成練習"},{status:400});}
}
