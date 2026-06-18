"use client";

import { Select, type SelectOption, type SelectProps } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";

interface FilterSelectProps extends Omit<SelectProps, "options"> {
  options: SelectOption[];
  wrapperClassName?: string;
}

export function FilterSelect({
  options,
  className,
  wrapperClassName,
  size = "sm",
  ...props
}: FilterSelectProps) {
  return (
    <Select
      {...props}
      options={options}
      size={size}
      className={cn("min-w-[140px]", wrapperClassName, className)}
    />
  );
}
