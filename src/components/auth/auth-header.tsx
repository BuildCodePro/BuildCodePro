import { cn } from "@/lib/utils/cn";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function AuthHeader({ title, subtitle, className }: AuthHeaderProps) {
  return (
    <div className={cn("mb-10 w-full text-center", className)}>
      <h1 className="text-welcome text-foreground">{title}</h1>
      <p className="text-auth-subtitle mt-3 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
