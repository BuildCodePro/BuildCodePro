// "use client";

// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// import { AlertBanner } from "@/components/ui/alert-banner";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Modal } from "@/components/ui/modal";
// import { MetricCard, MetricCardGrid } from "@/components/ui/metric-card";
// import { MetricCardSkeleton } from "@/components/ui/metric-card-skeleton";
// import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
// import {
//   RESULTS_TABS,
//   getProjectDisplayName,
// } from "@/lib/constants/results";
// import {
//   formatComplianceSubtitle,
//   formatProjectMetadata,
// } from "@/lib/utils/format-project-metadata";
// import type { DesignRecommendation, DesignResults, ProjectInfoFormData, RecommendationAccent, RecommendationBadgeVariant, ResultsTabId } from "@/types/new-design";
// import { useAnalysisResultQuery, useAnalysisJobResultQuery } from "@/services/analysisService";
// import { useCreateExportMutation } from "@/services/exportService";
// import { useGetProjectQuery, useSendForReviewMutation, useEngineersQuery } from "@/services/projectService";
// import { useModulePermission } from "@/hooks/use-permission";
// import { useState, useEffect } from "react";

// import { BomMaterialTakeoffPanel } from "./bom-material-takeoff-panel";
// import { ComplianceChecklistPanel } from "./compliance-checklist-panel";
// import { ComplianceScoreHeader } from "./compliance-score-header";
// import { DesignRecommendationsPanel } from "./design-recommendations-panel";
// import { DesignNarrativePanel } from "./design-narrative-panel";
// import { ExportsPanel } from "./exports-panel";
// import { ResultsProjectHeader } from "./results-project-header";
// import { UpgradeAccountFallback } from "./upgrade-account-fallback";
// import { ProjectJobsList } from "@/components/projects/project-jobs-list";
// import { useAnalysisJobsQuery } from "@/services/analysisService";
// import Link from "next/link";
// import { formatDate } from "@/lib/utils/format-date";
// import { Select, SelectField } from "../ui";
// import { useAuthStore } from "@/store/auth-store"

// interface ResultsStepProps {
//   projectInfo: ProjectInfoFormData;
//   projectId?: string;
//   /** When provided, fetches and displays this specific job's result instead of the latest. */
//   jobId?: string;
//   results?: DesignResults;
//   onExport?: () => void;
//   newDesignBasePath?: string;
// }

// export function ResultsStep({
//   projectInfo,
//   projectId,
//   jobId,
//   results,
//   onExport,
//   newDesignBasePath = "/company/new-design",
// }: ResultsStepProps) {
//   const router = useRouter();
//   const [activeTab, setActiveTab] =
//     useState<ResultsTabId>("design-recommendations");
//   const [isSendForReviewOpen, setIsSendForReviewOpen] = useState(false);
//   const [selectedEngineerId, setSelectedEngineerId] = useState<string>("");
//   const [selectedJobId, setSelectedJobId] = useState<string | undefined>(jobId);

//   // Sync selectedJobId if prop changes
//   useEffect(() => {
//     setSelectedJobId(jobId);
//   }, [jobId]);

//   const createExportMutation = useCreateExportMutation(projectId);
//   const sendForReviewMutation = useSendForReviewMutation(projectId || "");
//   const { user } = useAuthStore();
//   const { hasModule } = useModulePermission();

//   const { data: projectData, isLoading: isProjectLoading, isError: isProjectError } = useGetProjectQuery(projectId || "");
//   const { data: engineersData, isLoading: isEngineersLoading } = useEngineersQuery();
//   const engineers = engineersData?.items || [];
//   const hasEngineers = engineers.length > 0;
//   const isDraftWorkflow = projectData?.workflow_status === "draft";

//   const latestResultQuery = useAnalysisResultQuery(selectedJobId ? null : projectId);
//   const jobResultQuery = useAnalysisJobResultQuery(selectedJobId ? projectId : null, selectedJobId);

//   const {
//     data: analysisResult,
//     isLoading: isAnalysisLoading,
//     isError: isAnalysisError,
//     error: analysisError,
//   } = selectedJobId ? jobResultQuery : latestResultQuery;

//   // bom_current is only meaningful on per-job fetches; assume true for the
//   // latest-result endpoint (it always reflects the current BOM).
//   const bomCurrent = selectedJobId ? (analysisResult?.bom_current ?? true) : true;

