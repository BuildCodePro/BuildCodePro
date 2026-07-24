import { AlertBanner } from "@/components/ui/alert-banner";
import { RegenerateButton } from "@/components/ui/regenerate-button";
import { COMPLIANCE_DISCLAIMER } from "@/lib/constants/compliance";
import type { ComplianceChecklistSection, ComplianceItemStatus } from "@/types/new-design";
import { useGetComplianceChecklistQuery, useRegenerateComplianceChecklistMutation } from "@/services/analysisResultsService";

import { ComplianceChecklistSectionCard } from "./compliance-checklist-section-card";
import { ComplianceChecklistSkeleton } from "./compliance-checklist-skeleton";
import { toast } from "sonner";

interface ComplianceChecklistPanelProps {
  projectId: string;
}

export function ComplianceChecklistPanel({
  projectId,
}: ComplianceChecklistPanelProps) {
  const { data, isLoading } = useGetComplianceChecklistQuery(projectId);
  const regenerateMutation = useRegenerateComplianceChecklistMutation(projectId);



  if (isLoading || !data) {
    return <ComplianceChecklistSkeleton />;
  }

  // Map API response to UI expected format
  const mappedSections: ComplianceChecklistSection[] = data.sections.map((sec, idx) => ({
    id: `section-${idx}`,
    title: sec.title,
    items: sec.items.map((item) => ({
      id: item.id,
      label: item.label,
      status: (item.status.replace("_", "-") as ComplianceItemStatus),
    })),
  }));

  const disclaimerText = data.disclaimer || COMPLIANCE_DISCLAIMER.description;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <RegenerateButton
          onClick={() => {
            regenerateMutation.mutate(undefined, {
              onSuccess: () => {
                toast.success("Compliance checklist regenerated successfully.");
              },
              onError: (error: any) => {
                toast.error(error?.message || "Failed to regenerate checklist.");
              },
            });
          }}
          isRegenerating={regenerateMutation.isPending}
        />
      </div>

      {mappedSections.map((section) => (
        <ComplianceChecklistSectionCard key={section.id} section={section} />
      ))}

      <AlertBanner
        title={COMPLIANCE_DISCLAIMER.title}
        description={disclaimerText}
      />
    </div>
  );
}
