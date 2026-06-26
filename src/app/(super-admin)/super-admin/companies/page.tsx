import type { Metadata } from "next";

import { CompaniesContent } from "@/components/super-admin/companies-content";

export const metadata: Metadata = {
  title: "Companies",
  description: "Manage contractor companies on the BuildCode Pro platform",
};

export default function SuperAdminCompaniesPage() {
  return <CompaniesContent />;
}
