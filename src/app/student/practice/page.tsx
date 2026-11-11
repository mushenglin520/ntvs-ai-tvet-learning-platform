import { db } from "@/lib/db";
import { PracticeClient } from "./PracticeClient";

export const dynamic = "force-dynamic";
export default function PracticePage() {
  const units = db.prepare("SELECT id, unit_name AS name FROM units ORDER BY id").all() as {id:number;name:string}[];
  return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Practice mode</span><h1>自主練習</h1><p>選擇練習條件後逐題作答；每題提交後立即顯示正確答案與解析。</p></div><div className="container section-tight"><PracticeClient units={units}/></div></>;
}
