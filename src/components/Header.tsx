import Link from "next/link";
import { Gauge } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export async function Header() {
  const user = await getCurrentUser();
  const home = user?.role === "student" ? "/student" : user?.role === "teacher" ? "/teacher" : user?.role === "admin" ? "/admin" : "/";
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link className="brand" href={home}>
          <span className="brand-mark"><Gauge size={25} /></span>
          <span>AI 統測自主學習<small>新北高工｜汽車科 MVP</small></span>
        </Link>
        <nav className="navlinks" aria-label="主要導覽">
          <Link className="navlink" href="/">首頁</Link>
          {user ? <><span className="nav-user">{user.displayName}</span><LogoutButton /></> : <Link className="navlink" href="/login">登入</Link>}
        </nav>
      </div>
    </header>
  );
}
