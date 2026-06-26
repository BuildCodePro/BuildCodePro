import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface AuthStatusMessageProps {
  title: string;
  subtitle: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function AuthStatusMessage({
  title,
  subtitle,
  className,
  children,
}: AuthStatusMessageProps) {
  return (
    <div className={cn("w-full text-center", className)}>
      <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-primary/10">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="text-primary"
        >
          <path
            d="M4 6.5C4 5.11929 5.11929 4 6.5 4H17.5C18.8807 4 20 5.11929 20 6.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V6.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M4 7.5L11.5534 12.2762C11.8343 12.4599 12.1657 12.4599 12.4466 12.2762L20 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="text-welcome text-foreground">{title}</h1>
      <p className="text-auth-subtitle mt-3 text-muted-foreground">{subtitle}</p>

      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
