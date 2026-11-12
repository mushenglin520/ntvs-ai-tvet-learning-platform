import Link from "next/link";
import { ArrowRight, BookOpenCheck, BrainCircuit, ClipboardCheck, Target } from "lucide-react";
import { getSessionToken, requireRole } from "@/lib/auth";
import { callRpc } from "@/lib/supabase";

export const dynamic = "force-dynamic";
type DashboardData={stats:{attempts:number;average:number;best:number};bank:{source_type:string;count:number}[]};

export default async function StudentDashboard() {
  const user = await requireRole("student");
  const data=await callRpc<DashboardData>("student_dashboard",{},await getSessionToken());
  const stats=data.stats; const counts=Object.fromEntries(data.bank.map(r=>[r.source_type,r.count]));
  return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Student dashboard</span><h1>{user.displayName}，今天要練哪一個弱點？</h1><p>{user.classCode}｜專業科目（一）：應用力學、引擎原理、底盤原理</p></div><div className="container section-tight">
    <div className="callout">目前為 Supabase 雲端示範版。歷屆題庫區的可作答題目是「虛構題型示範」，不是下載的官方原題；官方 PDF 仍待教師核對。</div>
    <div className="grid-4" style={{marginTop:20}}><div className="card stat-card"><Target className="icon-box"/><strong>{stats.attempts}</strong><span>已完成學習紀錄</span></div><div className="card stat-card"><BrainCircuit className="icon-box"/><strong>{stats.average}%</strong><span>平均正確率</span></div><div className="card stat-card"><BookOpenCheck className="icon-box"/><strong>{counts.official || 0}</strong><span>歷屆題型示範</span></div><div className="card stat-card"><ClipboardCheck className="icon-box"/><strong>{counts.ai || 0}</strong><span>已審 AI 模擬題</span></div></div>
    <div className="grid-2" style={{marginTop:20}}><article className="card card-accent"><span className="badge badge-blue">每題立即回饋</span><h3 style={{marginTop:14}}>自主練習</h3><p>依題庫、單元、難度與題數自訂練習；答完立即看答案、解析與知識點。</p><Link className="btn btn-dark" href="/student/practice">開始自主練習 <ArrowRight size={17}/></Link></article><article className="card card-accent"><span className="badge badge-teal">交卷後統一解析</span><h3 style={{marginTop:14}}>模擬考試</h3><p>作答中不揭露答案；交卷後由伺服器評分，避免重複交卷。</p><Link className="btn btn-primary" href="/student/mock-exam">進入模擬考 <ArrowRight size={17}/></Link></article></div>
  </div></>;
}
