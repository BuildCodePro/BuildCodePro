import { cn } from "@/lib/utils/cn";
import type {
  DesignRecommendation,
  RecommendationAccent,
  RecommendationBadgeVariant,
} from "@/types/new-design";

const accentStyles: Record<RecommendationAccent, string> = {
  red: "border-l-primary",
  yellow: "border-l-amber-400",
  green: "border-l-success",
  orange: "border-l-warning",
};

const badgeStyles: Record<RecommendationBadgeVariant, string> = {
  success: "bg-emerald-50 text-success",
  warning: "bg-amber-50 text-warning",
};

interface RecommendationCardProps {
  recommendation: DesignRecommendation;
  className?: string;
}

export function RecommendationCard({
  recommendation,
  className,
}: RecommendationCardProps) {
  const badgeVariant = recommendation.badgeVariant ?? "success";

  return (
    <article
      className={cn(
        "rounded-[12px] border border-border bg-white px-4 py-4 shadow-sm",
        "border-l-4",
        accentStyles[recommendation.accent],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h4 className="text-section-title font-body">
            {recommendation.title}
          </h4>
          <p className="font-body text-sm font-semibold text-foreground">
            {recommendation.count}
          </p>
        </div>

        {recommendation.badge ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 font-body text-xs font-semibold",
              badgeStyles[badgeVariant],
            )}
          >
            {recommendation.badge}
          </span>
        ) : null}
      </div>

      <p className="mt-3 font-body text-xs leading-relaxed text-stat-label">
        {recommendation.description}
      </p>

      {recommendation.items && recommendation.items.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          {recommendation.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

interface RecommendationCardListProps {
  recommendations: DesignRecommendation[];
  className?: string;
}

export function RecommendationCardList({
  recommendations,
  className,
}: RecommendationCardListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {recommendations.map((recommendation) => (
        <RecommendationCard
          key={recommendation.id}
          recommendation={recommendation}
        />
      ))}
    </div>
  );
}
