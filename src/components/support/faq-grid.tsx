import type { FaqItem } from "@/lib/constants/support";
import { SUPPORT_FAQS } from "@/lib/constants/support";
import { cn } from "@/lib/utils/cn";

import { FaqCard } from "./faq-card";

interface FaqGridProps {
  faqs?: FaqItem[];
  className?: string;
}

export function FaqGrid({ faqs = SUPPORT_FAQS, className }: FaqGridProps) {
  if (faqs.length === 0) {
    return (
      <p className="rounded-[16px] border border-border bg-white px-6 py-10 text-center font-body text-sm text-stat-label">
        No FAQs match your search. Try a different keyword.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2",
        className,
      )}
    >
      {faqs.map((faq) => (
        <FaqCard key={faq.id} faq={faq} />
      ))}
    </div>
  );
}
