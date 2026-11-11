import { DashboardShell } from "@/components/DashboardShell";
import { requireRole } from "@/lib/auth";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  await requireRole("student");
  return <DashboardShell role="student">{children}</DashboardShell>;
}
