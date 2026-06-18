"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  size?: "default" | "sm";
  "aria-label"?: string;
}

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

const VIEWPORT_PADDING = 12;
const DROPDOWN_GAP = 6;
const MAX_DROPDOWN_HEIGHT = 240;

function getDropdownPosition(
  triggerRect: DOMRect,
  optionCount: number,
): DropdownPosition {
  const estimatedHeight = Math.min(
    optionCount * 44 + 8,
    MAX_DROPDOWN_HEIGHT,
  );

  const spaceBelow =
    window.innerHeight - triggerRect.bottom - VIEWPORT_PADDING;
  const spaceAbove = triggerRect.top - VIEWPORT_PADDING;
  const openUpward = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

  const maxHeight = Math.max(
    120,
    Math.min(
      MAX_DROPDOWN_HEIGHT,
      openUpward ? spaceAbove - DROPDOWN_GAP : spaceBelow - DROPDOWN_GAP,
    ),
  );

  const top = openUpward
    ? triggerRect.top - DROPDOWN_GAP - maxHeight
    : triggerRect.bottom + DROPDOWN_GAP;

  const left = Math.min(
    triggerRect.left,
    window.innerWidth - triggerRect.width - VIEWPORT_PADDING,
  );

  return {
    top: Math.max(VIEWPORT_PADDING, top),
    left: Math.max(VIEWPORT_PADDING, left),
    width: triggerRect.width,
    maxHeight,
  };
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      id,
      name,
      value,
      onChange,
      options,
      placeholder = "Select an option...",
      error,
      disabled = false,
      className,
      size = "default",
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const generatedId = useId();
    const triggerId = id ?? name ?? generatedId;
    const listboxId = `${triggerId}-listbox`;
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] =
      useState<DropdownPosition | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const selectedOption = options.find((option) => option.value === value);
    const displayLabel = selectedOption?.label ?? placeholder;
    const hasValue = Boolean(value);

    const updateDropdownPosition = useCallback(() => {
      if (!triggerRef.current) {
        return;
      }

      setDropdownPosition(
        getDropdownPosition(
          triggerRef.current.getBoundingClientRect(),
          options.length,
        ),
      );
    }, [options.length]);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useEffect(() => {
      setIsMounted(true);
    }, []);

    useEffect(() => {
      if (!isOpen) {
        setHighlightedIndex(-1);
        setDropdownPosition(null);
        return;
      }

      updateDropdownPosition();

      const handleScrollOrResize = () => {
        updateDropdownPosition();
      };

      window.addEventListener("resize", handleScrollOrResize);
      window.addEventListener("scroll", handleScrollOrResize, true);

      return () => {
        window.removeEventListener("resize", handleScrollOrResize);
        window.removeEventListener("scroll", handleScrollOrResize, true);
      };
    }, [isOpen, updateDropdownPosition]);

    useEffect(() => {
      if (!isOpen) {
        return;
      }

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;

        if (
          triggerRef.current?.contains(target) ||
          listboxRef.current?.contains(target)
        ) {
          return;
        }

        setIsOpen(false);
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) {
        return;
      }

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex].value);
          } else {
            setIsOpen((open) => !open);
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex((index) =>
              index < options.length - 1 ? index + 1 : 0,
            );
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setHighlightedIndex(options.length - 1);
          } else {
            setHighlightedIndex((index) =>
              index > 0 ? index - 1 : options.length - 1,
            );
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
        default:
          break;
      }
    };

    const dropdown =
      isOpen && dropdownPosition && isMounted
        ? createPortal(
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              style={{
                position: "fixed",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: dropdownPosition.maxHeight,
                zIndex: 1000,
              }}
              className="overflow-auto overscroll-contain rounded-[10px] border border-border bg-white py-1 shadow-xl"
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 font-body text-[15px] leading-normal text-foreground",
                      isHighlighted && "bg-slate-50",
                      isSelected && "bg-accent-cyan/10 text-foreground",
                    )}
                  >
                    <span className="min-w-0 truncate">{option.label}</span>
                    {isSelected ? (
                      <Check className="size-4 shrink-0 text-accent-cyan" />
                    ) : null}
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null;

    return (
      <div className={cn("relative w-full min-w-0", className)}>
        {name ? (
          <input type="hidden" name={name} value={value} readOnly />
        ) : null}

        <button
          ref={setRefs}
          id={triggerId}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          disabled={disabled}
          onClick={() => setIsOpen((open) => !open)}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex w-full min-w-0 items-center justify-between gap-3 rounded-[10px] border bg-white px-4 text-left font-body leading-normal transition-colors",
            size === "sm" ? "h-10 text-sm" : "h-11 text-[15px]",
            "focus-visible:border-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/20",
            error
              ? "border-primary focus-visible:ring-primary/30"
              : isOpen
                ? "border-accent-cyan"
                : "border-input-border",
            disabled && "cursor-not-allowed opacity-50",
            !hasValue && "text-slate-400",
          )}
        >
          <span className="min-w-0 flex-1 truncate">{displayLabel}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 transition-transform",
              isOpen ? "rotate-180 text-accent-cyan" : "text-slate-400",
            )}
            aria-hidden="true"
          />
        </button>

        {dropdown}

        {error ? (
          <p className="mt-1.5 font-body text-xs text-primary">{error}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";

interface SelectFieldProps extends SelectProps {
  label: string;
}

export function SelectField({
  label,
  id,
  name,
  ...selectProps
}: SelectFieldProps) {
  const fieldId = id ?? name;

  return (
    <div className="w-full min-w-0 space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <Select id={fieldId} name={name} {...selectProps} />
    </div>
  );
}
