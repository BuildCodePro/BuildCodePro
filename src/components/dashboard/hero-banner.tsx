import Link from "next/link";
import { Plus } from "lucide-react";

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
        "rounded-[16px] bg-sidebar px-6 py-6 sm:px-8 sm:py-8",
        className,
      )}
    >
      <div className=" flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-hero-title text-white">
            Generate fire alarm estimates in minutes.
          </h2>
          <p className="text-hero-subtitle max-w-xl">
            Upload construction drawings and get an AI-assisted BOM, compliance.
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

        </div>
      </div>
    </section>
  );
}
