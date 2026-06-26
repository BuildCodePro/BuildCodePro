import { LANDING_AUDIENCES } from "@/lib/constants/landing";

import { ScrollReveal } from "./scroll-reveal";

export function LandingAudiences() {
  return (
    <section className="relative overflow-hidden bg-ai-mesh py-16 sm:py-20 lg:py-24">
      <div className="landing-hero-grid absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-body text-sm font-semibold uppercase tracking-wider text-ai-cyan">
              Built For Your Team
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
              One platform, every role on the{" "}
              <span className="text-ai-gradient">bid</span>
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-slate-400">
              Contractors, estimators, and licensed engineers each get a
              purpose-built workspace with the right permissions and workflows.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {LANDING_AUDIENCES.map((audience, index) => (
            <ScrollReveal key={audience.id} delay={index * 100}>
              <article className="h-full rounded-[16px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-ai-cyan/30 hover:bg-white/10 sm:p-7">
                <h3 className="font-heading text-lg font-bold text-white">
                  {audience.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-slate-400">
                  {audience.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
