import { getSessionToken, requireRole } from "@/lib/auth";
import { callRpc } from "@/lib/supabase";
import { ReviewQueue } from "./ReviewQueue";

export const dynamic="force-dynamic";
type ReviewRow={id:number;originalNo:string;stem:string;options:Record<string,string>;answer:string;explanation:string;difficulty:string;sourceType:string;sourceLabel:string;version:number;unitName:string};
export default async function ReviewPage(){
  await requireRole("teacher");
  const items=await callRpc<ReviewRow[]>("teacher_review_queue",{},await getSessionToken());
  return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Review before release</span><h1>教師審題</h1><p>待審內容不會出現在學生端。每次審核都會記錄教師、時間、版本與理由。</p></div><div className="container section-tight"><ReviewQueue initialItems={items}/></div></>;
}
