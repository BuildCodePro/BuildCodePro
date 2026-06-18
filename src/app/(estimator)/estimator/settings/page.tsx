import type { Metadata } from "next";

import { EstimatorSettingsContent } from "@/components/estimator";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your BuildCode Pro estimator profile and security",
};

export default function EstimatorSettingsPage() {
  return <EstimatorSettingsContent />;
}
