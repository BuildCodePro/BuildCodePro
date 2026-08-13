import type { Metadata } from "next";

import { LlmSettingsContent } from "@/components/super-admin";

export const metadata: Metadata = {
  title: "LLM Settings — Super Admin",
  description: "Manage AI providers and model priority for BuildCode Pro",
};

export default function LlmSettingsPage() {
  return <LlmSettingsContent />;
}
