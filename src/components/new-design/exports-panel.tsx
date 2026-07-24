"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AlertBanner } from "@/components/ui/alert-banner";
import { FormField } from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { buildExportPreviewData } from "@/lib/constants/exports";
import { formatOccupancyType } from "@/lib/utils/format-project-metadata";
import {
  useCreateExportMutation,
  useExportPreviewQuery,
  useListExportsQuery,
  type CreateExportRequest,
  type ExportPreviewResponse,
} from "@/services/exportService";
import type { DesignResults, ExportFormatId, ExportPreviewData, ProjectInfoFormData } from "@/types/new-design";

import { ExportOptionsPanel } from "./export-options-panel";
import type { ExportSectionsPayload } from "./export-options-panel";
import { PdfReportPreview } from "./pdf-report-preview";

interface ExportsPanelProps {
  projectInfo: ProjectInfoFormData;
  projectId?: string | null;
  results?: DesignResults;
}

function formatNumber(value?: number): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return value.toLocaleString("en-US");
}

function mapApiPreviewToPreviewData(data: ExportPreviewResponse): ExportPreviewData {
  const project = data.project;
  const analysis = data.analysis_result;
  const stats = analysis.stats;
  const bomSummary = analysis.bom_summary;
  const recommendations = analysis.recommendations;

  return {
    companyName: data.company_name || "BuildCode Pro",
    companyLogoUrl: data.company_logo_url,
    projectName: project.name || "Untitled Project",
    occupancy: formatOccupancyType(project.occupancy_type),
    address: project.address || "—",
    squareFootage: formatNumber(project.square_footage),
    floors: formatNumber(project.number_of_floors),
    initiatingDevices: formatNumber(recommendations.initiating_devices.device_count),
    notificationDevices: formatNumber(recommendations.notification_appliances.device_count),
    controlDevices: formatNumber(recommendations.control_equipment.device_count),
    totalItems: formatNumber(bomSummary.total_items),
    estimatedCable: `${formatNumber(stats.estimated_wiring_ft)} ft`,
    estimatedConduit: `${formatNumber(bomSummary.conduit)} ft`,
    complianceScore: `${stats.compliance_status_pct}%`,
    complianceStatus: stats.compliance_label,
    flaggedItems: formatNumber(stats.review_flags_count),
  };
}

function getExportFormat(format: ExportFormatId): CreateExportRequest["format"] {
  return format === "email" ? "pdf" : format;
}

function openDownload(downloadUrl?: string) {
  if (!downloadUrl) return;
  window.open(downloadUrl, "_blank", "noopener,noreferrer");
}

const EMAIL_EXPORT_FORM_ID = "email-export-form";

export function ExportsPanel({ projectInfo, projectId, results }: ExportsPanelProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientEmailError, setRecipientEmailError] = useState<string | null>(null);

  const fallbackPreviewData = buildExportPreviewData(projectInfo, results);
  const previewQuery = useExportPreviewQuery(projectId || undefined);
  const exportsQuery = useListExportsQuery(projectId || undefined, {
    page: 1,
    pageSize: 5,
  });
  const createExportMutation = useCreateExportMutation(projectId || undefined);

  const previewData = previewQuery.data
    ? mapApiPreviewToPreviewData(previewQuery.data)
    : fallbackPreviewData;

  const handleCreateExport = async (
    format: ExportFormatId,
    sections: ExportSectionsPayload,
    recipientEmail?: string,
  ) => {
    if (!projectId) {
      toast.error("Project is missing. Please create or load a project first.");
      return;
    }

    try {
      const response = await createExportMutation.mutateAsync({
        format: getExportFormat(format),
        sections,
        recipient_email: recipientEmail,
      });

      if (recipientEmail || format === "email") {
        toast.success(`Export sent${response.emailed_to ? ` to ${response.emailed_to}` : ""}.`);
      } else {
        toast.success("Export created successfully.");
        openDownload(response.download_url);
      }
    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : error.data.message;
      toast.error(message);
    }
  };

  const handleOpenEmailModal = () => {
    setRecipientEmail("");
    setRecipientEmailError(null);
    setIsEmailModalOpen(true);
  };

  const handleEmailExportSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = recipientEmail.trim();
    if (!email) {
      setRecipientEmailError("Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRecipientEmailError("Enter a valid email address.");
      return;
    }

    setRecipientEmailError(null);
    await handleCreateExport("email", {
      design_recommendations: true,
      bom: true,
      compliance_checklist: true,
      design_narrative: true,
      nfpa_disclaimer: true,
      company_branding: true,
    }, email);
    setIsEmailModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {!projectId ? (
        <AlertBanner
          title="Export unavailable"
          description="A project must be created before exports can be generated."
        />
      ) : null}

      {previewQuery.isError ? (
        <AlertBanner
          title="Couldn't load export preview"
          description="Showing local preview data instead. Please try again."
        />
      ) : null}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <PdfReportPreview data={previewData} />
        <div className="space-y-6">
          <ExportOptionsPanel
            disabled={!projectId}
            isExporting={createExportMutation.isPending}
            onDownload={handleCreateExport}
            onExportCsv={() =>
              handleCreateExport("csv", {
                design_recommendations: false,
                bom: true,
                compliance_checklist: false,
                design_narrative: false,
                nfpa_disclaimer: false,
                company_branding: false,
              })
            }
            onSendEmail={handleOpenEmailModal}
          />

          <section className="space-y-3 rounded-[12px] border border-border bg-white p-4">
            <div>
              <h4 className="text-narrative-section-title">Recent Exports</h4>
              <p className="text-stat-label">Latest generated project exports</p>
            </div>

            {exportsQuery.isLoading ? (
              <p className="text-sm text-stat-label">Loading exports...</p>
            ) : exportsQuery.data?.items.length ? (
              <div className="space-y-2">
                {exportsQuery.data.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-[8px] border border-border px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{item.file_name}</p>
                      <p className="text-xs text-stat-label">
                        {item.format.toUpperCase()} • {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                    {item.recipient_email ? (
                      <span className="shrink-0 text-xs text-stat-label">{item.recipient_email}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stat-label">No exports generated yet.</p>
            )}
          </section>
        </div>
      </div>

      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Send Export via Email"
        description="Enter the recipient email address to send the PDF report link."
        confirmText="Send Email"
        cancelText="Cancel"
        isConfirming={createExportMutation.isPending}
        formId={EMAIL_EXPORT_FORM_ID}
      >
        <form
          id={EMAIL_EXPORT_FORM_ID}
          className="space-y-4"
          onSubmit={handleEmailExportSubmit}
          noValidate
        >
          <FormField
            label="Recipient Email"
            name="recipientEmail"
            type="email"
            autoComplete="email"
            placeholder="user@example.com"
            value={recipientEmail}
            onChange={(event) => {
              setRecipientEmail(event.target.value);
              if (recipientEmailError) setRecipientEmailError(null);
            }}
            error={recipientEmailError ?? undefined}
            required
          />
        </form>
      </Modal>
    </div>
  );
}
