import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils/cn";

interface EstimatorHeroBannerProps {
  className?: string;
}

export function EstimatorHeroBanner({ className }: EstimatorHeroBannerProps) {
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
            Rapid BOMs and code guidance for every bid
          </h2>
          <p className="text-hero-subtitle max-w-xl">
            Upload drawings, generate NFPA 72 compliant estimates, and export
            bid-ready PDF and CSV reports in minutes.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={routes.estimator.newDesign}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "h-[43px] w-full max-w-none gap-2.5 rounded-[10px] px-7 py-[13px] sm:w-auto",
            )}
          >
            <Plus className="size-4" />
            Create New Design
          </Link>
          <Link
            href={routes.estimator.projects}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-[43px] w-full max-w-none gap-2 rounded-[10px] border-white/20 bg-transparent px-7 py-[13px] text-white hover:bg-white/10 sm:w-auto",
            )}
          >
            My Projects
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
