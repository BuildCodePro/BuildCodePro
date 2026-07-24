import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils/cn";

import { ScrollReveal } from "./scroll-reveal";

export function LandingCta() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[20px] bg-ai-mesh px-6 py-12 text-center sm:px-10 sm:py-14 lg:px-16">
            <div
              className="landing-hero-grid absolute inset-0 opacity-40"
              aria-hidden="true"
            />
            <div
              className="absolute -right-16 top-0 size-56 rounded-full bg-ai-violet/30 blur-3xl motion-reduce:hidden"
              aria-hidden="true"
            />
            <div
              className="absolute -left-12 bottom-0 size-48 rounded-full bg-ai-cyan/20 blur-3xl motion-reduce:hidden"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-2xl space-y-6">
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                Stop missing bid deadlines. Start estimating in{" "}
                <span className="text-ai-gradient">minutes</span>.
              </h2>
              <p className="font-body text-base leading-relaxed text-slate-400">
                Join fire alarm company_owners using AI to accelerate NFPA 72
                design, BOM generation, and compliance review — without
                replacing licensed engineering oversight.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={routes.signup}
                  className={cn(
                    buttonVariants({ variant: "ai" }),
                    "h-12 max-w-none gap-2 rounded-[10px] px-8 sm:w-auto",
                  )}
                >
                  Create Your Account
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={routes.login}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-12 max-w-none rounded-[10px] border-white/20 bg-transparent px-8 text-white hover:bg-white/10 sm:w-auto",
                  )}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
