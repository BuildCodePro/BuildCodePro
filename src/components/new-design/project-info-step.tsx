import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleCard } from "@/components/ui/toggle-card";
import {
  OCCUPANCY_TYPES,
  OPTIONAL_SYSTEM_OPTIONS,
} from "@/lib/constants/project-info";
import type { ProjectInfoFormData } from "@/types/new-design";

import { WizardSectionHeader } from "./wizard-navigation";

interface ProjectInfoStepProps {
  data: ProjectInfoFormData;
  errors: Partial<Record<keyof ProjectInfoFormData, string>>;
  onChange: (data: ProjectInfoFormData) => void;
}

export function ProjectInfoStep({
  data,
  errors,
  onChange,
}: ProjectInfoStepProps) {
  const updateField = <K extends keyof ProjectInfoFormData>(
    field: K,
    value: ProjectInfoFormData[K],
  ) => {
    onChange({ ...data, [field]: value });
  };

  const updateOptionalSystem = (
    key: keyof ProjectInfoFormData["optionalSystems"],
    value: boolean,
  ) => {
    onChange({
      ...data,
      optionalSystems: { ...data.optionalSystems, [key]: value },
    });
  };

  return (
    <div className="space-y-6">
      <WizardSectionHeader
        title="Project Details"
        description="Enter project metadata before AI analysis"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardContent className="space-y-4">
            <FormField
              label="Project Name"
              name="projectName"
              placeholder="e.g. Riverside Mall — Building A"
              value={data.projectName}
              onChange={(event) =>
                updateField("projectName", event.target.value)
              }
              error={errors.projectName}
            />
            <FormField
              label="Address"
              name="address"
              placeholder="Full project address"
              value={data.address}
              onChange={(event) => updateField("address", event.target.value)}
              error={errors.address}
            />
            <FormField
              label="Jurisdiction"
              name="jurisdiction"
              placeholder="e.g. Harris County, TX"
              value={data.jurisdiction}
              onChange={(event) =>
                updateField("jurisdiction", event.target.value)
              }
              error={errors.jurisdiction}
            />
            <FormField
              label="Square Footage"
              name="squareFootage"
              placeholder="e.g. 45,000"
              value={data.squareFootage}
              onChange={(event) =>
                updateField("squareFootage", event.target.value)
              }
              error={errors.squareFootage}
            />
            <FormField
              label="Number of Floors"
              name="numberOfFloors"
              placeholder="e.g. 3"
              value={data.numberOfFloors}
              onChange={(event) =>
                updateField("numberOfFloors", event.target.value)
              }
              error={errors.numberOfFloors}
            />
            <SelectField
              label="Occupancy Type"
              name="occupancyType"
              value={data.occupancyType}
              onChange={(value) => updateField("occupancyType", value)}
              placeholder="Select occupancy type..."
              error={errors.occupancyType}
              options={OCCUPANCY_TYPES.map((type) => ({
                value: type,
                label: type,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-section-title font-body">
                Optional System Requirements
              </h3>
              <p className="font-body text-sm text-stat-label">
                Include additional systems if applicable
              </p>
            </div>

            <div className="space-y-3">
              {OPTIONAL_SYSTEM_OPTIONS.map((option) => (
                <ToggleCard
                  key={option.id}
                  label={option.label}
                  description={option.description}
                  checked={data.optionalSystems[option.id]}
                  onCheckedChange={(checked) =>
                    updateOptionalSystem(option.id, checked)
                  }
                />
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialNotes">Special Notes</Label>
              <Textarea
                id="specialNotes"
                name="specialNotes"
                placeholder="Add any special notes or requirements..."
                value={data.specialNotes}
                onChange={(event) =>
                  updateField("specialNotes", event.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
