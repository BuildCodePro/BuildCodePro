import { cn } from "@/lib/utils/cn";

interface EngineerModuleHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function EngineerModuleHeader({
  title,
  description,
  className,
}: EngineerModuleHeaderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h2 className="text-section-title font-body">{title}</h2>
      <p className="font-body text-sm text-stat-label">{description}</p>
    </div>
  );
}
