"use client";

import { useState } from "react";

import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import {
  ENGINEER_SETTINGS_TABS,
  type EngineerSettingsTabId,
} from "@/lib/constants/engineer";

import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { SecuritySettingsPanel } from "@/components/settings/security-settings-panel";

import { EngineerModuleHeader } from "./engineer-module-header";

export function EngineerSettingsContent() {
  const [activeTab, setActiveTab] = useState<EngineerSettingsTabId>("profile");

  return (
    <div className="flex w-full flex-col gap-6">
      <EngineerModuleHeader
        title="Account Settings"
        description="Manage your profile and security settings"
      />

      <UnderlineTabs
        tabs={[...ENGINEER_SETTINGS_TABS]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        aria-label="Engineer settings sections"
      />

      <TabPanel
        id={`tabpanel-${activeTab}`}
        labelledBy={`tab-${activeTab}`}
      >
        {activeTab === "profile" ? <ProfileSettingsForm /> : null}
        {activeTab === "security" ? <SecuritySettingsPanel /> : null}
      </TabPanel>
    </div>
  );
}
