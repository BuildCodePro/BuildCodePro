"use client";

import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils/cn";

interface OtpInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  length?: number;
  disabled?: boolean;
}

export function OtpInput({
  label,
  value,
  onChange,
  error,
  length = 6,
  disabled = false,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, length));
  };

  const handleChange = (index: number, rawValue: string) => {
    const sanitized = rawValue.replace(/[^0-9]/g, "");

    if (!sanitized) {
      setDigit(index, "");
      return;
    }

    // Handle typing a single digit, or a paste landing in one box
    const chars = sanitized.split("");
    let next = digits.slice();
    let cursor = index;

    for (const char of chars) {
      if (cursor >= length) break;
      next[cursor] = char;
      cursor += 1;
    }

    onChange(next.join("").slice(0, length));

    const nextIndex = Math.min(cursor, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        setDigit(index, "");
        return;
      }
      if (index > 0) {
        event.preventDefault();
        setDigit(index - 1, "");
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!pasted) return;

    onChange(pasted.slice(0, length));

    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {label ? (
        <label className="font-body text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}

      <div className="flex w-full items-center justify-between gap-1">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => {
              setFocusedIndex(index);
              e.target.select();
            }}
            onBlur={() => setFocusedIndex(null)}
            className={cn(
              "h-14 w-full max-w-[70px] rounded-lg border bg-background text-center font-body text-xl font-semibold text-foreground outline-none transition-colors",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              error
                ? "border-red-500"
                : focusedIndex === index
                  ? "border-primary"
                  : "border-input",
              disabled && "cursor-not-allowed opacity-50"
            )}
          />
        ))}
      </div>

      {error ? (
        <p className="font-body text-sm text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}