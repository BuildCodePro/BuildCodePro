import { cn } from "@/lib/utils/cn";

interface PlatformHeroBannerProps {
  className?: string;
}

export function PlatformHeroBanner({ className }: PlatformHeroBannerProps) {
  return (
    <section
      className={cn(
        "rounded-[16px] bg-sidebar px-6 py-6 sm:px-8 sm:py-8",
        className,
      )}
    >
      <div className="max-w-3xl space-y-3">
        <p className="font-body text-xs font-semibold tracking-wide text-sky-400 uppercase">
          Platform Administration
        </p>
        <h2 className="text-hero-title text-white">
          Monitor companies, usage, and subscriptions
        </h2>
        <p className="text-hero-subtitle max-w-2xl">
          Oversee contractor accounts, track AI design usage across the platform,
          and manage subscription plans per the BuildCode Pro billing model.
        </p>
      </div>
    </section>
  );
}
