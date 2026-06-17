import Image from "next/image";

import { cn } from "@/lib/utils/cn";

interface FloorPlanPreviewProps {
  className?: string;
}

export function FloorPlanPreview({ className }: FloorPlanPreviewProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <h3 className="font-heading text-base font-semibold text-accent-cyan">
          Floor Plan Preview
        </h3>
        <p className="mt-1 font-body text-xs text-stat-label">
          Drawing visualization with device markers
        </p>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-border bg-[#0a2463]">
        <Image
          src="/images/floor-plan-preview.png"
          alt="Floor plan blueprint preview"
          width={540}
          height={480}
          className="h-auto w-full"
          sizes="(max-width: 1280px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
