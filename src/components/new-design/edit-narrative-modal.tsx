"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import type { DesignNarrativeApiSections, UpdateDesignNarrativePayload } from "@/types/analysis-results";

interface EditNarrativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: DesignNarrativeApiSections;
  includeInExport: boolean;
  isSubmitting: boolean;
  onSave: (data: UpdateDesignNarrativePayload) => void;
}

export function EditNarrativeModal({
  isOpen,
  onClose,
  sections,
  includeInExport,
  isSubmitting,
  onSave,
}: EditNarrativeModalProps) {
  const { register, handleSubmit, reset } = useForm<DesignNarrativeApiSections>({
    defaultValues: sections,
  });

  useEffect(() => {
    if (isOpen) {
      reset(sections);
    }
  }, [isOpen, sections, reset]);

  const onSubmit = handleSubmit((data) => {
    onSave({
      sections: data,
      include_in_export: includeInExport,
    });
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Design Narrative"
      description="Modify the AI-generated design narrative sections."
      confirmText="Save Changes"
      cancelText="Cancel"
      isConfirming={isSubmitting}
      formId="edit-narrative-form"
    >
      <form id="edit-narrative-form" onSubmit={onSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto px-1">
        <FormField label="Project Summary">
          <Textarea {...register("project_summary")} rows={3} />
        </FormField>

        <FormField label="Design Assumptions">
          <Textarea {...register("design_assumptions")} rows={3} />
        </FormField>

        <FormField label="Device Placement Logic">
          <Textarea {...register("device_placement_logic")} rows={4} />
        </FormField>

        <FormField label="Material Estimate Summary">
          <Textarea {...register("material_estimate_summary")} rows={3} />
        </FormField>

        <FormField label="Compliance Notes">
          <Textarea {...register("compliance_notes")} rows={4} />
        </FormField>

        <FormField label="Review Disclaimer">
          <Textarea {...register("review_disclaimer")} rows={2} />
        </FormField>
      </form>
    </Modal>
  );
}
