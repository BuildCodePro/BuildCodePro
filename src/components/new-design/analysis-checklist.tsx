import { Check, Circle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { DesignChecklistItem } from "@/types/new-design";

interface ChecklistItemProps {
  item: DesignChecklistItem;
}

function ChecklistItem({ item }: ChecklistItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[10px] border px-4 py-3",
        item.completed
          ? "border-emerald-100 bg-emerald-50"
          : "border-border bg-slate-50",
      )}
    >
      {item.completed ? (
        <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
      ) : (
        <Circle className="size-4 shrink-0 text-slate-300" aria-hidden="true" />
      )}
      <span
        className={cn(
          "font-body text-sm",
          item.completed ? "font-medium text-success" : "text-stat-label",
        )}
      >
        {item.label}
      </span>
    </div>
  );
}

interface AnalysisChecklistProps {
  title?: string;
  description?: string;
  items: DesignChecklistItem[];
  className?: string;
}

export function AnalysisChecklist({
  title = "Before AI Analysis",
  description = "Make sure all required items are ready.",
  items,
  className,
}: AnalysisChecklistProps) {
  return (
    <Card className={className}>
      <CardContent className="space-y-5">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <div className="space-y-2">
          {items.map((item) => (
            <ChecklistItem key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