//   const projectName = getProjectDisplayName(projectInfo);
//   const metadata = formatProjectMetadata(projectInfo);
//   const complianceSubtitle = formatComplianceSubtitle(projectInfo, projectName);
//   const drawingImage = analysisResult?.drawings[0]?.file_url;

//   const canUseBom = hasModule("bom_generation");
//   const canUseCompliance = hasModule("compliance_engine");
//   const canSendForReview =
//     !isDraftWorkflow &&
//     projectData?.engineer_review_status !== "in_review" &&
//     projectData?.engineer_review_status !== "completed";

//   const handleExportReport = async () => {
//     if (onExport) {
//       onExport();
//       return;
//     }

//     if (!projectId) {
//       toast.error("Project is missing. Please open a valid project first.");
//       return;
//     }

//     try {
//       const response = await createExportMutation.mutateAsync({
//         format: "csv",
//         sections: {
//           design_recommendations: true,
//           bom: true,
//           compliance_checklist: true,
//           design_narrative: true,
//           nfpa_disclaimer: true,
//           company_branding: true,
//         },
//       });

//       toast.success("CSV export created successfully.");

//       if (response.download_url) {
//         window.open(response.download_url, "_blank", "noopener,noreferrer");
//       }
//     } catch (error: any) {
//       const message =
//         error instanceof Error ? error.message : error.data.message;
//       toast.error(message);
//     }
//   };

//   const handleResumeProject = () => {
//     if (!projectId) {
//       toast.error("Project is missing. Please open a valid project first.");
//       return;
//     }
//     router.push(``);
//   };

//   const handleConfirmSendForReview = async () => {
//     if (!projectId) {
//       toast.error("Project is missing. Please open a valid project first.");
//       return;
//     }

//     if (!selectedEngineerId) {
//       toast.error("Please select an engineer to send this project for review.");
//       return;
//     }

//     try {
//       await sendForReviewMutation.mutateAsync({
//         engineer_user_id: selectedEngineerId,
//       });
//       toast.success("Project sent for engineer review.");
//       setIsSendForReviewOpen(false);
//       setSelectedEngineerId("");
//     } catch (error: any) {
//       const message =
//         error instanceof Error
//           ? error.message
//           : error?.data?.message || "Failed to send project for review.";
//       toast.error(message);
//     }
//   };

//   // --- Metrics: fully dynamic from the analysis result API when available ---
//   const metrics = analysisResult
//     ? [
//       {
//         id: "suggested-devices",
//         label: "Suggested Devices",
//         value: analysisResult.stats.suggested_devices.toLocaleString(
//           "en-US",
//         ),
//         description: analysisResult.stats.suggested_devices_label,
//       },
//       {
//         id: "estimated-wiring",
//         label: "Estimated Wiring",
//         value: `${analysisResult.stats.estimated_wiring_ft.toLocaleString(
//           "en-US",
//         )} ft`,
//         description: analysisResult.stats.estimated_wiring_label,
//       },
//       {
//         id: "compliance-pct",
//         label: "Compliance",
//         value: `${analysisResult.stats.compliance_status_pct}%`,
//         description: analysisResult.stats.compliance_label,
//       },
//       {
//         id: "review-flags",
//         label: "Review Flags",
//         value: analysisResult.stats.review_flags_count.toLocaleString(
//           "en-US",
//         ),
//         description: analysisResult.stats.review_flags_label,
//       },
//     ]
//     : results?.metrics || [];

