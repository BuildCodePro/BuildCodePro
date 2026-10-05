import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleCard } from "@/components/ui/toggle-card";
import { OCCUPANCY_OPTIONS } from "@/lib/constants/occupancy";
import { OPTIONAL_SYSTEM_OPTIONS } from "@/lib/constants/project-info";
import type { ProjectInfoFormData } from "@/types/new-design";
import { type ReactNode, useMemo, useState } from "react";
import type { IntakeFieldSource as IntakeFieldSourceData } from "@/types/project-intake";
import {
  SPECIAL_NOTES_MAX_LENGTH,
  validateProjectInfoForm,
} from "@/lib/validations/project-info";

import { IntakeFieldSource } from "./intake-field-source";
import { ScopeOfWorkCard } from "./scope-of-work-card";
import { WizardSectionHeader } from "./wizard-navigation";

const CODE_EDITION_FIELDS = [
  { name: "ibcEdition", label: "IBC Edition" },
  { name: "ifcEdition", label: "IFC Edition" },
  { name: "nfpa72Edition", label: "NFPA 72 Edition" },
] as const;

interface ProjectInfoStepProps {
  data: ProjectInfoFormData;
  errors: Partial<Record<keyof ProjectInfoFormData, string>>;
  onChange: (data: ProjectInfoFormData) => void;
  fieldSources?: Partial<Record<keyof ProjectInfoFormData, IntakeFieldSourceData>>;
  intakeBanner?: ReactNode;
}

export function ProjectInfoStep({
  data,
  errors,
  onChange,
  fieldSources = {},
  intakeBanner = null,
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

  const [touchedFields, setTouchedFields] = useState<Set<keyof ProjectInfoFormData>>(new Set());
  const validation = useMemo(() => validateProjectInfoForm(data), [data]);
  const markTouched = (field: keyof ProjectInfoFormData) =>
    setTouchedFields((previous) => (previous.has(field) ? previous : new Set(previous).add(field)));
  const fieldError = (field: keyof ProjectInfoFormData) =>
    errors[field] ?? (touchedFields.has(field) ? validation.errors[field] : undefined);

  return (
    <div className="space-y-6">
      <WizardSectionHeader
        title="Confirm Project Info"
        description="We read these details from your drawings. Check each field and correct anything that's wrong."
      />

      {intakeBanner}

      {validation.warnings.length > 0 ? (
        <div role="status" className="space-y-1 rounded-xl border border-amber-400/50 bg-amber-50 px-4 py-3 dark:bg-amber-950/30">
          <p className="font-body text-sm font-semibold text-amber-800 dark:text-amber-300">Check before continuing</p>
          <ul className="list-disc space-y-0.5 pl-5 font-body text-sm text-amber-800 dark:text-amber-300">
            {validation.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

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
              onBlur={() => markTouched("projectName")}
              error={fieldError("projectName")}
            />
            <IntakeFieldSource source={fieldSources.projectName} />
            <FormField
              label="Address"
              name="address"
              placeholder="Full project address"
              value={data.address}
              onChange={(event) => updateField("address", event.target.value)}
              onBlur={() => markTouched("address")}
              error={fieldError("address")}
            />
            <IntakeFieldSource source={fieldSources.address} />
            <FormField
              label="Jurisdiction (AHJ)"
              name="jurisdiction"
              placeholder="e.g. Canyon County Fire District"
              value={data.jurisdiction}
              onChange={(event) =>
                updateField("jurisdiction", event.target.value)
              }
              onBlur={() => markTouched("jurisdiction")}
              error={fieldError("jurisdiction")}
            />
            <IntakeFieldSource source={fieldSources.jurisdiction} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {CODE_EDITION_FIELDS.map((editionField) => (
                <div key={editionField.name} className="space-y-3">
                  <FormField
                    label={editionField.label}
                    name={editionField.name}
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="e.g. 2018"
                    value={data[editionField.name]}
                    onChange={(event) =>
                      updateField(editionField.name, event.target.value)
                    }
                    onBlur={() => markTouched(editionField.name)}
                    error={fieldError(editionField.name)}
                  />
                  <IntakeFieldSource source={fieldSources[editionField.name]} />
                </div>
              ))}
            </div>
            <FormField
              label="Square Footage"
              name="squareFootage"
              type="number"
              placeholder="e.g. 45,000"
              value={data.squareFootage}
              onChange={(event) =>
                updateField("squareFootage", event.target.value)
              }
              onBlur={() => markTouched("squareFootage")}
              error={fieldError("squareFootage")}
            />
            <IntakeFieldSource source={fieldSources.squareFootage} />
            <FormField
              label="Number of Floors"
              name="numberOfFloors"
              type="number"
              placeholder="e.g. 3"
              value={data.numberOfFloors}
              onChange={(event) =>
                updateField("numberOfFloors", event.target.value)
              }
              onBlur={() => markTouched("numberOfFloors")}
              error={fieldError("numberOfFloors")}
            />
            <IntakeFieldSource source={fieldSources.numberOfFloors} />
            <SelectField
              label="Occupancy Classification"
              name="occupancyType"
              value={data.occupancyType}
              onChange={(value) => updateField("occupancyType", value)}
              placeholder="Select IBC occupancy if known — drawings can confirm"
              error={fieldError("occupancyType")}
              options={OCCUPANCY_OPTIONS}
            />
            <IntakeFieldSource source={fieldSources.occupancyType} />
          </CardContent>
        </Card>

        <ScopeOfWorkCard
          data={data}
          errors={errors}
          onFieldChange={updateField}
        />
      </div>

      <Card>
        <CardContent className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-section-title font-body">
              Optional System Requirements
            </h3>
            <p className="font-body text-sm text-stat-label">
              Hints for the engine. Drawings should confirm sprinklers, elevators,
              and ducts.
            </p>
          </div>
          <IntakeFieldSource source={fieldSources.optionalSystems} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              maxLength={SPECIAL_NOTES_MAX_LENGTH}
              aria-invalid={Boolean(fieldError("specialNotes"))}
              onBlur={() => markTouched("specialNotes")}
              name="specialNotes"
              placeholder="Add any special notes or requirements..."
              value={data.specialNotes}
              onChange={(event) =>
                updateField("specialNotes", event.target.value)
              }
            />
            <div className="flex justify-between gap-3 font-body text-xs">
              <span className="text-destructive">{fieldError("specialNotes") ?? ""}</span>
              <span className="text-stat-label tabular-nums">
                {data.specialNotes.length.toLocaleString()} / {SPECIAL_NOTES_MAX_LENGTH.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
