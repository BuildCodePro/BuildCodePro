export const SETTINGS_TABS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

export interface ProfileSettings {
  fullName: string;
  email: string;
  companyName: string;
  phone: string;
}

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  fullName: "John Doe",
  email: "john@acmefire.com",
  companyName: "Acme Fire Protection",
  phone: "+1 (555) 123-4567",
};

export const ACCEPTED_LOGO_TYPES = ["image/png", "image/svg+xml"] as const;
export const ACCEPTED_LOGO_EXTENSIONS = [".png", ".svg"] as const;

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent?: boolean;
}

export const ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: "session-1",
    device: "Windows · Chrome",
    location: "Austin, TX",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "session-2",
    device: "iPhone · Safari",
    location: "Austin, TX",
    lastActive: "2 days ago",
  },
];
