import type { Metadata } from "next";

import { EstimatorDashboardContent } from "@/components/dashboard/api-dashboard-content";

export const metadata: Metadata = {
  title: "Estimator Dashboard",
  description:
    "BuildCode Pro estimator dashboard — manage fire alarm estimation projects",
};

export default function EstimatorDashboardPage() {
  return <EstimatorDashboardContent />;
}
