import { cn } from "@/lib/utils/cn";

import { FloorPlanViewer } from "./floor-plan-viewer";

interface FloorPlanPreviewProps {
  className?: string;
  design_image?: string;
}

export function FloorPlanPreview({ className, design_image }: FloorPlanPreviewProps) {
  console.log("design_image 2", design_image);

  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <h3 className="font-heading text-base font-semibold text-accent-cyan">
          Floor Plan Preview
        </h3>
        <p className="mt-1 font-body text-xs text-stat-label">
          Drawing visualization with device markers — zoom in to inspect rooms,
          dimensions, and layout details
        </p>
      </div>

      <FloorPlanViewer design_image={design_image || ""} />
    </div>
  );
}
