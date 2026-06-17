import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { SUPPORT_CONTACT } from "@/lib/constants/support";
import { cn } from "@/lib/utils/cn";

interface ContactSupportBannerProps {
  onContact?: () => void;
  className?: string;
}

export function ContactSupportBanner({
  onContact,
  className,
}: ContactSupportBannerProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-[16px] border border-primary/20 bg-primary/5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6",
        className,
      )}
    >
      <div>
        <h2 className="font-heading text-base font-bold text-foreground">
          {SUPPORT_CONTACT.title}
        </h2>
        <p className="mt-1 font-body text-sm text-stat-label">
          {SUPPORT_CONTACT.description}
        </p>
      </div>

      <a
        href={`mailto:${SUPPORT_CONTACT.email}`}
        onClick={onContact}
        className={cn(
          buttonVariants({ variant: "primary" }),
          "h-11 w-full max-w-none gap-2 px-6 sm:w-auto",
        )}
      >
        {SUPPORT_CONTACT.ctaLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </section>
  );
}
