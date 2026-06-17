"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { MetricCard, MetricCardGrid } from "@/components/ui/metric-card";
import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import {
  MOCK_DESIGN_RESULTS,
  RESULTS_TABS,
  getProjectDisplayName,
} from "@/lib/constants/results";
import { BOM_TOTAL_ITEMS } from "@/lib/constants/bom";
import { MOCK_COMPLIANCE_RESULTS } from "@/lib/constants/compliance";
import {
  formatComplianceSubtitle,
  formatProjectMetadata,
} from "@/lib/utils/format-project-metadata";
import type { DesignResults, ProjectInfoFormData, ResultsTabId } from "@/types/new-design";

import { BomMaterialTakeoffPanel } from "./bom-material-takeoff-panel";
import { ComplianceChecklistPanel } from "./compliance-checklist-panel";
import { ComplianceScoreHeader } from "./compliance-score-header";
import { DesignRecommendationsPanel } from "./design-recommendations-panel";
import { DesignNarrativePanel } from "./design-narrative-panel";
import { ExportsPanel } from "./exports-panel";
import { ResultsProjectHeader } from "./results-project-header";

interface ResultsStepProps {
  projectInfo: ProjectInfoFormData;
  results?: DesignResults;
  onExport?: () => void;
}

export function ResultsStep({
  projectInfo,
  results = MOCK_DESIGN_RESULTS,
  onExport,
}: ResultsStepProps) {
  const [activeTab, setActiveTab] =
    useState<ResultsTabId>("design-recommendations");

  const projectName = getProjectDisplayName(projectInfo);
  const metadata = formatProjectMetadata(projectInfo);
  const complianceSubtitle = formatComplianceSubtitle(projectInfo, projectName);
  const compliance = results.compliance ?? MOCK_COMPLIANCE_RESULTS;

  return (
    <div className="space-y-6">
      {activeTab === "compliance" ? (
        <ComplianceScoreHeader
          score={compliance.score}
          subtitle={complianceSubtitle}
          statusLabel={compliance.statusLabel}
          reviewCount={compliance.reviewCount}
          generatedAt={results.generatedAt}
          onExport={onExport}
        />
      ) : (
        <ResultsProjectHeader
          projectName={projectName}
          metadata={metadata}
          generatedAt={results.generatedAt}
          onExport={onExport}
        />
      )}

      <MetricCardGrid>
        {results.metrics.map((metric) => (
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
                recommendations={results.recommendations}
              />
            </TabPanel>
          ) : null}

          {activeTab === "bom" ? (
            <TabPanel id="tabpanel-bom" labelledBy="tab-bom">
              <BomMaterialTakeoffPanel
                totalItems={results.bomTotalItems ?? BOM_TOTAL_ITEMS}
              />
            </TabPanel>
          ) : null}

          {activeTab === "compliance" ? (
            <TabPanel id="tabpanel-compliance" labelledBy="tab-compliance">
              <ComplianceChecklistPanel compliance={compliance} />
            </TabPanel>
          ) : null}

          {activeTab === "narrative" ? (
            <TabPanel id="tabpanel-narrative" labelledBy="tab-narrative">
              <DesignNarrativePanel
                projectInfo={projectInfo}
                narrative={results.narrative}
                generatedAt={results.generatedAt}
              />
            </TabPanel>
          ) : null}

          {activeTab === "exports" ? (
            <TabPanel id="tabpanel-exports" labelledBy="tab-exports">
              <ExportsPanel projectInfo={projectInfo} results={results} />
            </TabPanel>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
