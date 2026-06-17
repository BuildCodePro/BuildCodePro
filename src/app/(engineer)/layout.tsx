import { RoleAuthGuard } from "@/components/auth/role-auth-guard";
import { EngineerShell } from "@/components/engineer";

interface EngineerGroupLayoutProps {
  children: React.ReactNode;
}

export default function EngineerGroupLayout({
  children,
}: EngineerGroupLayoutProps) {
  return (
    <RoleAuthGuard allowedRoles={["engineer"]}>
      <EngineerShell>{children}</EngineerShell>
    </RoleAuthGuard>
  );
}
