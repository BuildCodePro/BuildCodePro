import type { Metadata } from "next";

import { EngineerSettingsContent } from "@/components/engineer";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your BuildCode Pro engineer profile and security",
};

export default function EngineerSettingsPage() {
  return <EngineerSettingsContent />;
}
