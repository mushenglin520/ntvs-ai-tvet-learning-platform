import { DashboardShell } from "@/components/DashboardShell";
import { requireRole } from "@/lib/auth";

export default async function TeacherLayout({children}:{children:React.ReactNode}){await requireRole("teacher");return <DashboardShell role="teacher">{children}</DashboardShell>}
