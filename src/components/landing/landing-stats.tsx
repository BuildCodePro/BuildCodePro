import { LANDING_STATS } from "@/lib/constants/landing";

import { ScrollReveal } from "./scroll-reveal";

export function LandingStats() {
  return (
    <section className="border-y border-ai-indigo/10 bg-white py-12 sm:py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {LANDING_STATS.map((stat, index) => (
          <ScrollReveal key={stat.value} delay={index * 80}>
            <div className="text-center md:text-left">
              <p className="font-heading text-2xl font-bold text-ai-gradient sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-2 font-body text-sm leading-relaxed text-stat-label">
                {stat.label}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
