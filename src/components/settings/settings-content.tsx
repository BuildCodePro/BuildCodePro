"use client";

import { useState } from "react";

import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import { SETTINGS_TABS, type SettingsTabId } from "@/lib/constants/settings";

import { ProfileSettingsForm } from "./profile-settings-form";
import { SecuritySettingsPanel } from "./security-settings-panel";

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");

  return (
    <div className="flex w-full flex-col gap-6">
      <UnderlineTabs
        tabs={[...SETTINGS_TABS]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        aria-label="Settings sections"
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
