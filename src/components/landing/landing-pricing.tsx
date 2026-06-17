import Link from "next/link";
import { Check } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { BILLING_PLANS } from "@/lib/constants/billing";
import { LANDING_POPULAR_PLAN_ID } from "@/lib/constants/landing";
import { cn } from "@/lib/utils/cn";

import { ScrollReveal } from "./scroll-reveal";

function formatDesigns(value: (typeof BILLING_PLANS)[number]["designsPerMonth"]) {
  if (value === "unlimited") {
    return "Unlimited designs / month";
  }
  return `${value} designs / month`;
}

export function LandingPricing() {
  return (
    <section id="pricing" className="bg-surface-ai py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-body text-sm font-semibold uppercase tracking-wider text-ai-indigo">
              Subscription Plans
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Scale with your bidding volume
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-stat-label">
              Monthly design limits that match how fire alarm contractors work —
              upgrade anytime as your pipeline grows.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {BILLING_PLANS.map((plan, index) => {
            const isPopular = plan.id === LANDING_POPULAR_PLAN_ID;

            return (
              <ScrollReveal key={plan.id} delay={index * 100}>
                <article
                  className={cn(
                    "relative flex h-full flex-col rounded-[16px] border bg-white p-6 sm:p-7",
                    isPopular
                      ? "border-ai-indigo/40 shadow-ai-glow lg:scale-[1.02]"
                      : "border-border",
                  )}
                >
                  {isPopular ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ai-gradient px-3 py-1 font-body text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  ) : null}

                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <div className="mt-3">
                    <p className="font-heading text-4xl font-bold text-foreground">
                      ${plan.price}
                      <span className="font-body text-base font-normal text-stat-label">
                        {" "}/mo
                      </span>
                    </p>
                    <p className="mt-1 font-body text-sm text-stat-label">
                      {formatDesigns(plan.designsPerMonth)}
                    </p>
                  </div>

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 font-body text-sm text-foreground"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-success"
                          aria-hidden="true"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={routes.signup}
                    className={cn(
                      buttonVariants({
                        variant: isPopular ? "ai" : "outline",
                      }),
                      "mt-8 h-11 max-w-none rounded-[10px] text-sm",
                    )}
                  >
                    Get Started
                  </Link>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
