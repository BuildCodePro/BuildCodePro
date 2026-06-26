import { forwardRef } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, wrapperClassName, ...props }, ref) => (
    <div className={cn("relative w-full max-w-md", wrapperClassName)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        ref={ref}
        type="search"
        className={cn(
          "h-10 w-full rounded-full border border-border bg-white py-2 pr-4 pl-10 font-body text-sm text-foreground placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
          className,
        )}
        {...props}
      />
    </div>
  ),
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
