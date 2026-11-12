import { getSessionToken, requireRole } from "@/lib/auth";
import { callRpc } from "@/lib/supabase";
import { MockExamClient } from "./MockExamClient";

export const dynamic = "force-dynamic";
export default async function MockExamPage(){
  await requireRole("student");
  const units=await callRpc<{id:number;name:string}[]>("list_units",{},await getSessionToken());
  return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Mock exam</span><h1>模擬考試</h1><p>答案不會在作答中傳到前端；交卷或倒數結束後，由伺服器一次評分並顯示解析。</p></div><div className="container section-tight"><MockExamClient units={units}/></div></>;
}
