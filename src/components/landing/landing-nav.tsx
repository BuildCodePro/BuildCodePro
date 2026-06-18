"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/icons/logo";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { LANDING_NAV_LINKS } from "@/lib/constants/landing";
import { cn } from "@/lib/utils/cn";

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-ai-indigo/20 bg-[#060912]/90 shadow-lg shadow-ai-indigo/10 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link href="/" aria-label="BuildCode Pro home" className="shrink-0">
          <Logo height={44} className="h-11 w-auto" />
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {LANDING_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm font-medium text-slate-300 transition-colors hover:text-ai-cyan"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={routes.login}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-10 max-w-none border-white/20 bg-transparent px-5 text-white hover:bg-white/10",
            )}
          >
            Sign In
          </Link>
          <Link
            href={routes.signup}
            className={cn(
              buttonVariants({ variant: "ai", size: "sm" }),
              "h-10 max-w-none px-5",
            )}
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-[10px] text-white md:hidden"
          aria-expanded={isMobileOpen}
          aria-controls="landing-mobile-menu"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileOpen((open) => !open)}
        >
          {isMobileOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      <div
        id="landing-mobile-menu"
        className={cn(
          "border-t border-white/10 bg-[#060912] md:hidden",
          isMobileOpen ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
          {LANDING_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="rounded-[10px] px-3 py-3 font-body text-sm font-medium text-slate-200 hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-4">
            <Link
              href={routes.login}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-11 max-w-none border-white/20 bg-transparent text-white hover:bg-white/10",
              )}
            >
              Sign In
            </Link>
            <Link
              href={routes.signup}
              className={cn(
                buttonVariants({ variant: "ai", size: "sm" }),
                "h-11 max-w-none",
              )}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
