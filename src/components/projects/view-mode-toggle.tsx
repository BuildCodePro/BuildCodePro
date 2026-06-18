"use client";

import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type ProjectsViewMode = "grid" | "list";

interface ViewModeToggleProps {
  value: ProjectsViewMode;
  onChange: (mode: ProjectsViewMode) => void;
  className?: string;
}

export function ViewModeToggle({
  value,
  onChange,
  className,
}: ViewModeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-[10px] border border-border bg-white p-1",
        className,
      )}
      role="group"
      aria-label="Projects view mode"
    >
      <button
        type="button"
        aria-pressed={value === "grid"}
        onClick={() => onChange("grid")}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-[8px] px-3 font-body text-sm transition-colors",
          value === "grid"
            ? "bg-primary/5 font-medium text-primary"
            : "text-stat-label hover:text-foreground",
        )}
      >
        <LayoutGrid className="size-4" aria-hidden="true" />
        Grid
      </button>
      <button
        type="button"
        aria-pressed={value === "list"}
        onClick={() => onChange("list")}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-[8px] px-3 font-body text-sm transition-colors",
          value === "list"
            ? "bg-primary/5 font-medium text-primary"
            : "text-stat-label hover:text-foreground",
        )}
      >
        <List className="size-4" aria-hidden="true" />
        List
      </button>
    </div>
  );
}
