import type { Metadata } from "next";

import { SubscriptionsContent } from "@/components/super-admin/subscriptions-content";

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Manage subscription plans and platform billing",
};

export default function SuperAdminSubscriptionsPage() {
  return <SubscriptionsContent />;
}
