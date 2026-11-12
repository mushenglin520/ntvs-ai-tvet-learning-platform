import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";
import { callRpc, readSessionToken } from "@/lib/supabase";

export async function POST(request: Request) {
  const token = readSessionToken(request, SESSION_COOKIE);
  if (token) await callRpc<void>("logout_user", {}, token).catch(() => undefined);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { expires: new Date(0), path: "/" });
  return response;
}
