import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-heading font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-hover rounded-[10px]",
        ai: "bg-ai-gradient text-white hover:brightness-110 rounded-[10px] shadow-md shadow-ai-indigo/25 focus-visible:ring-ai-indigo/40",
        outline:
          "border-[1.5px] border-input-border bg-white text-foreground hover:bg-slate-50 rounded-[10px]",
        ghost: "text-primary hover:underline",
        link: "text-primary hover:underline font-body font-normal",
      },
      size: {
        default: "h-[49px] w-full max-w-[380px] px-[84px] py-[15px] text-[15px]",
        sm: "h-9 px-4 text-sm rounded-lg",
        social: "h-[49px] w-full max-w-[380px] px-4 py-[15px] text-[15px] font-body font-medium",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
