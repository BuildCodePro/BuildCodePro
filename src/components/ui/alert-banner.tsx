import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface AlertBannerProps {
  title: string;
  description: string;
  className?: string;
}

export function AlertBanner({ title, description, className }: AlertBannerProps) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-[12px] border border-amber-200 bg-amber-50 p-4 sm:p-5",
        className,
      )}
      role="note"
    >
      <AlertTriangle
        className="mt-0.5 size-5 shrink-0 text-warning"
        aria-hidden="true"
      />
      <div className="space-y-1">
        <h4 className="font-body text-sm font-semibold text-amber-800">
          {title}
        </h4>
        <p className="font-body text-sm leading-relaxed text-amber-700">
          {description}
        </p>
      </div>
    </div>
  );
}
