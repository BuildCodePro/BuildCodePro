export const ESTIMATOR_SETTINGS_TABS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
] as const;

export type EstimatorSettingsTabId =
  (typeof ESTIMATOR_SETTINGS_TABS)[number]["id"];
