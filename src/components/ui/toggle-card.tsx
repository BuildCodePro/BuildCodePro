import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";

interface ToggleCardProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function ToggleCard({
  label,
  description,
  checked,
  onCheckedChange,
  className,
}: ToggleCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors",
        checked
          ? "border-accent-cyan bg-accent-cyan/5"
          : "border-border bg-white",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="font-body text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 font-body text-xs leading-snug text-stat-label">
          {description}
        </p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={`Toggle ${label}`}
      />
    </div>
  );
}
