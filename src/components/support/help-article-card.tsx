"use client";

import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { HelpArticle } from "@/lib/constants/support";
import { cn } from "@/lib/utils/cn";

interface HelpArticleCardProps {
  article: HelpArticle;
  className?: string;
}

export function HelpArticleCard({ article, className }: HelpArticleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
        aria-controls={`article-${article.id}`}
        className="flex w-full gap-3 p-5 text-left sm:p-6"
      >
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="size-4" aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1 space-y-2">
          <span className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-body text-xs font-medium text-slate-600">
              {article.categoryLabel}
            </span>
            <span className="font-body text-xs text-stat-label">
              {article.readTime}
            </span>
          </span>

          <span className="block text-narrative-section-title">
            {article.title}
          </span>
          <span className="block text-narrative-body">{article.excerpt}</span>
        </span>

        <ChevronDown
          className={cn(
            "mt-1 size-5 shrink-0 text-stat-label transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {isExpanded ? (
        <div
          id={`article-${article.id}`}
          className="space-y-3 border-t border-border px-5 pb-5 pt-4 sm:px-6 sm:pb-6"
        >
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-narrative-body">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
