import type { DesignRecommendation } from "@/types/new-design";
import type { Drawing } from "@/services/analysisService";
import { FloorPlanPreview } from "./floor-plan-preview";
import { RecommendationCardList } from "./recommendation-card";

interface DesignRecommendationsPanelProps {
  recommendations: DesignRecommendation[];
  design_image?: string;
  drawings?: Drawing[];
}

export function DesignRecommendationsPanel({
  recommendations,
  design_image,
  drawings,
}: DesignRecommendationsPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
      <div className="min-h-[500px]">
        <FloorPlanPreview design_image={design_image} drawings={drawings} />
      </div>
      <div className="space-y-3 overflow-y-auto max-h-[80vh]">
        <div>
          <h3 className="text-section-title font-body">Design recommendations</h3>
          <p className="mt-1 font-body text-xs text-stat-label">
            The uploaded drawing is shown for reference only.
            Recommendations below are generated from the analysis and remain
            draft until a qualified reviewer confirms them.
          </p>
        </div>
        <RecommendationCardList recommendations={recommendations} />
      </div>
    </div>
  );
}
