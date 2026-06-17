import { cn } from "@/lib/utils/cn";

interface AuthDividerProps {
  className?: string;
}

export function AuthDivider({ className }: AuthDividerProps) {
  return (
    <div className={cn("my-8 flex w-full items-center gap-4", className)}>
      <span className="h-px flex-1 bg-border" />
      <span className="font-body text-sm text-slate-400">
        — or continue with —
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
