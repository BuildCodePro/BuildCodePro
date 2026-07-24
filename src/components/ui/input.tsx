import { forwardRef } from "react";

import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightSlot, children, dangerouslySetInnerHTML, ...props }, ref) => (
    <div className="w-full">
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-[47px] w-full rounded-[10px] border-[1.5px] border-input-border bg-white py-[15px] font-body text-[15px] text-foreground placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon ? "pl-11" : "pl-4",
            rightSlot ? "pr-11" : "pr-4",
            error && "border-primary focus-visible:ring-primary/30",
            className,
          )}
          {...props}
        />

        {rightSlot ? (
          <span className="absolute top-1/2 right-3 -translate-y-1/2">
            {rightSlot}
          </span>
        ) : null}
      </div>

      {error ? (
        <p className="mt-1.5 font-body text-xs text-primary">{error}</p>
      ) : null}
    </div>
  ),
);

Input.displayName = "Input";

export { Input };
