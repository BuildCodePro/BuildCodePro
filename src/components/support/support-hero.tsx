"use client";

import { SearchInput } from "@/components/ui/search-input";
import { cn } from "@/lib/utils/cn";

interface SupportHeroProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  className?: string;
}

export function SupportHero({
  searchValue,
  onSearchChange,
  className,
}: SupportHeroProps) {
  return (
    <section
      className={cn(
        "rounded-[16px] bg-sidebar px-6 py-8 text-white sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">
          How can we help you?
        </h2>
        <p className="font-body text-sm text-slate-400 sm:text-base">
          Search help articles or browse FAQs below
        </p>

        <SearchInput
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search help articles..."
          aria-label="Search help articles"
          wrapperClassName="mx-auto max-w-none"
          className="h-12 rounded-[10px] pl-11 text-[15px]"
        />
      </div>
    </section>
  );
}
