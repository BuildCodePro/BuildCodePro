import type { Metadata } from "next";

import { SupportContent } from "@/components/super-admin/support-content";

export const metadata: Metadata = {
  title: "Support",
  description: "Manage platform support requests and tickets",
};

export default function SuperAdminSupportPage() {
  return <SupportContent />;
}
