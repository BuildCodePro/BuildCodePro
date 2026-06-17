import { RoleAuthGuard } from "@/components/auth/role-auth-guard";
import { EstimatorShell } from "@/components/estimator";

interface EstimatorGroupLayoutProps {
  children: React.ReactNode;
}

export default function EstimatorGroupLayout({
  children,
}: EstimatorGroupLayoutProps) {
  return (
    <RoleAuthGuard allowedRoles={["estimator"]}>
      <EstimatorShell>{children}</EstimatorShell>
    </RoleAuthGuard>
  );
}
