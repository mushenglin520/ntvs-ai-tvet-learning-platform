import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

const schema = z.object({ loginId: z.string().min(1).max(50), password: z.string().min(1).max(200) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "請輸入帳號與密碼" }, { status: 400 });
  const user = db.prepare("SELECT id, login_id, password_salt, password_hash, role FROM profiles WHERE login_id = ?").get(parsed.data.loginId) as { id:number; password_salt:string; password_hash:string; role:string } | undefined;
  if (!user || !verifyPassword(parsed.data.password, user.password_salt, user.password_hash)) return NextResponse.json({ error: "帳號或密碼不正確" }, { status: 401 });
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 8 * 60 * 60 * 1000);
  db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(token, user.id, expires.toISOString());
  const redirectTo = user.role === "student" ? "/student" : user.role === "teacher" ? "/teacher" : "/admin";
  const response = NextResponse.json({ ok: true, redirectTo });
  response.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires, path: "/" });
  return response;
}
