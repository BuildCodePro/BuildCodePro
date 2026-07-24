"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  valueClassName?: string;
  trackClassName?: string;
  progressClassName?: string;
  "aria-label"?: string;
}

export function CircularProgress({
  value,
  size = 176,
  strokeWidth = 10,
  className,
  valueClassName,
  trackClassName = "text-slate-100",
  progressClassName = "text-accent-cyan",
  "aria-label": ariaLabel = "Progress",
}: CircularProgressProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let animationFrameId: number;
    const startValue = displayValue;
    const endValue = value;
    
    if (startValue === endValue) return;

    const duration = 800; // Smooth 800ms tween
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(startValue + (endValue - startValue) * easeProgress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, displayValue));
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(clampedValue)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-[stroke-dashoffset] duration-300 ease-out",
            progressClassName,
          )}
        />
      </svg>
      <span
        className={cn(
          "absolute font-heading text-[32px] font-bold leading-none text-foreground",
          valueClassName,
        )}
      >
        {Math.round(clampedValue)}%
      </span>
    </div>
  );
}
