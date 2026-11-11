import { describe,expect,it } from "vitest";
import { db } from "@/lib/db";
import { selectPublishedQuestions } from "@/lib/questions";

describe("本機資料整合",()=>{
  it("建立三種示範角色",()=>{const roles=db.prepare("SELECT role,COUNT(*) AS count FROM profiles GROUP BY role").all() as {role:string;count:number}[];expect(roles.map(r=>r.role).sort()).toEqual(["admin","student","teacher"])});
  it("學生題庫只回傳已通過題目",()=>{const rows=selectPublishedQuestions("ai",null,null,20);expect(rows.length).toBeGreaterThan(0);const ids=rows.map(r=>r.id);const pending=db.prepare("SELECT id FROM questions WHERE status='pending'").all() as {id:number}[];expect(pending.some(p=>ids.includes(p.id))).toBe(false)});
  it("官方來源文件保留雜湊與待解析狀態",()=>{const rows=db.prepare("SELECT sha256,import_status FROM source_documents WHERE year=115").all() as {sha256:string;import_status:string}[];expect(rows).toHaveLength(2);expect(rows.every(r=>r.sha256.length===64&&r.import_status==="downloaded_pending_parse")).toBe(true)});
});
