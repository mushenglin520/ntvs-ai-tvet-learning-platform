import { NextResponse } from "next/server";
import { z } from "zod";
import { getRequestUser } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { selectPublishedQuestions } from "@/lib/questions";

const schema=z.object({sourceType:z.enum(["official","ai"]),unitId:z.number().int().positive().nullable(),count:z.number().int().min(1).max(20),durationMin:z.number().int().min(1).max(120)});
export async function POST(request:Request){const user=getRequestUser(request);if(!user||user.role!=="student")return NextResponse.json({error:"請先以學生身分登入"},{status:401});const p=schema.safeParse(await request.json().catch(()=>({})));if(!p.success)return NextResponse.json({error:"考試設定不正確"},{status:400});const questions=selectPublishedQuestions(p.data.sourceType,p.data.unitId,null,p.data.count);if(!questions.length)return NextResponse.json({error:"沒有符合條件的已審題目"},{status:404});const settings={...p.data,questionIds:questions.map(q=>q.id)};const exam=db.prepare("INSERT INTO exams (mode,source_type,subject_id,settings_json) VALUES ('mock',?,1,?)").run(p.data.sourceType,JSON.stringify(settings));const attempt=db.prepare("INSERT INTO attempts (exam_id,student_id) VALUES (?,?)").run(exam.lastInsertRowid,user.id);return NextResponse.json({attemptId:Number(attempt.lastInsertRowid),questions});}
