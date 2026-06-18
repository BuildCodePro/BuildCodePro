import { LANDING_FEATURES } from "@/lib/constants/landing";

import { ScrollReveal } from "./scroll-reveal";

export function LandingFeatures() {
  return (
    <section id="features" className="bg-surface-ai py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-body text-sm font-semibold uppercase tracking-wider text-ai-indigo">
              Platform Modules
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Everything you need to estimate faster
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-stat-label">
              BuildCode Pro automates the pre-bid stage with AI design, material
              takeoffs, compliance validation, and exportable deliverables.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:gap-6">
          {LANDING_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollReveal key={feature.id} delay={index * 100}>
                <article className="group h-full rounded-[16px] border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ai-indigo/30 hover:shadow-ai-glow sm:p-7">
                  <div className="inline-flex size-11 items-center justify-center rounded-[12px] bg-ai-icon text-ai-indigo transition-all duration-300 group-hover:bg-ai-gradient group-hover:text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-stat-label">
                    {feature.description}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
