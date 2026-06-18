"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils/cn";

function AnimatedScore({ target }: { target: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return <span>{value}%</span>;
}

export function HeroProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div
        className="landing-glow absolute -inset-4 rounded-[28px] opacity-60 motion-reduce:opacity-40"
        aria-hidden="true"
      />

      <div className="landing-float relative overflow-hidden rounded-[20px] border border-white/10 bg-white shadow-2xl shadow-black/30">
        <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
          <span className="size-2.5 rounded-full bg-primary" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 font-body text-xs text-stat-label">
            Riverside Medical — AI Results
          </span>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-[1.1fr_0.9fr] sm:items-start sm:p-5">
          <div className="relative self-start overflow-hidden rounded-[12px] border border-border">
            <Image
              src="/images/floor-plan-preview.png"
              alt="AI-analyzed floor plan preview"
              width={480}
              height={480}
              className="block h-auto w-full"
            />
            <div className="landing-scan-line pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-ai-cyan/25 to-transparent motion-reduce:hidden" />
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="rounded-[12px] border border-border bg-surface p-4">
              <p className="font-body text-xs font-medium text-stat-label">
                Compliance Score
              </p>
              <p className="mt-1 font-heading text-3xl font-bold text-foreground">
                <AnimatedScore target={92} />
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="landing-progress-fill h-full rounded-full bg-ai-gradient" />
              </div>
            </div>

            <div className="space-y-2">
              {[
                "84 devices suggested",
                "BOM generated",
                "NFPA 72 validated",
              ].map((item, index) => (
                <div
                  key={item}
                  className={cn(
                    "flex items-center gap-2 rounded-[10px] border border-border bg-white px-3 py-2 font-body text-xs text-foreground",
                    "animate-landing-fade-in-up motion-reduce:animate-none",
                  )}
                  style={{ animationDelay: `${400 + index * 120}ms` }}
                >
                  <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute -left-2 top-8 flex items-center gap-2 rounded-full border border-white/15 bg-[#060912]/90 px-3 py-2 shadow-lg backdrop-blur-md sm:-left-6",
          "animate-landing-float motion-reduce:animate-none",
        )}
        style={{ animationDelay: "0ms" }}
      >
        <Sparkles className="size-3.5 text-ai-cyan" aria-hidden="true" />
        <span className="font-body text-xs font-medium text-white">
          AI Analysis Complete
        </span>
      </div>

      <div
        className={cn(
          "absolute -right-1 bottom-10 rounded-full border border-primary/30 bg-primary/10 px-3 py-2 shadow-lg backdrop-blur-md sm:-right-4",
          "animate-landing-float motion-reduce:animate-none",
        )}
        style={{ animationDelay: "1.5s" }}
      >
        <span className="font-body text-xs font-semibold text-primary">
          Export Ready
        </span>
      </div>
    </div>
  );
}
