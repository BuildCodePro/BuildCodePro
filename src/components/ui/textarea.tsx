import { forwardRef } from "react";

import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[120px] w-full resize-y rounded-[10px] border-[1.5px] border-input-border bg-white px-4 py-3 font-body text-[15px] text-foreground placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-primary focus-visible:ring-primary/30",
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 font-body text-xs text-primary">{error}</p>
      ) : null}
    </div>
  ),
);

Textarea.displayName = "Textarea";

export { Textarea };
