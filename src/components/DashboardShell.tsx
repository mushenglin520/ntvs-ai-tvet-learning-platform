import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, BookOpenCheck, ClipboardCheck, FileUp, LayoutDashboard, Library, Settings, Stethoscope } from "lucide-react";
import { Header } from "@/components/Header";
import type { Role } from "@/lib/types";

const menus = {
  student: [
    ["/student", "學習總覽", LayoutDashboard], ["/student/practice", "自主練習", BookOpenCheck],
    ["/student/mock-exam", "模擬考試", ClipboardCheck], ["/student/results", "成績診斷", Stethoscope],
  ],
  teacher: [
    ["/teacher", "教師總覽", LayoutDashboard], ["/teacher/review", "教師審題", ClipboardCheck],
    ["/teacher/import", "來源匯入", FileUp], ["/teacher/questions", "題庫管理", Library],
    ["/teacher/analytics", "學習分析", BarChart3],
  ],
  admin: [["/admin", "系統設定", Settings]],
} as const;

export function DashboardShell({ role, children }: { role: Role; children: ReactNode }) {
  return <div className="site-shell"><Header /><div className="dashboard-layout"><aside className="sidebar"><div className="sidebar-label">工作區</div>{menus[role].map(([href, label, Icon]) => <Link className="navlink" href={href} key={href}><Icon size={17} />{label}</Link>)}</aside><main className="dashboard-main">{children}</main></div></div>;
}
