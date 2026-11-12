import { describe, expect, it } from "vitest";
import { callRpc, createDataClient } from "@/lib/supabase";

async function login(loginId:string,password:string){
  return callRpc<{token:string;role:string}>("login_user",{p_login_id:loginId,p_password:password});
}

describe("Supabase 雲端資料層",()=>{
  it("三種示範角色皆可登入並取得正確角色",async()=>{
    const users=await Promise.all([
      login("admin01","Admin115!"),login("teacher01","Teach115!"),login("s115001","Student115!")
    ]);
    expect(users.map(x=>x.role).sort()).toEqual(["admin","student","teacher"]);
  });

  it("資料表不允許 publishable key 直接讀取",async()=>{
    const {error}=await createDataClient().from("questions").select("id").limit(1);
    expect(error).not.toBeNull();
  });

  it("學生只能透過 RPC 取得不含答案的已審題目",async()=>{
    const session=await login("s115001","Student115!");
    const result=await callRpc<{questions:Array<Record<string,unknown>>}>("start_exam",{p_mode:"practice",p_source_type:"ai",p_unit_id:null,p_difficulty:null,p_count:3},session.token);
    expect(result.questions).toHaveLength(3);
    expect(result.questions.every(q=>q.answer===undefined&&q.options!==undefined)).toBe(true);
  });

  it("官方來源保留雜湊與待解析狀態",async()=>{
    const session=await login("teacher01","Teach115!");
    const rows=await callRpc<Array<{sha256:string;status:string}>>("teacher_sources",{},session.token);
    const official=rows.filter(r=>r.status==="downloaded_pending_parse");
    expect(official).toHaveLength(2);
    expect(official.every(r=>r.sha256.length===64)).toBe(true);
  });
});
