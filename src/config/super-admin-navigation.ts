import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CreditCard,
  HeadphonesIcon,
  LayoutDashboard,
  Users,
} from "lucide-react";

import { routes } from "@/config/routes";

export interface SuperAdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const superAdminNavigation: SuperAdminNavItem[] = [
  {
    label: "Dashboard",
    href: routes.superAdmin.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Companies",
    href: routes.superAdmin.companies,
    icon: Building2,
  },
  {
    label: "Users",
    href: routes.superAdmin.users,
    icon: Users,
  },
  {
    label: "Subscriptions",
    href: routes.superAdmin.subscriptions,
    icon: CreditCard,
  },
  {
    label: "Support",
    href: routes.superAdmin.support,
    icon: HeadphonesIcon,
  },
];
