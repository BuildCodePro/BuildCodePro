import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface RegenerateButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RegenerateButton({
  className,
  children = "Regenerate",
  ...props
}: RegenerateButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 w-[140px] shrink-0 items-center justify-center gap-1.5 rounded-[8px] bg-[#22D3EE] px-3 font-body text-sm font-bold leading-none text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]/40 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <Sparkles className="size-3.5" aria-hidden="true" />
      {children}
    </button>
  );
}
