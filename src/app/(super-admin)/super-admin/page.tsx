import type { Metadata } from "next";

import { SuperAdminDashboardContent } from "@/components/super-admin/super-admin-dashboard-content";

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
  description: "BuildCode Pro platform administration dashboard",
};

export default function SuperAdminDashboardPage() {
  return <SuperAdminDashboardContent />;
}
