import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role, UserSession } from "@/lib/types";
import { callRpc } from "@/lib/supabase";

export const SESSION_COOKIE = "tvet_session";

export async function getSessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try { return await callRpc<UserSession | null>("get_current_user", {}, token); }
  catch { return null; }
}

export async function requireRole(...roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect(user.role === "student" ? "/student" : user.role === "teacher" ? "/teacher" : "/admin");
  return user;
}

export async function getUserFromToken(token?: string): Promise<UserSession | null> {
  if (!token) return null;
  try { return await callRpc<UserSession | null>("get_current_user", {}, token); }
  catch { return null; }
}
