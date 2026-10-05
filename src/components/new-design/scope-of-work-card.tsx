import { Card, CardContent } from "@/components/ui/card";
import { SelectField } from "@/components/ui/select";
import { ToggleCard } from "@/components/ui/toggle-card";
import {
  COMMUNICATION_TYPE_OPTIONS,
  MANUFACTURER_OPTIONS,
  PANEL_FAMILY_OPTIONS,
  SYSTEM_SCOPE_OPTIONS,
  scopeRequiresCommunication,
} from "@/lib/constants/system-scope";
import type { ProjectInfoFormData } from "@/types/new-design";

interface ScopeOfWorkCardProps {
  data: ProjectInfoFormData;
  errors: Partial<Record<keyof ProjectInfoFormData, string>>;
  onFieldChange: <K extends keyof ProjectInfoFormData>(
    field: K,
    value: ProjectInfoFormData[K],
  ) => void;
}

export function ScopeOfWorkCard({
  data,
  errors,
  onFieldChange,
}: ScopeOfWorkCardProps) {
  const selectedScope = SYSTEM_SCOPE_OPTIONS.find(
    (option) => option.value === data.systemScope,
  );
  const showCommunicationField = scopeRequiresCommunication(data.systemScope);

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="space-y-1">
          <h3 className="text-section-title font-body">Scope of Work</h3>
          <p className="font-body text-sm text-stat-label">
            Tells the design engine what system to produce. This is the
            difference between a monitoring panel and a building-wide system.
          </p>
        </div>

        <SelectField
          label="System Scope"
          name="systemScope"
          value={data.systemScope}
          onChange={(value) => onFieldChange("systemScope", value)}
          placeholder="Select the scope of work..."
          error={errors.systemScope}
          options={SYSTEM_SCOPE_OPTIONS}
        />

        {selectedScope ? (
          <p className="font-body text-sm text-stat-label">
            {selectedScope.description}
          </p>
        ) : null}

        <SelectField
          label="Monitoring Communication"
          name="monitoringCommunicationType"
          value={data.monitoringCommunicationType}
          onChange={(value) =>
            onFieldChange("monitoringCommunicationType", value)
          }
          placeholder={
            showCommunicationField
              ? "How does the panel reach the central station?"
              : "Optional — copper, cellular, or radio"
          }
          error={errors.monitoringCommunicationType}
          options={COMMUNICATION_TYPE_OPTIONS}
        />

        <SelectField
          label="Preferred Manufacturer"
          name="preferredManufacturer"
          value={data.preferredManufacturer}
          onChange={(value) => onFieldChange("preferredManufacturer", value)}
          placeholder="Optional — your standard product line"
          error={errors.preferredManufacturer}
          options={MANUFACTURER_OPTIONS}
        />

        <SelectField
          label="Panel Family"
          name="preferredPanelFamily"
          value={data.preferredPanelFamily}
          onChange={(value) => onFieldChange("preferredPanelFamily", value)}
          placeholder="Optional — e.g. AFC Series"
          error={errors.preferredPanelFamily}
          options={PANEL_FAMILY_OPTIONS}
        />

        <ToggleCard
          label="Bid to minimum code"
          description="Specify only what the code requires. Turn off to allow recommended betterments."
          checked={data.bidToMinimumCode}
          onCheckedChange={(checked) =>
            onFieldChange("bidToMinimumCode", checked)
          }
        />
      </CardContent>
    </Card>
  );
}