//   const recommendations: DesignRecommendation[] = analysisResult
//     ? [
//       {
//         id: "initiating",
//         title: "Initiating Devices",
//         count: `${analysisResult.recommendations.initiating_devices.device_count ?? 0} devices`,
//         description:
//           analysisResult.recommendations.initiating_devices.description,
//         accent: "red" as RecommendationAccent,
//         badge:
//           analysisResult.recommendations.initiating_devices.score_pct != null
//             ? `${analysisResult.recommendations.initiating_devices.score_pct}%`
//             : "—",
//         badgeVariant:
//           ((analysisResult.recommendations.initiating_devices.score_pct ?? 0) >=
//             90
//             ? "success"
//             : "warning") as RecommendationBadgeVariant,
//         items: analysisResult.recommendations.initiating_devices.items,
//       },
//       {
//         id: "notification",
//         title: "Notification Appliances",
//         count: `${analysisResult.recommendations.notification_appliances.device_count ?? 0} devices`,
//         description:
//           analysisResult.recommendations.notification_appliances.description,
//         accent: "yellow" as RecommendationAccent,
//         badge:
//           analysisResult.recommendations.notification_appliances.score_pct !=
//             null
//             ? `${analysisResult.recommendations.notification_appliances.score_pct}%`
//             : "—",
//         badgeVariant:
//           ((analysisResult.recommendations.notification_appliances.score_pct ??
//             0) >= 90
//             ? "success"
//             : "warning") as RecommendationBadgeVariant,
//         items: analysisResult.recommendations.notification_appliances.items,
//       },
//       {
//         id: "control",
//         title: "Control Equipment",
//         count: `${analysisResult.recommendations.control_equipment.device_count ?? 0} panels`,
//         description:
//           analysisResult.recommendations.control_equipment.description,
//         accent: "green" as RecommendationAccent,
//         badge:
//           analysisResult.recommendations.control_equipment.score_pct != null
//             ? `${analysisResult.recommendations.control_equipment.score_pct}%`
//             : "—",
//         badgeVariant:
//           ((analysisResult.recommendations.control_equipment.score_pct ?? 0) >=
//             90
//             ? "success"
//             : "warning") as RecommendationBadgeVariant,
//         items: analysisResult.recommendations.control_equipment.items,
//       },
//       {
//         id: "review",
//         title: "Review Required",
//         count: `${analysisResult.recommendations.review_required.flag_count ?? 0} flags`,
//         description:
//           analysisResult.recommendations.review_required.description,
//         accent: "orange" as RecommendationAccent,
//         badge: "—",
//         badgeVariant: "warning" as RecommendationBadgeVariant,
//         items: analysisResult.recommendations.review_required.items,
//       },
//     ]
//     : results?.recommendations || [];

//   const compliance = analysisResult
//     ? {
//       score: analysisResult.stats.compliance_status_pct,
//       statusLabel: analysisResult.stats.compliance_label,
//       reviewCount: analysisResult.stats.review_flags_count,
//     }
//     : {
//       score: results?.compliance?.score || 0,
//       statusLabel: results?.compliance?.statusLabel || "Pending",
//       reviewCount: results?.compliance?.reviewCount || 0,
//     };

//   if (isProjectLoading) {
//     return (
//       <div className="space-y-6">
//         <MetricCardGrid>
//           {Array.from({ length: 4 }).map((_, index) => (
//             <MetricCardSkeleton
//               key={`project-status-skeleton-${index}`}
//               hasDescription={true}
//             />
//           ))}
//         </MetricCardGrid>
//       </div>
//     );
//   }

//   if (isDraftWorkflow) {
//     return (
//       <div className="space-y-6">

//         <ResultsProjectHeader
//           projectName={projectName}
//           metadata={metadata}
//           generatedAt={undefined}
//         />

//         <Card>
//           <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
//             <div className="flex size-14 items-center justify-center rounded-full bg-amber-100">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//                 className="size-6 text-amber-600"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                 />
//               </svg>
//             </div>

//             <div className="space-y-1">
//               <h3 className="font-body text-base font-semibold text-foreground">
//                 This project is still a draft
//               </h3>
//               <p className="mx-auto max-w-md font-body text-sm text-stat-label">
//                 Drawings haven&apos;t been uploaded and AI analysis hasn&apos;t
//                 run yet for this project. Resume the project to finish the
//                 remaining steps before viewing results.
//               </p>
//             </div>

//             <Link
//               href={`${newDesignBasePath}?projectId=${projectId}&step=${{
//                   project_info: "project-info",
//                   upload_drawing: "upload",
//                   ai_analysis: "ai-analysis",
//                 }[projectData?.current_step || "project_info"] || "project-info"
//                 }`}
//               className="flex h-11 max-w-[300px] items-center justify-center rounded-lg bg-primary px-6 text-white hover:bg-primary/80"
//             >
//               Resume Project
//             </Link>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }


//   const { data: jobsData } = useAnalysisJobsQuery(projectId || "");

//   return (
//     <div className="flex w-full flex-col gap-6">
//       {projectId && jobsData && jobsData.total > 0 && (
//         <ProjectJobsList
//           projectId={projectId}
//           selectedJobId={selectedJobId}
//           retryBasePath={newDesignBasePath}
//           onJobSelect={(id) => setSelectedJobId(id)}
//         />
//       )}

