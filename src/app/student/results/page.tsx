import { getSessionToken, requireRole } from "@/lib/auth";
import { callRpc } from "@/lib/supabase";

export const dynamic="force-dynamic";
type Attempt={id:number;mode:string;source_type:string;submitted_at:string;score:number;duration_sec:number;questionIds:number[]};
type Weak={unitName:string;total:number;wrong:number};
export default async function ResultsPage(){
  await requireRole("student");
  const data=await callRpc<{attempts:Attempt[];weak:Weak[]}>("student_results",{},await getSessionToken());
  const {attempts,weak}=data;
  return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Learning diagnosis</span><h1>成績與學習診斷</h1><p>歷屆題型示範與 AI 模擬題分開呈現；弱點依你實際作答的錯誤比例排序。</p></div><div className="container section-tight"><div className="grid-2"><article className="card"><h3>常錯知識點</h3>{weak.length?<div className="mini-bars" style={{marginTop:18}}>{weak.map(w=>{const pct=Math.round((w.wrong/w.total)*100);return <div className="bar-row" key={w.unitName}><span>{w.unitName}</span><div className="bar-track"><div className="bar-fill" style={{width:`${pct}%`}}/></div><strong>{pct}%</strong></div>})}</div>:<p>完成自主練習或模擬考後，這裡會出現診斷。</p>}</article><article className="card"><h3>補強建議</h3>{weak.length?<><p>先從「{weak[0].unitName}」的基礎題開始，完成 5 題即時回饋練習，再進入 3 題模擬考驗證。</p><div className="callout">建議以「看解析 → 說出原理 → 換一題驗證」三步驟進行，而不是只背答案。</div></>:<p>目前資料不足。建議先完成一組 5 題自主練習。</p>}</article></div><h2 style={{marginTop:30,color:"#071b2e"}}>歷次紀錄</h2><div className="table-wrap"><table><thead><tr><th>日期</th><th>模式</th><th>題庫</th><th>題數</th><th>分數</th><th>耗時</th></tr></thead><tbody>{attempts.length?attempts.map(a=><tr key={a.id}><td>{new Date(a.submitted_at).toLocaleString("zh-TW")}</td><td>{a.mode==="practice"?"自主練習":"模擬考"}</td><td>{a.source_type==="official"?"歷屆題型示範":"AI 模擬題"}</td><td>{a.questionIds.length}</td><td><strong>{a.score} 分</strong></td><td>{Math.max(1,Math.round((a.duration_sec||0)/60))} 分</td></tr>):<tr><td colSpan={6}>尚無完成紀錄。</td></tr>}</tbody></table></div></div></>;
}
