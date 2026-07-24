import type { Metadata } from "next";

import { SettingsContent } from "@/components/settings/settings-content";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your BuildCode Pro account settings",
};

export default function SettingsPage() {
  return <SettingsContent />;
}
