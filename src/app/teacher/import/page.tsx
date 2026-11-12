import { getSessionToken, requireRole } from "@/lib/auth";
import { callRpc } from "@/lib/supabase";
import { ImportForm } from "./ImportForm";

export const dynamic="force-dynamic";
type SourceDoc={id:number;year:number;filename:string;url:string;sha256:string|null;status:string;note:string};
export default async function ImportPage(){
  await requireRole("teacher","admin");
  const docs=await callRpc<SourceDoc[]>("teacher_sources",{},await getSessionToken());
  return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Source control</span><h1>來源匯入與追溯</h1><p>PDF 先保存為待解析來源；CSV 可匯入待審題。所有真實題目仍需教師核對後才能發布。</p></div><div className="container section-tight"><div className="grid-2"><article className="card"><h3>上傳 PDF／CSV</h3><ImportForm/><div className="callout" style={{marginTop:18}}>CSV 欄位：stem、option_a、option_b、option_c、option_d、answer、explanation、unit、difficulty、source_type。</div></article><article className="card"><h3>115 年官方來源</h3><p>已依官方頁面登錄「02 動力機械群／專業科目（一）」試題與標準答案。尚未自動解析成題目。</p><a className="source-link" href="https://web1.tcte.edu.tw/EXAM/115_4y/" target="_blank" rel="noreferrer">開啟官方公告頁</a></article></div><h2 style={{marginTop:30,color:"#071b2e"}}>來源文件清單</h2><div className="table-wrap"><table><thead><tr><th>年度</th><th>檔名</th><th>狀態</th><th>SHA-256</th><th>說明</th></tr></thead><tbody>{docs.map(d=><tr key={d.id}><td>{d.year}</td><td>{d.url.startsWith("http")?<a className="source-link" href={d.url} target="_blank" rel="noreferrer">{d.filename}</a>:d.filename}</td><td><span className="badge badge-gray">{d.status}</span></td><td><code>{d.sha256?.slice(0,14)||"—"}…</code></td><td>{d.note}</td></tr>)}</tbody></table></div></div></>;
}
