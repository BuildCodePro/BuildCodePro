import type { Metadata } from "next";

import { CompanyDashboardContent } from "@/components/dashboard/api-dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "BuildCode Pro dashboard — manage fire alarm estimation projects",
};

export default function DashboardPage() {
  return <CompanyDashboardContent />;
}
