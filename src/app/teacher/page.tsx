import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, FileText, Users } from "lucide-react";
import { getSessionToken, requireRole } from "@/lib/auth";
import { callRpc } from "@/lib/supabase";

export const dynamic="force-dynamic";
export default async function TeacherDashboard(){
  await requireRole("teacher","admin");
  const data=await callRpc<{counts:Record<string,number>;sources:number;students:number}>("teacher_dashboard",{},await getSessionToken());
  const {counts:map,sources,students}=data;
  return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Teacher workspace</span><h1>教師審題與教學總覽</h1><p>先確認來源、答案、解析與分類；只有通過的題目才會進入學生題庫。</p></div><div className="container section-tight"><div className="grid-4"><div className="card stat-card"><Clock3 className="icon-box"/><strong>{map.pending||0}</strong><span>待審題目</span></div><div className="card stat-card"><CheckCircle2 className="icon-box"/><strong>{map.approved||0}</strong><span>已通過題目</span></div><div className="card stat-card"><FileText className="icon-box"/><strong>{sources}</strong><span>來源文件</span></div><div className="card stat-card"><Users className="icon-box"/><strong>{students}</strong><span>示範學生</span></div></div><div className="grid-2" style={{marginTop:20}}><article className="card card-accent"><h3>今日優先：完成待審題</h3><p>逐題檢查題幹、四個選項、標準答案與解析；退回或不採用都須填寫理由。</p><Link className="btn btn-primary" href="/teacher/review">進入審題 <ArrowRight size={17}/></Link></article><article className="card card-accent"><h3>官方來源已保存</h3><p>115 年動力機械群專業科目（一）試題與標準答案來源已登錄，尚未解析成題目。</p><Link className="btn btn-dark" href="/teacher/import">檢視來源 <ArrowRight size={17}/></Link></article></div></div></>;
}
