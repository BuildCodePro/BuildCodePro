import type { Metadata } from "next";

import { BillingContent } from "@/components/billing/billing-content";

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage your BuildCode Pro subscription and billing",
};

export default function BillingPage() {
  return <BillingContent />;
}
