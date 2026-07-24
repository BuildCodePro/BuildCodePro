import { getMainNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";
import { useAuthStore } from "@/store/auth-store";

export function getPageTitle(pathname: string): string {
  const user = useAuthStore.getState().user;

  const navigation = getMainNavigation({
    team_accounts: user?.team_accounts,
    dedicated_support: user?.dedicated_support,
  });

  const exactMatch = navigation.find((item) => item.href === pathname);

  if (exactMatch) {
    return exactMatch.label;
  }

  if (pathname.startsWith(`${routes.projects}/`)) {
    return "Project Details";
  }

  const nestedMatch = navigation.find(
    (item) =>
      item.href !== routes.dashboard &&
      pathname.startsWith(`${item.href}/`),
  );

  return nestedMatch?.label ?? "Dashboard";
}