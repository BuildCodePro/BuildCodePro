import type { Metadata } from "next";

import { UsersContent } from "@/components/super-admin/users-content";

export const metadata: Metadata = {
  title: "Users",
  description: "Manage platform users and role permissions",
};

export default function SuperAdminUsersPage() {
  return <UsersContent />;
}
