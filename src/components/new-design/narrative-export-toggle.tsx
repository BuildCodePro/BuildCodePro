import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils/cn";

interface NarrativeExportToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function NarrativeExportToggle({
  checked,
  onCheckedChange,
  className,
}: NarrativeExportToggleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[10px] border border-[#22D3EE] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5",
        className,
      )}
    >
      <p className="font-body text-sm font-medium text-[#22D3EE]">
        Include this narrative in exported reports
      </p>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label="Include narrative in exported reports"
        className={checked ? "bg-[#22D3EE]" : undefined}
      />
    </div>
  );
}
