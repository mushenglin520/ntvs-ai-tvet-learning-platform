import { getSessionToken, requireRole } from "@/lib/auth";
import { callRpc } from "@/lib/supabase";

export const dynamic="force-dynamic";
type UnitStat={unitName:string;total:number;correct:number}; type StudentStat={name:string;classCode:string;attempts:number;average:number};
export default async function AnalyticsPage(){
  await requireRole("teacher","admin");
  const data=await callRpc<{units:UnitStat[];students:StudentStat[]}>("teacher_analytics",{},await getSessionToken()); const rows=data.units; const students=data.students;
  return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Class analytics</span><h1>學習成效分析</h1><p>目前彙整本汽車科示範帳號資料；所有資料操作均由 Supabase RLS 與角色 RPC 保護。</p></div><div className="container section-tight"><div className="grid-2"><article className="card"><h3>知識點正確率</h3><div className="mini-bars" style={{marginTop:18}}>{rows.map(r=>{const pct=r.total?Math.round((r.correct/r.total)*100):0;return <div className="bar-row" key={r.unitName}><span>{r.unitName}</span><div className="bar-track"><div className="bar-fill" style={{width:`${pct}%`}}/></div><strong>{pct}%</strong></div>})}</div></article><article className="card"><h3>學生概況</h3><div className="table-wrap" style={{marginTop:18}}><table><thead><tr><th>學生</th><th>班級</th><th>完成</th><th>平均</th></tr></thead><tbody>{students.map(s=><tr key={s.name}><td>{s.name}</td><td>{s.classCode}</td><td>{s.attempts}</td><td>{s.average}%</td></tr>)}</tbody></table></div></article></div></div></>;
}
