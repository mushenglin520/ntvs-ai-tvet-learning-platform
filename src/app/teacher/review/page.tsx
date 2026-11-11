import { db } from "@/lib/db";
import { ReviewQueue } from "./ReviewQueue";

export const dynamic="force-dynamic";
type ReviewRow={id:number;originalNo:string;stem:string;optionsJson:string;answer:string;explanation:string;difficulty:string;sourceType:string;sourceLabel:string;version:number;unitName:string};
export default function ReviewPage(){const rows=db.prepare(`SELECT q.id,q.original_no AS originalNo,q.stem,q.options_json AS optionsJson,q.answer,q.explanation,q.difficulty,q.source_type AS sourceType,q.source_label AS sourceLabel,q.version,u.unit_name AS unitName FROM questions q JOIN units u ON u.id=q.unit_id WHERE q.status='pending' ORDER BY q.id`).all() as ReviewRow[];const items=rows.map(({optionsJson,...row})=>({...row,options:JSON.parse(optionsJson) as Record<string,string>}));return <><div className="container page-title"><span className="eyebrow" style={{color:"#087a75"}}>Review before release</span><h1>教師審題</h1><p>待審內容不會出現在學生端。每次審核都會記錄教師、時間、版本與理由。</p></div><div className="container section-tight"><ReviewQueue initialItems={items}/></div></>}
