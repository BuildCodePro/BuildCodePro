"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { MetricCard, MetricCardGrid } from "@/components/ui/metric-card";
import { MetricCardSkeleton } from "@/components/ui/metric-card-skeleton";
import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import {
  RESULTS_TABS,
  getProjectDisplayName,
} from "@/lib/constants/results";
import {
  formatComplianceSubtitle,
  formatProjectMetadata,
} from "@/lib/utils/format-project-metadata";
import type {
  DesignRecommendation,
  DesignResults,
  ProjectInfoFormData,
  RecommendationAccent,
  RecommendationBadgeVariant,
  ResultsTabId,
} from "@/types/new-design";
import { useAnalysisResultQuery } from "@/services/analysisService";
import { useCreateExportMutation } from "@/services/exportService";
import { useGetProjectQuery, useSendForReviewMutation, useEngineersQuery } from "@/services/projectService";
import { useModulePermission } from "@/hooks/use-permission";
import { useState } from "react";

import { BomMaterialTakeoffPanel } from "./bom-material-takeoff-panel";
import { ComplianceChecklistPanel } from "./compliance-checklist-panel";
import { ComplianceScoreHeader } from "./compliance-score-header";
import { DesignRecommendationsPanel } from "./design-recommendations-panel";
import { DesignNarrativePanel } from "./design-narrative-panel";
import { ExportsPanel } from "./exports-panel";
import { ResultsProjectHeader } from "./results-project-header";
import { UpgradeAccountFallback } from "./upgrade-account-fallback";
import Link from "next/link";
import { formatDate } from "@/lib/utils/format-date";
import { Select, SelectField } from "../ui";
import { useAuthStore } from "@/store/auth-store"

interface ResultsStepProps {
  projectInfo: ProjectInfoFormData;
  projectId?: string;
  results?: DesignResults;
  onExport?: () => void;
}

