import { NextResponse } from "next/server";
import { z } from "zod";
import { SESSION_COOKIE } from "@/lib/auth";
import { callRpc } from "@/lib/supabase";

const schema = z.object({ loginId: z.string().min(1).max(50), password: z.string().min(1).max(200) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "請輸入帳號與密碼" }, { status: 400 });
  try {
    const session = await callRpc<{token:string;expiresAt:string;role:string}>("login_user", {
      p_login_id: parsed.data.loginId,
      p_password: parsed.data.password,
    });
    const redirectTo = session.role === "student" ? "/student" : session.role === "teacher" ? "/teacher" : "/admin";
    const response = NextResponse.json({ ok: true, redirectTo });
    response.cookies.set(SESSION_COOKIE, session.token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: new Date(session.expiresAt), path: "/" });
    return response;
  } catch {
    return NextResponse.json({ error: "帳號或密碼不正確" }, { status: 401 });
  }
}
