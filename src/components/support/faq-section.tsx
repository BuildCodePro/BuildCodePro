import type { FaqItem } from "@/lib/constants/support";
import { cn } from "@/lib/utils/cn";

import { FaqGrid } from "./faq-grid";

interface FaqSectionProps {
  faqs: FaqItem[];
  className?: string;
}

export function FaqSection({ faqs, className }: FaqSectionProps) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="space-y-1">
        <h2 className="text-section-title font-body">
          Frequently Asked Questions
        </h2>
        <p className="font-body text-sm text-stat-label">
          Quick answers to common questions
        </p>
      </div>

      <FaqGrid faqs={faqs} />
    </section>
  );
}
