import type { Metadata } from "next";

import { EngineerDashboardContent } from "@/components/dashboard/api-dashboard-content";

export const metadata: Metadata = {
  title: "Engineer Dashboard",
  description:
    "BuildCode Pro PE reviewer dashboard — review AI output and approve designs for permit submission",
};

export default function EngineerDashboardPage() {
  return <EngineerDashboardContent />;
}
