import { RoleAuthGuard } from "@/components/auth/role-auth-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

interface DashboardGroupLayoutProps {
  children: React.ReactNode;
}

export default function DashboardGroupLayout({
  children,
}: DashboardGroupLayoutProps) {
  return (
    <RoleAuthGuard allowedRoles={["company"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleAuthGuard>
  );
}
