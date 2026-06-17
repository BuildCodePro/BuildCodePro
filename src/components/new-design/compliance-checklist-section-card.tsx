import { Card, CardContent } from "@/components/ui/card";
import type { ComplianceChecklistSection } from "@/types/new-design";

import { ComplianceChecklistRow } from "./compliance-checklist-row";

interface ComplianceChecklistSectionCardProps {
  section: ComplianceChecklistSection;
}

export function ComplianceChecklistSectionCard({
  section,
}: ComplianceChecklistSectionCardProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-section-title font-body">{section.title}</h3>

      <Card>
        <CardContent className="divide-y divide-border px-6 py-0">
          {section.items.map((item) => (
            <ComplianceChecklistRow key={item.id} item={item} />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
