import { estimatorNavigation } from "@/config/estimator-navigation";
import { routes } from "@/config/routes";

export function getEstimatorPageTitle(pathname: string): string {
  const exactMatch = estimatorNavigation.find((item) => item.href === pathname);
  if (exactMatch) {
    return exactMatch.label;
  }

  if (pathname.startsWith(`${routes.estimator.projects}/`)) {
    return "Project Details";
  }

  const nestedMatch = estimatorNavigation.find(
    (item) =>
      item.href !== routes.estimator.dashboard &&
      pathname.startsWith(`${item.href}/`),
  );

  return nestedMatch?.label ?? "Dashboard";
}
