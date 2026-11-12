import { NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { SESSION_COOKIE } from "@/lib/auth";
import { validateReview } from "@/lib/review";
import { callRpc, DataError, readSessionToken } from "@/lib/supabase";

const schema=z.object({questionId:z.number().int().positive(),decision:z.string(),note:z.string()});
export async function POST(request:Request){
  const user=await getRequestUser(request); if(!user||user.role!=="teacher") return NextResponse.json({error:"僅限授權教師操作"},{status:403});
  const p=schema.safeParse(await request.json().catch(()=>({}))); if(!p.success) return NextResponse.json({error:"審核資料不完整"},{status:400});
  let decision; try{decision=validateReview(p.data.decision,p.data.note);}catch(e){return NextResponse.json({error:(e as Error).message},{status:400});}
  try {return NextResponse.json(await callRpc("review_question",{p_question_id:p.data.questionId,p_decision:decision,p_note:p.data.note.trim()},readSessionToken(request,SESSION_COOKIE)));}
  catch(e){return NextResponse.json({error:e instanceof DataError?e.message:"無法儲存審核"},{status:400});}
}
