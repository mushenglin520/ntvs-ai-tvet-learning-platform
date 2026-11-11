import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import type { Role, UserSession } from "@/lib/types";

export const SESSION_COOKIE = "tvet_session";

export async function getCurrentUser(): Promise<UserSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = db.prepare(`
    SELECT p.id, p.login_id AS loginId, p.display_name AS displayName, p.role, p.class_code AS classCode
    FROM sessions s JOIN profiles p ON p.id = s.user_id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as UserSession | undefined;
  return row ?? null;
}

export async function requireRole(...roles: Role[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect(user.role === "student" ? "/student" : user.role === "teacher" ? "/teacher" : "/admin");
  return user;
}

export function getUserFromToken(token?: string): UserSession | null {
  if (!token) return null;
  return (db.prepare(`
    SELECT p.id, p.login_id AS loginId, p.display_name AS displayName, p.role, p.class_code AS classCode
    FROM sessions s JOIN profiles p ON p.id = s.user_id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as UserSession | undefined) ?? null;
}
