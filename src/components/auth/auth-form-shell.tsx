import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface AuthFormShellProps {
  children: ReactNode;
  size?: "narrow" | "wide";
  className?: string;
}

export function AuthFormShell({
  children,
  size = "narrow",
  className,
}: AuthFormShellProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        size === "narrow" ? "max-w-[500px]" : "max-w-[552px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
