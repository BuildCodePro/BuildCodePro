import Link from "next/link";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils/cn";

export interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />

      <main className="relative overflow-hidden pb-16 pt-28">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[440px] bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.2),_transparent_55%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-16 h-64 bg-[radial-gradient(circle_at_20%_30%,_rgba(34,211,238,0.12),_transparent_35%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3 text-sm text-slate-600">
            <Link href={routes.home} className="transition-colors hover:text-primary">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-800">{title}</span>
          </div>

          <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-ai-glow">
            <header className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-8 sm:px-10">
              <span className="inline-flex items-center rounded-full border border-ai-indigo/20 bg-ai-indigo/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ai-indigo">
                Legal
              </span>
              <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-sm text-slate-500">
                Last updated: {lastUpdated}
              </p>
            </header>

            <div className="space-y-8 px-6 py-8 sm:px-10">
              <p className="text-base leading-7 text-slate-600">{intro}</p>

              {sections.map((section) => (
                <section key={section.heading} className="space-y-3">
                  <h2 className="font-heading text-xl font-semibold text-slate-900">
                    {section.heading}
                  </h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-7 text-slate-600">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-6 sm:px-10">
              <Link
                href={routes.home}
                className={cn(
                  buttonVariants({ variant: "ai", size: "sm" }),
                  "h-10 px-5",
                )}
              >
                Back to home
              </Link>
            </div>
          </article>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
