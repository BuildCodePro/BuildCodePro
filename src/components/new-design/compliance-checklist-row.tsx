import { ComplianceStatusBadge } from "@/components/ui/compliance-status-badge";
import type { ComplianceChecklistItem } from "@/types/new-design";

interface ComplianceChecklistRowProps {
  item: ComplianceChecklistItem;
}

export function ComplianceChecklistRow({ item }: ComplianceChecklistRowProps) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-body text-sm leading-relaxed text-foreground">
        {item.label}
      </p>
      <ComplianceStatusBadge status={item.status} />
    </div>
  );
}
