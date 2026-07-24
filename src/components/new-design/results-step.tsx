"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AlertBanner } from "@/components/ui/alert-banner";
import { Card, CardContent } from "@/components/ui/card";
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
import type { DesignRecommendation, DesignResults, ProjectInfoFormData, RecommendationAccent, RecommendationBadgeVariant, ResultsTabId } from "@/types/new-design";
import { useAnalysisResultQuery } from "@/services/analysisService";
import { useCreateExportMutation } from "@/services/exportService";

import { BomMaterialTakeoffPanel } from "./bom-material-takeoff-panel";
import { ComplianceChecklistPanel } from "./compliance-checklist-panel";
import { ComplianceScoreHeader } from "./compliance-score-header";
import { DesignRecommendationsPanel } from "./design-recommendations-panel";
import { DesignNarrativePanel } from "./design-narrative-panel";
import { ExportsPanel } from "./exports-panel";
import { ResultsProjectHeader } from "./results-project-header";
import { useAuthStore } from "@/store/auth-store";

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
  const [activeTab, setActiveTab] =
    useState<ResultsTabId>("design-recommendations");
  const createExportMutation = useCreateExportMutation(projectId);
  const { user } = useAuthStore();

  const {
    data: analysisResult,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
    error: analysisError,
  } = useAnalysisResultQuery(projectId);

  const projectName = getProjectDisplayName(projectInfo);
  const metadata = formatProjectMetadata(projectInfo);
  const complianceSubtitle = formatComplianceSubtitle(projectInfo, projectName);

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

  return (
    <div className="space-y-6">
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
                recommendations={recommendations}
              />
            </TabPanel>
          ) : null}
          {user?.bom_generation && activeTab === "bom" && (
            <TabPanel id="tabpanel-bom" labelledBy="tab-bom">
              <BomMaterialTakeoffPanel projectId={projectId} />
            </TabPanel>
          )}

          {user?.compliance_engine && activeTab === "compliance" && (
            <TabPanel id="tabpanel-compliance" labelledBy="tab-compliance">
              <ComplianceChecklistPanel projectId={projectId as string} />
            </TabPanel>
          )}

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
    </div>
  );
}