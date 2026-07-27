import type { DesignRecommendation } from "@/types/new-design";

import { FloorPlanPreview } from "./floor-plan-preview";
import { RecommendationCardList } from "./recommendation-card";

interface DesignRecommendationsPanelProps {
  recommendations: DesignRecommendation[];
  design_image?: string;
}

export function DesignRecommendationsPanel({
  recommendations,
  design_image,
}: DesignRecommendationsPanelProps) {
  console.log("recommendations", recommendations);
  console.log("design_image", design_image);
  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
      <FloorPlanPreview design_image={design_image} />

      <div className="space-y-4">
        <div>
          <h3 className="text-section-title font-body">AI Recommendations</h3>
          <p className="mt-1 font-body text-xs text-stat-label">
            Based on NFPA 72 compliance analysis
          </p>
        </div>

        <RecommendationCardList recommendations={recommendations} />
      </div>
    </div>
  );
}
