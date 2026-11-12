import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export class DataError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
  }
}

/** 建立不保存 Supabase Auth 狀態的資料用戶端；權限由 HttpOnly 工作階段標頭判斷。 */
export function createDataClient(token?: string): SupabaseClient<any> {
  if (!url || !key) throw new DataError("尚未設定 Supabase 環境變數");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: token ? { "x-session-token": token } : {} },
  });
}

export async function callRpc<T>(name: string, args: Record<string, unknown> = {}, token?: string): Promise<T> {
  const { data, error } = await createDataClient(token).rpc(name, args);
  if (error) throw new DataError(error.message, error.code);
  return data as T;
}

export function readSessionToken(request: Request, cookieName = "tvet_session") {
  const cookie = request.headers.get("cookie") || "";
  return cookie.match(new RegExp(`(?:^|;\\s*)${cookieName}=([^;]+)`))?.[1];
}
