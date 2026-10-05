import { AlertBanner } from "@/components/ui/alert-banner";
import { Card, CardContent } from "@/components/ui/card";
import type { ScopeExclusionApi } from "@/types/analysis-results";

interface ScopeExclusionsCardProps {
  scopeSummary: string | null;
  exclusions: ScopeExclusionApi[];
  missingRequiredDeviceTypes: string[];
}

function humanizeDeviceType(deviceType: string): string {
  return deviceType
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ScopeExclusionsCard({
  scopeSummary,
  exclusions,
  missingRequiredDeviceTypes,
}: ScopeExclusionsCardProps) {
  const hasNothingToShow =
    !scopeSummary &&
    exclusions.length === 0 &&
    missingRequiredDeviceTypes.length === 0;

  if (hasNothingToShow) {
    return null;
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-section-title font-body">
            Scope of Work Applied
          </h3>
          {scopeSummary ? (
            <p className="font-body text-sm text-stat-label">{scopeSummary}</p>
          ) : null}
        </div>

        {missingRequiredDeviceTypes.length > 0 ? (
          <AlertBanner
            title="Required equipment missing from this design"
            description={`This scope requires ${missingRequiredDeviceTypes
              .map(humanizeDeviceType)
              .join(", ")}. Add it before bidding.`}
          />
        ) : null}

        {exclusions.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-body text-sm font-medium">
              Removed as outside scope
            </h4>
            <ul className="space-y-1">
              {exclusions.map((exclusion) => (
                <li
                  key={exclusion.device_type}
                  className="font-body text-sm text-stat-label"
                >
                  <span className="font-medium">
                    {exclusion.quantity} ×{" "}
                    {humanizeDeviceType(exclusion.device_type)}
                  </span>{" "}
                  — {exclusion.exclusion_reason}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
