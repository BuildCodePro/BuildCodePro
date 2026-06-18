import { CircleHelp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import type { FaqItem } from "@/lib/constants/support";

interface FaqCardProps {
  faq: FaqItem;
  className?: string;
}

export function FaqCard({ faq, className }: FaqCardProps) {
  return (
    <Card className={cn("p-5 sm:p-6", className)}>
      <div className="flex gap-3">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-cyan/10 text-accent-cyan">
          <CircleHelp className="size-4" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-narrative-section-title">{faq.question}</h3>
          <p className="text-narrative-body">{faq.answer}</p>
        </div>
      </div>
    </Card>
  );
}
