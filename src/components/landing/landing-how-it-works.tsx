import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import {
  LANDING_STEPS,
  LANDING_WORKFLOW_OUTCOMES,
} from "@/lib/constants/landing";
import { cn } from "@/lib/utils/cn";

import { ScrollReveal } from "./scroll-reveal";

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-body text-sm font-semibold uppercase tracking-wider text-ai-indigo">
              End-to-End Flow
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Four steps from upload to export
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-stat-label">
              The same workflow your team uses inside the app — streamlined for
              rapid fire alarm estimation and bidding.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <div className="mt-10 hidden lg:block">
            <ol
              className="relative grid grid-cols-4 gap-4"
              aria-label="Workflow steps"
            >
              <div
                className="absolute left-[12.5%] right-[12.5%] top-5 h-0.5 bg-gradient-to-r from-ai-indigo/40 via-ai-cyan/60 to-ai-violet/40"
                aria-hidden="true"
              />
              {LANDING_STEPS.map((step) => (
                <li key={step.id} className="relative flex flex-col items-center">
                  <span className="relative z-10 flex size-10 items-center justify-center rounded-full bg-ai-gradient font-heading text-sm font-bold text-white shadow-md shadow-ai-indigo/30 ring-4 ring-white">
                    {step.step}
                  </span>
                  <span className="mt-3 text-center font-body text-xs font-semibold text-foreground">
                    {step.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:gap-6">
          {LANDING_STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <ScrollReveal key={step.id} delay={index * 90}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[16px] border border-border bg-surface p-6 transition-all duration-300 hover:border-ai-indigo/25 hover:shadow-ai-glow sm:p-7">
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-ai-indigo/5 transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="inline-flex size-12 items-center justify-center rounded-[12px] bg-ai-icon text-ai-indigo transition-all duration-300 group-hover:bg-ai-gradient group-hover:text-white">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-ai-gradient px-3 py-1 font-body text-xs font-semibold text-white">
                      Step {step.step}
                    </span>
                  </div>

                  <h3 className="relative mt-5 font-heading text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="relative mt-2 font-body text-sm leading-relaxed text-stat-label">
                    {step.description}
                  </p>

                  <ul className="relative mt-5 flex flex-1 flex-col gap-2.5 border-t border-border pt-5">
                    {step.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-start gap-2.5 font-body text-sm text-foreground"
                      >
                        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-success">
                          <Check className="size-3" aria-hidden="true" />
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={120}>
          <div className="mt-10 grid gap-4 rounded-[16px] border border-ai-indigo/20 bg-ai-mesh p-6 sm:grid-cols-3 sm:p-8 lg:mt-12">
            {LANDING_WORKFLOW_OUTCOMES.map((outcome) => (
              <div
                key={outcome.label}
                className="text-center sm:border-r sm:border-white/10 sm:last:border-r-0"
              >
                <p className="font-heading text-2xl font-bold text-ai-gradient sm:text-3xl">
                  {outcome.value}
                </p>
                <p className="mt-1.5 font-body text-sm text-slate-400">
                  {outcome.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={160}>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[16px] border border-ai-indigo/15 bg-surface-ai px-6 py-5 sm:flex-row sm:px-8">
            <div className="text-center sm:text-left">
              <p className="font-heading text-base font-bold text-foreground">
                Ready to run your first estimate?
              </p>
              <p className="mt-1 font-body text-sm text-stat-label">
                Start the wizard — upload drawings and get AI results in minutes.
              </p>
            </div>
            <Link
              href={routes.signup}
              className={cn(
                buttonVariants({ variant: "ai", size: "sm" }),
                "h-11 max-w-none shrink-0 gap-2 px-6",
              )}
            >
              Start Free Trial
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
