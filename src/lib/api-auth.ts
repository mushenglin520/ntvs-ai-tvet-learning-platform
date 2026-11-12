import { getUserFromToken, SESSION_COOKIE } from "@/lib/auth";
import { readSessionToken } from "@/lib/supabase";

export async function getRequestUser(request: Request) {
  return getUserFromToken(readSessionToken(request, SESSION_COOKIE));
}