//       {/* Hero header */}
//       {isProjectError ? (
//         <AlertBanner
//           title="Couldn't confirm project status"
//           description="Showing the best available results. Some data may be out of date."
//         />
//       ) : null}

//       {isAnalysisError ? (
//         <AlertBanner
//           title="Your project is still under processing"
//           description="The AI analysis for your project is currently in progress. We’re reviewing the uploaded documents and generating comprehensive results. This may take a few minutes depending on the size of the drawings."
//         />
//       ) : null}

//       {!bomCurrent ? (
//         <AlertBanner
//           title="BOM reflects a newer analysis job"
//           description="Priced BOM reflects a newer analysis job — showing this job's device summary and recommendations only. Cost figures are not available for this historical run."
//         />
//       ) : null}

//       {activeTab === "compliance" ? (
//         <ComplianceScoreHeader
//           score={compliance.score}
//           subtitle={complianceSubtitle}
//           statusLabel={compliance.statusLabel}
//           reviewCount={compliance.reviewCount}
//           generatedAt={results?.generatedAt}
//           onExport={handleExportReport}
//         />
//       ) : (
//         <ResultsProjectHeader
//           projectName={projectName}
//           metadata={metadata}
//           generatedAt={results?.generatedAt}
//           onExport={handleExportReport}
//         />
//       )}

//       {canSendForReview &&
//         (typeof (user as any)?.plan === "string"
//           ? (user as any)?.plan === "Enterprise"
//           : (user as any)?.plan?.name === "Enterprise") ? (
//         <div className="flex justify-end ">
//           <Button size={"social"} className="md:max-w-[300px]" onClick={() => setIsSendForReviewOpen(true)}>
//             Send for Review
//           </Button>
//         </div>
//       ) : null}

//       <MetricCardGrid>
//         {isAnalysisLoading && !analysisResult
//           ? Array.from({ length: 4 }).map((_, index) => (
//             <MetricCardSkeleton
//               key={`metric-skeleton-${index}`}
//               hasDescription={true}
//             />
//           ))
//           : metrics.map((metric) => (
//             <MetricCard
//               key={metric.id}
//               label={metric.label}
//               value={metric.value}
//               description={metric.description}
//             />
//           ))}
//       </MetricCardGrid>

//       <Card className="overflow-hidden">
//         <div className="px-6 pt-2">
//           <UnderlineTabs
//             tabs={[...RESULTS_TABS]}
//             activeTab={activeTab}
//             onTabChange={setActiveTab}
//           />
//         </div>

//         <CardContent className="pt-6">
//           {activeTab === "design-recommendations" ? (
//             <TabPanel
//               id="tabpanel-design-recommendations"
//               labelledBy="tab-design-recommendations"
//             >
//               <DesignRecommendationsPanel
//                 design_image={drawingImage}
//                 recommendations={recommendations}
//               />
//             </TabPanel>
//           ) : null}

//           {activeTab === "bom" ? (
//             <TabPanel id="tabpanel-bom" labelledBy="tab-bom">
//               {bomCurrent ? (
//                 <BomMaterialTakeoffPanel projectId={projectId} />
//               ) : (
//                 <div className="py-8 text-center">
//                   <p className="font-body text-sm text-stat-label">
//                     Priced BOM is not available for this historical job. Open the
//                     latest job to view current BOM figures.
//                   </p>
//                 </div>
//               )}
//             </TabPanel>
//           ) : null}

//           {activeTab === "compliance" ? (
//             <TabPanel id="tabpanel-compliance" labelledBy="tab-compliance">
//               {canUseCompliance ? (
//                 <ComplianceChecklistPanel projectId={projectId as string} />
//               ) : (
//                 <UpgradeAccountFallback featureName="Compliance Engine" />
//               )}
//             </TabPanel>
//           ) : null}

//           {activeTab === "narrative" ? (
//             <TabPanel id="tabpanel-narrative" labelledBy="tab-narrative">
//               <DesignNarrativePanel
//                 projectInfo={projectInfo}
//                 projectId={projectId as string}
//               />
//             </TabPanel>
//           ) : null}

