"use client";

import { useState } from "react";

import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import { SETTINGS_TABS, type SettingsTabId } from "@/lib/constants/settings";
import { useAuthStore } from "@/store/auth-store";

import { AppearanceSettingsPanel } from "./appearance-settings-panel";
import { ProfileSettingsForm } from "./profile-settings-form";
import { SecuritySettingsPanel } from "./security-settings-panel";

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profile");
  const isCompanyOwner = useAuthStore((state) => state.role === "company_owner");
  const visibleTabs = SETTINGS_TABS.filter((settingsTab) => isCompanyOwner || settingsTab.id !== "appearance");

  return (
    <div className="flex w-full flex-col gap-6">
      <UnderlineTabs
        tabs={[...visibleTabs]}
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
        {activeTab === "appearance" && isCompanyOwner ? <AppearanceSettingsPanel /> : null}
      </TabPanel>
    </div>
  );
}
