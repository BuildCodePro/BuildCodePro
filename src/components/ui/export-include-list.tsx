import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

interface ExportIncludeItemProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function ExportIncludeItem({
  id,
  label,
  checked,
  onCheckedChange,
  className,
}: ExportIncludeItemProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <Label htmlFor={id} className="cursor-pointer font-body text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}

interface ExportIncludeListProps {
  items: Array<{ id: string; label: string; checked: boolean }>;
  onItemChange: (id: string, checked: boolean) => void;
  className?: string;
}

export function ExportIncludeList({
  items,
  onItemChange,
  className,
}: ExportIncludeListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <ExportIncludeItem
          key={item.id}
          id={`export-include-${item.id}`}
          label={item.label}
          checked={item.checked}
          onCheckedChange={(checked) => onItemChange(item.id, checked)}
        />
      ))}
    </div>
  );
}
