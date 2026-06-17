"use client";

import { useState } from "react";

import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import { ESTIMATOR_SETTINGS_TABS, type EstimatorSettingsTabId } from "@/lib/constants/estimator";

import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { SecuritySettingsPanel } from "@/components/settings/security-settings-panel";

import { EstimatorModuleHeader } from "./estimator-module-header";

export function EstimatorSettingsContent() {
  const [activeTab, setActiveTab] = useState<EstimatorSettingsTabId>("profile");

  return (
    <div className="flex w-full flex-col gap-6">
      <EstimatorModuleHeader
        title="Account Settings"
        description="Manage your profile and security — billing is managed by your company admin"
      />

      <UnderlineTabs
        tabs={[...ESTIMATOR_SETTINGS_TABS]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        aria-label="Estimator settings sections"
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
