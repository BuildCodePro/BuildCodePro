import { superAdminNavigation } from "@/config/super-admin-navigation";
import { routes } from "@/config/routes";

export function getSuperAdminPageTitle(pathname: string): string {
  const exactMatch = superAdminNavigation.find((item) => item.href === pathname);
  if (exactMatch) {
    return exactMatch.label;
  }

  const nestedMatch = superAdminNavigation.find(
    (item) =>
      item.href !== routes.superAdmin.dashboard &&
      pathname.startsWith(`${item.href}/`),
  );

  return nestedMatch?.label ?? "Super Admin";
}
