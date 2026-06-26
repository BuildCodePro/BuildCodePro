import { RoleAuthGuard } from "@/components/auth/role-auth-guard";
import { SuperAdminShell } from "@/components/super-admin/super-admin-shell";

interface SuperAdminGroupLayoutProps {
  children: React.ReactNode;
}

export default function SuperAdminGroupLayout({
  children,
}: SuperAdminGroupLayoutProps) {
  return (
    <RoleAuthGuard allowedRoles={["super_admin"]}>
      <SuperAdminShell>{children}</SuperAdminShell>
    </RoleAuthGuard>
  );
}
