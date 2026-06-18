import { mainNavigation } from "@/config/navigation";
import { routes } from "@/config/routes";

export function getPageTitle(pathname: string): string {
  const exactMatch = mainNavigation.find((item) => item.href === pathname);
  if (exactMatch) {
    return exactMatch.label;
  }

  if (pathname.startsWith(`${routes.projects}/`)) {
    return "Project Details";
  }

  const nestedMatch = mainNavigation.find(
    (item) =>
      item.href !== routes.dashboard &&
      pathname.startsWith(`${item.href}/`),
  );

  return nestedMatch?.label ?? "Dashboard";
}