//           {activeTab === "exports" ? (
//             <TabPanel id="tabpanel-exports" labelledBy="tab-exports">
//               <ExportsPanel
//                 projectInfo={projectInfo}
//                 projectId={projectId}
//                 results={results}
//               />
//             </TabPanel>
//           ) : null}
//         </CardContent>
//       </Card>

//       <Modal
//         isOpen={isSendForReviewOpen}
//         onClose={() => {
//           if (!sendForReviewMutation.isPending) {
//             setIsSendForReviewOpen(false);
//             setSelectedEngineerId("");
//           }
//         }}
//         title="Send for Engineer Review"
//         description="This will move the project into the engineer review queue. You won't be able to make changes while it's under review."
//         confirmText="Send for Review"
//         cancelText="Cancel"
//         isConfirming={sendForReviewMutation.isPending}
//         onConfirm={handleConfirmSendForReview}
//       >
//         <div className="space-y-4">
//           <p className="text-sm text-stat-label">
//             <span className="font-medium text-foreground">{projectName}</span>{" "}
//             will be sent to the assigned engineer for review. Make sure the
//             design recommendations and BOM look correct before continuing.
//           </p>

//           {isEngineersLoading ? (
//             <div className="h-10 animate-pulse rounded-md bg-slate-100" />
//           ) : hasEngineers ? (
//             <div className="space-y-1.5">

//               <SelectField
//                 label="Assign Engineer"
//                 name="engineerId"
//                 value={selectedEngineerId}
//                 onChange={setSelectedEngineerId}
//                 options={engineers.map((engineer) => ({
//                   value: engineer.id,
//                   label: `${engineer.name} (${engineer.email})`,
//                 }))}
//               />

//             </div>
//           ) : (
//             <div className="rounded-md border border-dashed border-border bg-surface px-4 py-3 text-sm text-stat-label">
//               No engineers are available on your team yet. Invite an
//               engineer from{" "}
//               <Link href="/company/team" className="text-primary hover:underline">
//                 Team Settings
//               </Link>{" "}
//               before sending this project for review.
//             </div>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// }



"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";

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
import type { DesignRecommendation, DesignResults, ProjectInfoFormData, RecommendationAccent, RecommendationBadgeVariant, ResultsTabId } from "@/types/new-design";
import { useAnalysisResultQuery, useAnalysisJobResultQuery } from "@/services/analysisService";
import { useCreateExportMutation } from "@/services/exportService";
import { useGetProjectQuery, useSendForReviewMutation, useEngineersQuery } from "@/services/projectService";
import { useModulePermission } from "@/hooks/use-permission";
import { useState, useEffect } from "react";

import { BomMaterialTakeoffPanel } from "./bom-material-takeoff-panel";
import { ComplianceChecklistPanel } from "./compliance-checklist-panel";
import { DesignRecommendationsPanel } from "./design-recommendations-panel";
import { DesignNarrativePanel } from "./design-narrative-panel";
import { ExportsPanel } from "./exports-panel";
import { ResultsProjectHeader } from "./results-project-header";
import { UpgradeAccountFallback } from "./upgrade-account-fallback";
import { ProjectJobsList } from "@/components/projects/project-jobs-list";
import { useAnalysisJobsQuery } from "@/services/analysisService";
import Link from "next/link";
import { formatDate } from "@/lib/utils/format-date";
import { Select, SelectField } from "../ui";
import { useAuthStore } from "@/store/auth-store"

interface ResultsStepProps {
  projectInfo: ProjectInfoFormData;
  projectId?: string;
  /** When provided, fetches and displays this specific job's result instead of the latest. */
  jobId?: string;
  results?: DesignResults;
  onExport?: () => void;
  newDesignBasePath?: string;
}

/** Circular compliance-score ring used inside the hero card. Presentational only. */
function CircularScoreRing({ score }: { score: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score || 0));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex size-28 shrink-0 items-center justify-center">
      <svg viewBox="0 0 100 100" className="size-28 -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#f92516ff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-heading text-2xl font-bold text-white">{clamped}%</span>
        <span className="font-body text-[10px] uppercase tracking-wide text-slate-400">
          NFPA 72
        </span>
      </div>
    </div>
  );
}

