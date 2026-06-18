import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  name: string;
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-body text-sm font-semibold text-white",
        className,
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
