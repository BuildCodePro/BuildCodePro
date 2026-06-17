import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils/cn";

interface HeroBannerProps {
  className?: string;
  newDesignHref?: string;
  projectsHref?: string;
}

export function HeroBanner({
  className,
  newDesignHref = routes.newDesign,
  projectsHref = routes.projects,
}: HeroBannerProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[16px] bg-ai-mesh px-6 py-6 sm:px-8 sm:py-8",
        className,
      )}
    >
      <div
        className="landing-hero-grid pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-hero-title text-white">
            Generate fire alarm estimates in minutes
          </h2>
          <p className="text-hero-subtitle max-w-xl">
            Upload construction drawings and get AI-assisted BOM, compliance
            report and design narrative.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={newDesignHref}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "h-[43px] w-full max-w-none gap-2.5 rounded-[10px] px-7 py-[13px] sm:w-auto",
            )}
          >
            <Plus className="size-4" />
            Create New Design
          </Link>
          <Link
            href={projectsHref}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-[43px] w-full max-w-none gap-2 rounded-[10px] border-white/20 bg-transparent px-7 py-[13px] text-white hover:bg-white/10 sm:w-auto",
            )}
          >
            View Projects
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
