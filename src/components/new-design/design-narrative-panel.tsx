"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { RegenerateButton } from "@/components/ui/regenerate-button";
import { formatNarrativeSubtitle } from "@/lib/constants/narrative";
import { getProjectDisplayName } from "@/lib/constants/results";
import type { DesignNarrativeSection, ProjectInfoFormData } from "@/types/new-design";
import {
  useGetDesignNarrativeQuery,
  useRegenerateDesignNarrativeMutation,
  useUpdateDesignNarrativeMutation
} from "@/services/analysisResultsService";

import { NarrativeExportToggle } from "./narrative-export-toggle";
import { NarrativeSection } from "./narrative-section";
import { DesignNarrativeSkeleton } from "./design-narrative-skeleton";
import { EditNarrativeModal } from "./edit-narrative-modal";
import { toast } from "sonner";

interface DesignNarrativePanelProps {
  projectInfo: ProjectInfoFormData;
  projectId: string;
}

export function DesignNarrativePanel({
  projectInfo,
  projectId,
}: DesignNarrativePanelProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading } = useGetDesignNarrativeQuery(projectId);
  const regenerateMutation = useRegenerateDesignNarrativeMutation(projectId);
  const updateMutation = useUpdateDesignNarrativeMutation(projectId);

  if (isLoading || !data) {
    return <DesignNarrativeSkeleton />;
  }

  const projectName = getProjectDisplayName(projectInfo);
  const subtitle = formatNarrativeSubtitle(projectName, data.generated_at);

  const handleRegenerate = () => {
    regenerateMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("AI Generated design regenerate successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to regenerate design.");
      },
    });
  };

  const handleSave = (payload: Parameters<typeof updateMutation.mutate>[0]) => {
    updateMutation.mutate(payload, {
      onSuccess: () => {
        setIsEditModalOpen(false),
          toast.success("AI Generated design updated successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to update design.");
      },
    });
  };

  // Convert API sections object into an array for rendering
  const sectionKeys = [
    { id: "project_summary", title: "Project Summary" },
    { id: "design_assumptions", title: "Design Assumptions" },
    { id: "device_placement_logic", title: "Device Placement Logic" },
    { id: "material_estimate_summary", title: "Material Estimate Summary" },
    { id: "compliance_notes", title: "Compliance Notes" },
    { id: "review_disclaimer", title: "Review Disclaimer" }
  ];

  const renderableSections: DesignNarrativeSection[] = sectionKeys.map(sk => ({
    id: sk.id,
    title: sk.title,
    content: data.sections[sk.id as keyof typeof data.sections]
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-narrative-title">AI-Generated Design Narrative</h3>
          <p className="text-stat-label">{subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-9 max-w-none rounded-lg px-4 font-body text-sm font-semibold"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </Button>
          <RegenerateButton onClick={handleRegenerate} isRegenerating={regenerateMutation.isPending} />
        </div>
      </div>

      <div className="space-y-6">
        {renderableSections.map((section) => (
          <NarrativeSection key={section.id} section={section} />
        ))}
      </div>

      <NarrativeExportToggle
        checked={data.include_in_export}
        onCheckedChange={(includeInExport) => {
          updateMutation.mutate({
            sections: data.sections,
            include_in_export: includeInExport
          });
        }}
      />

      {isEditModalOpen && (
        <EditNarrativeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          sections={data.sections}
          includeInExport={data.include_in_export}
          isSubmitting={updateMutation.isPending}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
