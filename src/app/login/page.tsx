import { Header } from "@/components/Header";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return <div className="site-shell"><Header /><main className="section"><div className="container"><div className="form-card card"><span className="eyebrow" style={{color:"#087a75"}}>Local demo access</span><h1 style={{margin:"12px 0 8px",color:"#071b2e"}}>登入示範平台</h1><p style={{color:"#5e7182",lineHeight:1.7}}>本機環境使用虛構帳號與密碼。學號不能單獨登入；正式版將改接學校核准驗證機制。</p><LoginForm /><div className="callout" style={{marginTop:20}}><strong>示範帳號</strong><br/>學生：s115001／Student115!<br/>教師：teacher01／Teach115!<br/>管理員：admin01／Admin115!</div></div></div></main></div>;
}
