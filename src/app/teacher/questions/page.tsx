import { getSessionToken, requireRole } from "@/lib/auth";
import { callRpc } from "@/lib/supabase";

export const dynamic="force-dynamic";
type QuestionRow={id:number;no:string;sourceType:string;stem:string;difficulty:string;status:string;version:number;unitName:string};
export default async function QuestionsPage(){
  await requireRole("teacher","admin");
  const rows=await callRpc<QuestionRow[]>("teacher_questions",{},await getSessionToken());
  return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Question bank</span><h1>題庫管理</h1><p>檢視題目來源、單元與發布狀態。未通過題目不會出現在學生端。</p></div><div className="container section-tight"><div className="table-wrap"><table><thead><tr><th>編號</th><th>來源</th><th>題幹</th><th>單元／難度</th><th>狀態</th><th>版本</th></tr></thead><tbody>{rows.map(q=><tr key={q.id}><td>{q.no}</td><td>{q.sourceType==="official"?"歷屆題型示範":"AI 模擬"}</td><td>{q.stem}</td><td>{q.unitName}／{q.difficulty}</td><td><span className={`badge ${q.status==="approved"?"badge-teal":q.status==="pending"?"badge-blue":"badge-red"}`}>{q.status}</span></td><td>v{q.version}</td></tr>)}</tbody></table></div></div></>;
}
