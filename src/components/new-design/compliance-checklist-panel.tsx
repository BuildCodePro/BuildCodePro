"use client";

import { toast } from "sonner";

import { AlertBanner } from "@/components/ui/alert-banner";
import { RegenerateButton } from "@/components/ui/regenerate-button";
import { COMPLIANCE_DISCLAIMER } from "@/lib/constants/compliance";
import {
  useGetComplianceChecklistQuery,
  useRegenerateComplianceChecklistMutation,
} from "@/services/analysisResultsService";

import { CalculationsPanel } from "./calculations-panel";
import { ComplianceChecklistSkeleton } from "./compliance-checklist-skeleton";
import { ComplianceMatrixTable } from "./compliance-matrix-table";
import { ScopeExclusionsCard } from "./scope-exclusions-card";

interface ComplianceChecklistPanelProps {
  projectId: string;
}

function formatUnresolvedSummary(unresolvedCount: number): string {
  if (unresolvedCount === 0) {
    return "No unresolved items";
  }
  const itemNoun = unresolvedCount === 1 ? "item needs" : "items need";
  return `${unresolvedCount} ${itemNoun} a designer decision`;
}

export function ComplianceChecklistPanel({
  projectId,
}: ComplianceChecklistPanelProps) {
  const { data, isLoading } = useGetComplianceChecklistQuery(projectId);
  const regenerateMutation = useRegenerateComplianceChecklistMutation(projectId);

  if (isLoading || !data) {
    return <ComplianceChecklistSkeleton />;
  }

  const disclaimerText = data.disclaimer || COMPLIANCE_DISCLAIMER.description;

  const handleRegenerate = () => {
    regenerateMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Compliance checklist regenerated successfully.");
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to regenerate checklist.";
        toast.error(message);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-body text-sm text-stat-label">
          {formatUnresolvedSummary(data.unresolved_count ?? 0)}
        </p>
        <RegenerateButton
          onClick={handleRegenerate}
          isRegenerating={regenerateMutation.isPending}
        />
      </div>

      <ScopeExclusionsCard
        scopeSummary={data.scope_summary}
        exclusions={data.scope_exclusions ?? []}
        missingRequiredDeviceTypes={data.missing_required_device_types ?? []}
      />

      <ComplianceMatrixTable items={data.matrix ?? []} />

      <CalculationsPanel calculations={data.calculations} />

      <AlertBanner
        title={COMPLIANCE_DISCLAIMER.title}
        description={disclaimerText}
      />
    </div>
  );
}
