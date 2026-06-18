import type { Metadata } from "next";

import { SupportContent } from "@/components/support/support-content";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help and contact BuildCode Pro support",
};

export default function EstimatorSupportPage() {
  return <SupportContent />;
}
