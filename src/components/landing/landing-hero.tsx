import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils/cn";

import { HeroProductPreview } from "./hero-product-preview";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-ai-mesh pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-28 lg:pt-32">
      <div className="landing-hero-grid absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="absolute -left-32 top-20 size-72 rounded-full bg-ai-violet/25 blur-3xl motion-reduce:hidden"
        aria-hidden="true"
      />
      <div
        className="absolute -right-24 bottom-0 size-80 rounded-full bg-ai-cyan/20 blur-3xl motion-reduce:hidden"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/3 size-96 -translate-x-1/2 rounded-full bg-ai-indigo/10 blur-3xl motion-reduce:hidden"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div className="space-y-8">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-ai-indigo/30 bg-ai-indigo/10 px-4 py-2",
              "animate-landing-fade-in-up motion-reduce:animate-none",
            )}
          >
            <span className="size-2 animate-pulse rounded-full bg-ai-cyan motion-reduce:animate-none" />
            <span className="font-body text-xs font-medium text-slate-300 sm:text-sm">
              AI-powered fire alarm estimation for contractors
            </span>
          </div>

          <div className="space-y-5">
            <h1
              className={cn(
                "max-w-xl font-heading text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[56px]",
                "animate-landing-fade-in-up motion-reduce:animate-none",
              )}
              style={{ animationDelay: "100ms" }}
            >
              From drawings to bid-ready estimates in{" "}
              <span className="text-ai-gradient">minutes</span>
            </h1>
            <p
              className={cn(
                "max-w-lg font-body text-base leading-relaxed text-slate-400 sm:text-lg",
                "animate-landing-fade-in-up motion-reduce:animate-none",
              )}
              style={{ animationDelay: "200ms" }}
            >
              Upload construction drawings and receive NFPA 72 design
              recommendations, material takeoffs, compliance checklists, and
              exportable reports — built for the pre-bid estimation stage.
            </p>
          </div>

          <div
            className={cn(
              "flex flex-col gap-3 sm:flex-row sm:items-center",
              "animate-landing-fade-in-up motion-reduce:animate-none",
            )}
            style={{ animationDelay: "300ms" }}
          >
            <Link
              href={routes.signup}
              className={cn(
                buttonVariants({ variant: "ai" }),
                "h-12 max-w-none gap-2 rounded-[10px] px-8 text-[15px] sm:w-auto",
              )}
            >
              Start Free Trial
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#how-it-works"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 max-w-none gap-2 rounded-[10px] border-white/20 bg-transparent px-8 text-white hover:bg-white/10 sm:w-auto",
              )}
            >
              <Play className="size-4" />
              See How It Works
            </a>
          </div>

          <p
            className={cn(
              "font-body text-xs text-slate-500 sm:text-sm",
              "animate-landing-fade-in-up motion-reduce:animate-none",
            )}
            style={{ animationDelay: "400ms" }}
          >
            No credit card required &bull; Plans from $99/mo &bull; PE review
            workflow included
          </p>
        </div>

        <div
          className={cn(
            "animate-landing-fade-in-up motion-reduce:animate-none lg:justify-self-end",
          )}
          style={{ animationDelay: "250ms" }}
        >
          <HeroProductPreview />
        </div>
      </div>
    </section>
  );
}
