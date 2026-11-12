import { NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { SESSION_COOKIE } from "@/lib/auth";
import { callRpc, DataError, readSessionToken } from "@/lib/supabase";

const schema=z.object({attemptId:z.number().int().positive(),questionId:z.number().int().positive(),selectedAnswer:z.enum(["A","B","C","D"])});
export async function POST(request:Request){
  const user=await getRequestUser(request); if(!user||user.role!=="student") return NextResponse.json({error:"未授權"},{status:401});
  const p=schema.safeParse(await request.json().catch(()=>({}))); if(!p.success) return NextResponse.json({error:"作答資料不正確"},{status:400});
  try {return NextResponse.json(await callRpc("answer_practice",{p_attempt_id:p.data.attemptId,p_question_id:p.data.questionId,p_selected_answer:p.data.selectedAnswer},readSessionToken(request,SESSION_COOKIE)));}
  catch(e){return NextResponse.json({error:e instanceof DataError?e.message:"無法儲存答案"},{status:400});}
}
