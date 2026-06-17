import { AlertBanner } from "@/components/ui/alert-banner";
import {
  COMPLIANCE_DISCLAIMER,
  MOCK_COMPLIANCE_RESULTS,
} from "@/lib/constants/compliance";
import type { ComplianceResults } from "@/types/new-design";

import { ComplianceChecklistSectionCard } from "./compliance-checklist-section-card";

interface ComplianceChecklistPanelProps {
  compliance?: ComplianceResults;
}

export function ComplianceChecklistPanel({
  compliance = MOCK_COMPLIANCE_RESULTS,
}: ComplianceChecklistPanelProps) {
  return (
    <div className="space-y-6">
      {compliance.sections.map((section) => (
        <ComplianceChecklistSectionCard key={section.id} section={section} />
      ))}

      <AlertBanner
        title={COMPLIANCE_DISCLAIMER.title}
        description={COMPLIANCE_DISCLAIMER.description}
      />
    </div>
  );
}
