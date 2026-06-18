import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/icons/logo";
import { routes } from "@/config/routes";
import { LANDING_NAV_LINKS } from "@/lib/constants/landing";
import { SUPPORT_CONTACT } from "@/lib/constants/support";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span
          className="h-4 w-0.5 shrink-0 rounded-full bg-gradient-to-b from-ai-indigo to-ai-cyan"
          aria-hidden="true"
        />
        <h3 className="font-heading text-sm font-semibold tracking-wide text-white">
          {title}
        </h3>
      </div>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "group relative inline-block font-body text-sm text-slate-400 transition-colors duration-300 hover:text-ai-cyan";

  const underline = (
    <span
      className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-ai-indigo to-ai-cyan transition-all duration-300 group-hover:w-full"
      aria-hidden="true"
    />
  );

  if (external) {
    return (
      <a href={href} className={className}>
        {children}
        {underline}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      {underline}
    </Link>
  );
}

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ai-mesh">
      <div className="footer-top-shine motion-reduce:opacity-60" aria-hidden="true" />
      <div
        className="landing-hero-grid absolute inset-0 opacity-[0.1]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/4 size-64 rounded-full bg-primary/10 blur-3xl motion-reduce:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-16 right-1/4 size-48 rounded-full bg-ai-cyan/8 blur-3xl motion-reduce:hidden"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-11 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-14">
          <div className="space-y-5">
            <div className="relative inline-block">
              <div
                className="footer-logo-glow pointer-events-none absolute -inset-6 motion-reduce:hidden"
                aria-hidden="true"
              />
              <Link href="/" aria-label="BuildCode Pro home" className="relative">
                <Logo height={44} className="h-11 w-auto" />
              </Link>
            </div>
            <p className="max-w-sm font-body text-sm leading-relaxed text-slate-400">
              {siteConfig.description}
            </p>
          </div>

          <FooterColumn title="Product">
            {LANDING_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <FooterLink href={link.href} external>
                  {link.label}
                </FooterLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Account">
            <li>
              <FooterLink href={routes.login}>Sign In</FooterLink>
            </li>
            <li>
              <FooterLink href={routes.signup}>Create Account</FooterLink>
            </li>
            <li>
              <FooterLink href={`mailto:${SUPPORT_CONTACT.email}`} external>
                Contact Support
              </FooterLink>
            </li>
          </FooterColumn>
        </div>

        <div className="footer-divider my-8 sm:my-10" aria-hidden="true" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-slate-500">
            &copy; {year}{" "}
            <span className="text-slate-400">{siteConfig.name}</span>. All
            rights reserved.
          </p>
          <p
            className={cn(
              "max-w-md font-body text-xs leading-relaxed text-slate-500",
              "sm:border-l sm:border-white/10 sm:pl-6 sm:text-right",
            )}
          >
            AI output accelerates estimation — final designs require licensed PE
            review.
          </p>
        </div>
      </div>
    </footer>
  );
}
