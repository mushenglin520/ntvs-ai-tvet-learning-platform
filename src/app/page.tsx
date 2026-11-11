import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, BrainCircuit, ClipboardCheck, DatabaseZap, GraduationCap, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";

const flows = [
  ["01", "資料準備", "保存官方 PDF、來源網址、下載時間與雜湊；真實題目前置於待審。", DatabaseZap],
  ["02", "智慧分析", "題目、答案與知識點分開處理，信心不足就回到人工確認。", BrainCircuit],
  ["03", "模擬命題", "新題預設待審，不把本機規則產生內容偽裝成官方試題。", BookOpenCheck],
  ["04", "教師審題", "通過、退回或不採用都保留備註與版本紀錄。", ClipboardCheck],
  ["05", "網站學習", "歷屆題型示範與 AI 模擬題分流，練習、考試流程清楚。", GraduationCap],
  ["06", "學習診斷", "以作答紀錄找出弱點，提供可立即執行的補強建議。", BarChart3],
] as const;

export default function Home() {
  return <div className="site-shell"><Header />
    <section className="hero"><div className="container hero-grid"><div>
      <span className="eyebrow">Automotive learning lab</span>
      <h1>把每一次作答，變成下一步的學習方向。</h1>
      <p>新北高工動力機械群／汽車科第一階段本機示範版。教師先把關，學生再練習；歷屆題型與 AI 模擬題分開記錄，讓來源、成績與診斷都可追溯。</p>
      <div className="hero-actions"><Link className="btn btn-primary" href="/login">進入示範平台 <ArrowRight size={18} /></Link><a className="btn btn-ghost" href="#workflow">查看六大工作流</a></div>
    </div><div className="hero-panel"><span>本機 MVP 完成度</span><strong> A–E</strong><div className="hero-meter"><i /></div><p>免付費 API、免 Supabase 金鑰。含教師審題、學生雙題庫、自主練習、模擬考試與個人診斷。</p><span className="demo-badge">所有可作答題目皆為虛構示範題</span></div></div></section>
    <section id="workflow" className="section"><div className="container"><div className="section-head"><div><span className="eyebrow" style={{color:"#087a75"}}>Human-in-the-loop</span><h2>六大教學工作流</h2></div><p>從官方資料保存到學生診斷，每一步都有責任邊界；待審內容不會自動進入學生題庫。</p></div><div className="grid-3">{flows.map(([no,title,desc,Icon]) => <article className="card workflow-card" key={no}><span className="workflow-no">STEP {no}</span><div className="icon-box"><Icon size={22}/></div><h3>{title}</h3><p>{desc}</p></article>)}</div></div></section>
    <section className="section" style={{background:"#eaf1f5"}}><div className="container grid-2"><article className="card card-accent"><ShieldCheck className="icon-box" size={42}/><h3>教師審題入口</h3><p>檢視來源、答案與解析；通過、退回修改或不採用，皆需留下審核備註。</p><Link className="btn btn-dark" href="/login">以教師身分登入</Link></article><article className="card card-accent"><GraduationCap className="icon-box" size={42}/><h3>學生學習入口</h3><p>分別練習歷屆題型示範與 AI 模擬題，完成模擬考後查看弱點與補強建議。</p><Link className="btn btn-primary" href="/login">以學生身分登入</Link></article></div></section>
    <footer className="footer"><div className="container">第一階段本機示範版｜官方試題僅保存為待教師核對來源，網站可作答內容均標示為虛構示範。</div></footer>
  </div>;
}
