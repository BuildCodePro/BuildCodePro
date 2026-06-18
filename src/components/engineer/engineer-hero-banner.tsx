import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils/cn";

interface EngineerHeroBannerProps {
  className?: string;
}

export function EngineerHeroBanner({ className }: EngineerHeroBannerProps) {
  return (
    <section
      className={cn(
        "rounded-[16px] bg-sidebar px-6 py-6 sm:px-8 sm:py-8",
        className,
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-hero-title text-white">
            Review AI designs and approve for permit submission
          </h2>
          <p className="text-hero-subtitle max-w-xl">
            Validate NFPA 72 compliance, sign off on material takeoffs, and
            prepare permit-ready packages for AHJ submission.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={routes.engineer.projects}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "h-[43px] w-full max-w-none gap-2.5 rounded-[10px] px-7 py-[13px] sm:w-auto",
            )}
          >
            <ClipboardCheck className="size-4" />
            Review Projects
          </Link>
          <Link
            href={`${routes.engineer.projects}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-[43px] w-full max-w-none gap-2 rounded-[10px] border-white/20 bg-transparent px-7 py-[13px] text-white hover:bg-white/10 sm:w-auto",
            )}
          >
            View Queue
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
