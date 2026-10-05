import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type {
  ComplianceMatrixApiItem,
  ComplianceRowStatus,
} from "@/types/analysis-results";

const STATUS_LABELS: Record<ComplianceRowStatus, string> = {
  pass: "Pass",
  review_needed: "Review",
  concern: "Concern",
  unresolved: "Unresolved",
};

const STATUS_CLASSES: Record<ComplianceRowStatus, string> = {
  pass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  review_needed: "border-amber-200 bg-amber-50 text-amber-700",
  concern: "border-red-200 bg-red-50 text-red-700",
  unresolved: "border-slate-300 bg-slate-100 text-slate-600",
};

interface ComplianceMatrixTableProps {
  items: ComplianceMatrixApiItem[];
}

function formatConfidence(confidence: number | null): string {
  if (confidence === null) {
    return "—";
  }
  return `${Math.round(confidence * 100)}%`;
}

export function ComplianceMatrixTable({ items }: ComplianceMatrixTableProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-section-title font-body">Compliance Matrix</h3>
          <p className="font-body text-sm text-stat-label">
            Every requirement checked, the code section it came from, and what
            still needs a person.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="py-2 pr-4 font-body font-medium">Requirement</th>
                <th className="py-2 pr-4 font-body font-medium">Result</th>
                <th className="py-2 pr-4 font-body font-medium">Source</th>
                <th className="py-2 pr-4 font-body font-medium">Confidence</th>
                <th className="py-2 font-body font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 align-top last:border-b-0"
                >
                  <td className="py-3 pr-4">{item.requirement}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={cn(
                        "inline-block rounded border px-2 py-0.5 text-xs font-medium",
                        STATUS_CLASSES[item.status],
                      )}
                    >
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-stat-label">
                    {item.code_reference ?? "—"}
                    {item.amendment_reference ? (
                      <span className="block text-xs">
                        {item.amendment_reference}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 tabular-nums">
                    {formatConfidence(item.confidence)}
                  </td>
                  <td className="py-3 text-stat-label">
                    {item.required_action ?? "None"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
