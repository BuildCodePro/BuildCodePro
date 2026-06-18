import type { Metadata } from "next";

import { TeamContent } from "@/components/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Invite and manage estimators, engineers, and admins on your company account",
};

export default function TeamPage() {
  return <TeamContent />;
}
