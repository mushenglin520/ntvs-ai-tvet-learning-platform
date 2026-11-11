import { NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { selectPublishedQuestions } from "@/lib/questions";

const schema=z.object({sourceType:z.enum(["official","ai"]),unitId:z.number().int().positive().nullable(),difficulty:z.enum(["基礎","進階","挑戰"]).nullable(),count:z.number().int().min(1).max(20)});
export async function POST(request:Request){const user=getRequestUser(request);if(!user||user.role!=="student")return NextResponse.json({error:"請先以學生身分登入"},{status:401});const parsed=schema.safeParse(await request.json().catch(()=>({})));if(!parsed.success)return NextResponse.json({error:"練習條件不正確"},{status:400});const q=selectPublishedQuestions(parsed.data.sourceType,parsed.data.unitId,parsed.data.difficulty,parsed.data.count);if(!q.length)return NextResponse.json({error:"目前沒有符合條件的已審題目，請調整篩選條件"},{status:404});const settings={...parsed.data,questionIds:q.map(x=>x.id)};const exam=db.prepare("INSERT INTO exams (mode,source_type,subject_id,settings_json) VALUES ('practice',?,1,?)").run(parsed.data.sourceType,JSON.stringify(settings));const attempt=db.prepare("INSERT INTO attempts (exam_id,student_id) VALUES (?,?)").run(exam.lastInsertRowid,user.id);return NextResponse.json({attemptId:Number(attempt.lastInsertRowid),questions:q});}
