import { cn } from "@/lib/utils/cn";
import type { ExportFormatId } from "@/types/new-design";

interface ExportFormatCardProps {
  id: ExportFormatId;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (id: ExportFormatId) => void;
  className?: string;
}

export function ExportFormatCard({
  id,
  title,
  description,
  icon,
  isSelected,
  onSelect,
  className,
}: ExportFormatCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={() => onSelect(id)}
      className={cn(
        "flex w-full items-start gap-3 rounded-[10px] border px-4 py-3 text-left transition-colors",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-white hover:bg-slate-50",
        className,
      )}
    >
      <span className="mt-0.5 shrink-0 text-xl leading-none" aria-hidden="true">
        {icon}
      </span>
      <span className="min-w-0 space-y-0.5">
        <span className="block font-body text-sm font-semibold text-foreground">
          {title}
        </span>
        <span className="block font-body text-xs text-stat-label">
          {description}
        </span>
      </span>
    </button>
  );
}
