import { db } from "@/lib/db";
import { MockExamClient } from "./MockExamClient";

export const dynamic = "force-dynamic";
export default function MockExamPage(){const units=db.prepare("SELECT id,unit_name AS name FROM units ORDER BY id").all() as {id:number;name:string}[];return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Mock exam</span><h1>模擬考試</h1><p>答案不會在作答中傳到前端；交卷或倒數結束後，由伺服器一次評分並顯示解析。</p></div><div className="container section-tight"><MockExamClient units={units}/></div></>}
