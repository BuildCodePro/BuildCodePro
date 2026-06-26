import { engineerNavigation } from "@/config/engineer-navigation";
import { routes } from "@/config/routes";

export function getEngineerPageTitle(pathname: string): string {
  const exactMatch = engineerNavigation.find((item) => item.href === pathname);
  if (exactMatch) {
    return exactMatch.label;
  }

  if (pathname.startsWith(`${routes.engineer.projects}/`)) {
    return "Project Review";
  }

  const nestedMatch = engineerNavigation.find(
    (item) =>
      item.href !== routes.engineer.dashboard &&
      pathname.startsWith(`${item.href}/`),
  );

  return nestedMatch?.label ?? "Dashboard";
}
