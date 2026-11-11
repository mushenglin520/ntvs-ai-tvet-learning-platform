"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ loginId: data.get("loginId"), password: data.get("password") }) });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return setError(result.error || "登入失敗");
    router.push(result.redirectTo); router.refresh();
  }
  return <form onSubmit={submit} style={{marginTop:22}}>{error && <div className="form-error" role="alert">{error}</div>}<div className="field"><label htmlFor="loginId">帳號／學號</label><input className="input" id="loginId" name="loginId" autoComplete="username" required defaultValue="s115001" /></div><div className="field"><label htmlFor="password">密碼</label><input className="input" id="password" name="password" type="password" autoComplete="current-password" required defaultValue="Student115!" /></div><button className="btn btn-primary" disabled={loading} style={{width:"100%"}}><LogIn size={18}/>{loading ? "登入中…" : "登入"}</button></form>;
}
