import type { HelpArticle } from "@/lib/constants/support";
import { cn } from "@/lib/utils/cn";

import { HelpArticleCard } from "./help-article-card";

interface HelpArticlesSectionProps {
  articles: HelpArticle[];
  className?: string;
}

export function HelpArticlesSection({
  articles,
  className,
}: HelpArticlesSectionProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="space-y-1">
        <h2 className="text-section-title font-body">Help Articles</h2>
        <p className="font-body text-sm text-stat-label">
          Step-by-step guides for common workflows
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {articles.map((article) => (
          <HelpArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