/** Side panel listing device recommendation groups. Presentational only, reuses existing recommendations data. */
function SuggestedDevicesPanel({
  totalLabel,
  recommendations,
}: {
  totalLabel?: string;
  recommendations: DesignRecommendation[];
}) {
  const deviceGroups = recommendations.filter((group) => group.id !== "review");

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5">
      <span className="inline-block w-fit mb-2 rounded bg-primary/10 px-2 py-0.5 font-body text-sm font-semibold text-primary">
        Suggested Devices
      </span>
      {totalLabel ? (
        <p className="mt-1 font-body text-xs text-stat-label">{totalLabel}</p>
      ) : null}

      <div className="mt-3 divide-y divide-border">
        {deviceGroups.map((group) => (
          <div key={group.id} className="flex items-center justify-between py-2.5">
            <span className="font-body text-sm text-foreground">{group.title}</span>
            <span className="font-body text-sm font-semibold text-foreground">
              {group.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResultsStep({
  projectInfo,
  projectId,
  jobId,
  results,
  onExport,
  newDesignBasePath = "/company/new-design",
}: ResultsStepProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<ResultsTabId>("design-recommendations");
  const [isSendForReviewOpen, setIsSendForReviewOpen] = useState(false);
  const [selectedEngineerId, setSelectedEngineerId] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(jobId);
  const [isJobHistoryOpen, setIsJobHistoryOpen] = useState(false);

  // Sync selectedJobId if prop changes
  useEffect(() => {
    setSelectedJobId(jobId);
  }, [jobId]);

  const createExportMutation = useCreateExportMutation(projectId);
  const sendForReviewMutation = useSendForReviewMutation(projectId || "");
  const { user } = useAuthStore();
  const { hasModule } = useModulePermission();

  const { data: projectData, isLoading: isProjectLoading, isError: isProjectError } = useGetProjectQuery(projectId || "");
  const { data: engineersData, isLoading: isEngineersLoading } = useEngineersQuery();
  const engineers = engineersData?.items || [];
  const hasEngineers = engineers.length > 0;
  const isDraftWorkflow = projectData?.workflow_status === "draft";

  const { data: jobsData } = useAnalysisJobsQuery(projectId || "");

  const latestResultQuery = useAnalysisResultQuery(selectedJobId ? null : projectId);
  const jobResultQuery = useAnalysisJobResultQuery(selectedJobId ? projectId : null, selectedJobId);

  const {
    data: analysisResult,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
    error: analysisError,
  } = selectedJobId ? jobResultQuery : latestResultQuery;

  // bom_current is only meaningful on per-job fetches; assume true for the
  // latest-result endpoint (it always reflects the current BOM).
  const bomCurrent = selectedJobId ? (analysisResult?.bom_current ?? true) : true;

  const projectName = getProjectDisplayName(projectInfo);
  const metadata = formatProjectMetadata(projectInfo);
  const complianceSubtitle = formatComplianceSubtitle(projectInfo, projectName);
  const drawingImage = analysisResult?.drawings[0]?.file_url;

  const canUseBom = hasModule("bom_generation");
  const canUseCompliance = hasModule("compliance_engine");
  const canSendForReview =
    !isDraftWorkflow &&
    projectData?.engineer_review_status !== "in_review" &&
    projectData?.engineer_review_status !== "completed";

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

  const suggestedDevicesMetric = metrics.find((m) => m.id === "suggested-devices");

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
              href={`${newDesignBasePath}?projectId=${projectId}&step=${{
                project_info: "project-info",
                upload_drawing: "upload",
                ai_analysis: "ai-analysis",
              }[projectData?.current_step || "project_info"] || "project-info"
                }`}
              className="flex h-11 max-w-[300px] items-center justify-center rounded-lg bg-primary px-6 text-white hover:bg-primary/80"
            >
              Resume Project
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }


  const activeJob = selectedJobId
    ? jobsData?.items.find((j) => j.id === selectedJobId)
    : jobsData?.items[0];

  const jobStatusValue = activeJob
    ? activeJob.status.charAt(0).toUpperCase() + activeJob.status.slice(1)
    : analysisResult
      ? "Completed"
      : "Pending";

  const jobStatusDescription =
    activeJob?.pages_total != null && activeJob.pages_total > 0
      ? `${activeJob.pages_processed ?? 0} / ${activeJob.pages_total} pages processed`
      : "—";

  const displayMetrics = [
    ...metrics.filter((m) => m.id === "estimated-wiring" || m.id === "review-flags"),
    {
      id: "job-status",
      label: "Job Status",
      value: jobStatusValue,
      description: jobStatusDescription,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Hero header */}
      {isProjectError ? (
        <AlertBanner
          title="Couldn't confirm project status"
          description="Showing the best available results. Some data may be out of date."
        />
      ) : null}

      {isAnalysisError ? (
        <AlertBanner
          title="Your project is still under processing"
          description="The AI analysis for your project is currently in progress. We’re reviewing the uploaded documents and generating comprehensive results. This may take a few minutes depending on the size of the drawings."
        />
      ) : null}

      {!bomCurrent ? (
        <AlertBanner
          title="BOM reflects a newer analysis job"
          description="Priced BOM reflects a newer analysis job — showing this job's device summary and recommendations only. Cost figures are not available for this historical run."
        />
      ) : null}

      {/* <ResultsProjectHeader
        projectName={projectName}
        metadata={metadata}
        generatedAt={results?.generatedAt}
        onExport={handleExportReport}
      /> */}

      {canSendForReview &&
        (typeof (user as any)?.plan === "string"
          ? (user as any)?.plan === "Enterprise"
          : (user as any)?.plan?.name === "Enterprise") ? (
        <div className="flex justify-end ">
          <Button size={"social"} className="md:max-w-[300px]" onClick={() => setIsSendForReviewOpen(true)}>
            Send for Review
          </Button>
        </div>
      ) : null}

      {/* Compliance hero card + Suggested Devices panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:flex-row lg:col-span-2">
          <CircularScoreRing score={compliance.score} />

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <p className="font-body text-xs font-semibold uppercase tracking-wide text-primary">
              {isAnalysisLoading ? "Analysis in progress" : "Analysis Completed"}
              {results?.generatedAt ? ` · ${formatDate(results.generatedAt)}` : ""}
            </p>
            <h3 className="font-heading text-2xl font-bold text-white">
              {compliance.statusLabel}
            </h3>
            <p className="font-body text-sm text-slate-300">
              {compliance.reviewCount} flags raised across the drawing set — resolve
              before export to reach full pass rate.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2 sm:justify-start">
              <Button
                variant="primary"

                onClick={() => handleExportReport()}
              >
                Export Report
              </Button>
            </div>
          </div>
        </div>

        <SuggestedDevicesPanel
          totalLabel={suggestedDevicesMetric?.description}
          recommendations={recommendations}
        />
      </div>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {isAnalysisLoading && !analysisResult
          ? Array.from({ length: 3 }).map((_, index) => (
            <MetricCardSkeleton
              key={`metric-skeleton-${index}`}
              hasDescription={true}
            />
          ))
          : displayMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              label={metric.label}
              value={metric.value}
              description={metric.description}
            />
          ))}
      </div>

      {/* Compact analysis history bar — expands into the full jobs table */}
      {projectId && jobsData && jobsData.total > 0 && (
        <div className="rounded-lg border border-border bg-surface">
          <button
            type="button"
            onClick={() => setIsJobHistoryOpen((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="font-body text-sm text-stat-label">
              Analysis history — <strong className="text-foreground">{jobsData.total} {jobsData.total === 1 ? "job" : "jobs"}</strong>
            </span>
            <span className="inline-flex items-center gap-1 font-body text-sm font-medium text-primary">
              View all runs
              <ChevronRight
                className={`size-4 transition-transform ${isJobHistoryOpen ? "rotate-90" : ""}`}
                aria-hidden="true"
              />
            </span>
          </button>

          {isJobHistoryOpen ? (
            <div className="border-t border-border">
              <ProjectJobsList
                projectId={projectId}
                selectedJobId={selectedJobId}
                retryBasePath={newDesignBasePath}
                onJobSelect={(id) => setSelectedJobId(id)}
                className="rounded-none border-none shadow-none"
              />
            </div>
          ) : null}
        </div>
      )}


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
                drawings={analysisResult?.drawings}
                design_image={drawingImage}
                recommendations={recommendations}
              />
            </TabPanel>
          ) : null}

          {activeTab === "bom" ? (
            <TabPanel id="tabpanel-bom" labelledBy="tab-bom">
              {bomCurrent ? (
                <BomMaterialTakeoffPanel projectId={projectId} />
              ) : (
                <div className="py-8 text-center">
                  <p className="font-body text-sm text-stat-label">
                    Priced BOM is not available for this historical job. Open the
                    latest job to view current BOM figures.
                  </p>
                </div>
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