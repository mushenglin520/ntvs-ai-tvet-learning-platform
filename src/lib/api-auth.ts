import { getUserFromToken, SESSION_COOKIE } from "@/lib/auth";

export function getRequestUser(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const token = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))?.[1];
  return getUserFromToken(token);
}