export function ResultsStep({
  projectInfo,
  projectId,
  results,
  onExport,
}: ResultsStepProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<ResultsTabId>("design-recommendations");
  const [isSendForReviewOpen, setIsSendForReviewOpen] = useState(false);
  const [selectedEngineerId, setSelectedEngineerId] = useState<string>("");

  const createExportMutation = useCreateExportMutation(projectId);
  const sendForReviewMutation = useSendForReviewMutation(projectId);
  const { hasModule } = useModulePermission();
  const User = useAuthStore();


  // --- Fetch the single project first, so we know its workflow_status ---
  const {
    data: projectDetail,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useGetProjectQuery(projectId ?? "");

  const { data: engineersData, isLoading: isEngineersLoading } =
    useEngineersQuery();
  const engineers = engineersData?.items ?? [];
  const hasEngineers = engineers.length > 0;

  const workflowStatus: string | undefined = projectDetail?.workflow_status;

  const isDraftWorkflow = workflowStatus === "draft";

  // Send for Review is only valid once AI analysis has finished.
  const canSendForReview = workflowStatus === "ai_complete" || workflowStatus === "change_request";

  const {
    data: analysisResult,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
    error: analysisError,
  } = useAnalysisResultQuery(isDraftWorkflow ? null : projectId);

  const projectName = getProjectDisplayName(projectInfo);
  const metadata = formatProjectMetadata(projectInfo);
  const complianceSubtitle = formatComplianceSubtitle(projectInfo, projectName);
  const drawingImage = analysisResult?.drawings[0]?.file_url;

  const canUseBom = hasModule("bom_generation");
  const canUseCompliance = hasModule("compliance_engine");

  const handleExportReport = async () => {
    if (onExport) {
      onExport();
      return;
    }

    if (!projectId) {
      toast.error("Project is missing. Please open a valid project first.");
      return;
    }

    try {
      const response = await createExportMutation.mutateAsync({
        format: "csv",
        sections: {
          design_recommendations: true,
          bom: true,
          compliance_checklist: true,
          design_narrative: true,
          nfpa_disclaimer: true,
          company_branding: true,
        },
      });

      toast.success("CSV export created successfully.");

      if (response.download_url) {
        window.open(response.download_url, "_blank", "noopener,noreferrer");
      }
    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : error.data.message;
      toast.error(message);
    }
  };

  const handleResumeProject = () => {
    if (!projectId) {
      toast.error("Project is missing. Please open a valid project first.");
      return;
    }
    router.push(``);
  };

  const handleConfirmSendForReview = async () => {
    if (!projectId) {
      toast.error("Project is missing. Please open a valid project first.");
      return;
    }

    if (!selectedEngineerId) {
      toast.error("Please select an engineer to send this project for review.");
      return;
    }

    try {
      await sendForReviewMutation.mutateAsync({
        engineer_user_id: selectedEngineerId,
      });
      toast.success("Project sent for engineer review.");
      setIsSendForReviewOpen(false);
      setSelectedEngineerId("");
    } catch (error: any) {
      const message =
        error instanceof Error
          ? error.message
          : error?.data?.message || "Failed to send project for review.";
      toast.error(message);
    }
  };

  // --- Metrics: fully dynamic from the analysis result API when available ---
  const metrics = analysisResult
    ? [
      {
        id: "suggested-devices",
        label: "Suggested Devices",
        value: analysisResult.stats.suggested_devices.toLocaleString(
          "en-US",
        ),
        description: analysisResult.stats.suggested_devices_label,
      },
      {
        id: "estimated-wiring",
        label: "Estimated Wiring",
        value: `${analysisResult.stats.estimated_wiring_ft.toLocaleString(
          "en-US",
        )} ft`,
        description: analysisResult.stats.estimated_wiring_label,
      },
      {
        id: "compliance-pct",
        label: "Compliance",
        value: `${analysisResult.stats.compliance_status_pct}%`,
        description: analysisResult.stats.compliance_label,
      },
      {
        id: "review-flags",
        label: "Review Flags",
        value: analysisResult.stats.review_flags_count.toLocaleString(
          "en-US",
        ),
        description: analysisResult.stats.review_flags_label,
      },
    ]
    : results?.metrics || [];

  const recommendations: DesignRecommendation[] = analysisResult
    ? [
      {
        id: "initiating",
        title: "Initiating Devices",
        count: `${analysisResult.recommendations.initiating_devices.device_count ?? 0} devices`,
        description:
          analysisResult.recommendations.initiating_devices.description,
        accent: "red" as RecommendationAccent,
        badge:
          analysisResult.recommendations.initiating_devices.score_pct != null
            ? `${analysisResult.recommendations.initiating_devices.score_pct}%`
            : "—",
        badgeVariant:
          ((analysisResult.recommendations.initiating_devices.score_pct ?? 0) >=
            90
            ? "success"
            : "warning") as RecommendationBadgeVariant,
        items: analysisResult.recommendations.initiating_devices.items,
      },
      {
        id: "notification",
        title: "Notification Appliances",
        count: `${analysisResult.recommendations.notification_appliances.device_count ?? 0} devices`,
        description:
          analysisResult.recommendations.notification_appliances.description,
        accent: "yellow" as RecommendationAccent,
        badge:
          analysisResult.recommendations.notification_appliances.score_pct !=
            null
            ? `${analysisResult.recommendations.notification_appliances.score_pct}%`
            : "—",
        badgeVariant:
          ((analysisResult.recommendations.notification_appliances.score_pct ??
            0) >= 90
            ? "success"
            : "warning") as RecommendationBadgeVariant,
        items: analysisResult.recommendations.notification_appliances.items,
      },
      {
        id: "control",
        title: "Control Equipment",
        count: `${analysisResult.recommendations.control_equipment.device_count ?? 0} panels`,
        description:
          analysisResult.recommendations.control_equipment.description,
        accent: "green" as RecommendationAccent,
        badge:
          analysisResult.recommendations.control_equipment.score_pct != null
            ? `${analysisResult.recommendations.control_equipment.score_pct}%`
            : "—",
        badgeVariant:
          ((analysisResult.recommendations.control_equipment.score_pct ?? 0) >=
            90
            ? "success"
            : "warning") as RecommendationBadgeVariant,
        items: analysisResult.recommendations.control_equipment.items,
      },
      {
        id: "review",
        title: "Review Required",
        count: `${analysisResult.recommendations.review_required.flag_count ?? 0} flags`,
        description:
          analysisResult.recommendations.review_required.description,
        accent: "orange" as RecommendationAccent,
        badge: "—",
        badgeVariant: "warning" as RecommendationBadgeVariant,
        items: analysisResult.recommendations.review_required.items,
      },
    ]
    : results?.recommendations || [];

  const compliance = analysisResult
    ? {
      score: analysisResult.stats.compliance_status_pct,
      statusLabel: analysisResult.stats.compliance_label,
      reviewCount: analysisResult.stats.review_flags_count,
    }
    : {
      score: results?.compliance?.score || 0,
      statusLabel: results?.compliance?.statusLabel || "Pending",
      reviewCount: results?.compliance?.reviewCount || 0,
    };

  // --- Still figuring out the project's workflow status ---
  if (isProjectLoading) {
    return (
      <div className="space-y-6">
        <MetricCardGrid>
          {Array.from({ length: 4 }).map((_, index) => (
            <MetricCardSkeleton
              key={`project-status-skeleton-${index}`}
              hasDescription={true}
            />
          ))}
        </MetricCardGrid>
      </div>
    );
  }

  // --- Draft workflow: never fetch/show analysis results. Show a resume
  // fallback instead so the user can go finish the wizard for this project. ---
  if (isDraftWorkflow) {
    return (
      <div className="space-y-6">

        <ResultsProjectHeader
          projectName={projectName}
          metadata={metadata}
          generatedAt={undefined}
        />

        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-amber-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="size-6 text-amber-600"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="font-body text-base font-semibold text-foreground">
                This project is still a draft
              </h3>
              <p className="mx-auto max-w-md font-body text-sm text-stat-label">
                Drawings haven&apos;t been uploaded and AI analysis hasn&apos;t
                run yet for this project. Resume the project to finish the
                remaining steps before viewing results.
              </p>
            </div>

            <Link
              href={`/company/new-design?projectId=${projectId}&step=project-info`}
              className="flex h-11 max-w-[300px] items-center justify-center rounded-lg bg-primary px-6 text-white hover:bg-primary/80"
            >
              Resume Project
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {isProjectError ? (
        <AlertBanner
          title="Couldn't confirm project status"
          description="Showing the best available results. Some data may be out of date."
        />
      ) : null}

      {isAnalysisError ? (
        <AlertBanner
          title="Couldn't load analysis result"
          description={
            analysisError instanceof Error
              ? analysisError.message
              : "Showing preview data instead. Please try again."
          }
        />
      ) : null}
      {projectDetail?.engineer_notes && (

        <AlertBanner
          variant="warning"
          title="Engineer Notes"
          description={projectDetail?.engineer_notes}
          badge={projectDetail?.workflow_status}
          time={formatDate(projectDetail?.engineer_reviewed_at || "")}
        />
      )}

      {activeTab === "compliance" ? (
        <ComplianceScoreHeader
          score={compliance.score}
          subtitle={complianceSubtitle}
          statusLabel={compliance.statusLabel}
          reviewCount={compliance.reviewCount}
          generatedAt={results?.generatedAt}
          onExport={handleExportReport}
        />
      ) : (
        <ResultsProjectHeader
          projectName={projectName}
          metadata={metadata}
          generatedAt={results?.generatedAt}
          onExport={handleExportReport}
        />
      )}

      {canSendForReview &&
        (typeof User?.user?.plan === "string"
          ? User.user.plan === "Enterprise"
          : User?.user?.plan?.name === "Enterprise") ? (
        <div className="flex justify-end ">
          <Button className="md:max-w-[300px]" onClick={() => setIsSendForReviewOpen(true)}>
            Send for Review
          </Button>
        </div>
      ) : null}

      <MetricCardGrid>
        {isAnalysisLoading && !analysisResult
          ? Array.from({ length: 4 }).map((_, index) => (
            <MetricCardSkeleton
              key={`metric-skeleton-${index}`}
              hasDescription={true}
            />
          ))
          : metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              label={metric.label}
              value={metric.value}
              description={metric.description}
            />
          ))}
      </MetricCardGrid>

      <Card className="overflow-hidden">
        <div className="px-6 pt-2">
          <UnderlineTabs
            tabs={[...RESULTS_TABS]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <CardContent className="pt-6">
          {activeTab === "design-recommendations" ? (
            <TabPanel
              id="tabpanel-design-recommendations"
              labelledBy="tab-design-recommendations"
            >
              <DesignRecommendationsPanel
                design_image={drawingImage}
                recommendations={recommendations}
              />
            </TabPanel>
          ) : null}

          {activeTab === "bom" ? (
            <TabPanel id="tabpanel-bom" labelledBy="tab-bom">
              {canUseBom ? (
                <BomMaterialTakeoffPanel projectId={projectId} />
              ) : (
                <UpgradeAccountFallback featureName="BOM Generation" />
              )}
            </TabPanel>
          ) : null}

          {activeTab === "compliance" ? (
            <TabPanel id="tabpanel-compliance" labelledBy="tab-compliance">
              {canUseCompliance ? (
                <ComplianceChecklistPanel projectId={projectId as string} />
              ) : (
                <UpgradeAccountFallback featureName="Compliance Engine" />
              )}
            </TabPanel>
          ) : null}

          {activeTab === "narrative" ? (
            <TabPanel id="tabpanel-narrative" labelledBy="tab-narrative">
              <DesignNarrativePanel
                projectInfo={projectInfo}
                projectId={projectId as string}
              />
            </TabPanel>
          ) : null}

          {activeTab === "exports" ? (
            <TabPanel id="tabpanel-exports" labelledBy="tab-exports">
              <ExportsPanel
                projectInfo={projectInfo}
                projectId={projectId}
                results={results}
              />
            </TabPanel>
          ) : null}
        </CardContent>
      </Card>

      <Modal
        isOpen={isSendForReviewOpen}
        onClose={() => {
          if (!sendForReviewMutation.isPending) {
            setIsSendForReviewOpen(false);
            setSelectedEngineerId("");
          }
        }}
        title="Send for Engineer Review"
        description="This will move the project into the engineer review queue. You won't be able to make changes while it's under review."
        confirmText="Send for Review"
        cancelText="Cancel"
        isConfirming={sendForReviewMutation.isPending}
        onConfirm={handleConfirmSendForReview}
      >
        <div className="space-y-4">
          <p className="text-sm text-stat-label">
            <span className="font-medium text-foreground">{projectName}</span>{" "}
            will be sent to the assigned engineer for review. Make sure the
            design recommendations and BOM look correct before continuing.
          </p>

          {isEngineersLoading ? (
            <div className="h-10 animate-pulse rounded-md bg-slate-100" />
          ) : hasEngineers ? (
            <div className="space-y-1.5">

              <SelectField
                label="Assign Engineer"
                name="engineerId"
                value={selectedEngineerId}
                onChange={setSelectedEngineerId}
                options={engineers.map((engineer) => ({
                  value: engineer.id,
                  label: `${engineer.name} (${engineer.email})`,
                }))}
              />

            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border bg-surface px-4 py-3 text-sm text-stat-label">
              No engineers are available on your team yet. Invite an
              engineer from{" "}
              <Link href="/company/team" className="text-primary hover:underline">
                Team Settings
              </Link>{" "}
              before sending this project for review.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}