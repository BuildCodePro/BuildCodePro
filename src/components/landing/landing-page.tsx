import { LandingAudiences } from "./landing-audiences";
import { LandingAuthRedirect } from "./landing-auth-redirect";
import { LandingCta } from "./landing-cta";
import { LandingFeatures } from "./landing-features";
import { LandingFooter } from "./landing-footer";
import { LandingHero } from "./landing-hero";
import { LandingHowItWorks } from "./landing-how-it-works";
import { LandingNav } from "./landing-nav";
import { LandingPricing } from "./landing-pricing";
import { LandingStats } from "./landing-stats";

export function LandingPage() {
  return (
    <>
      <LandingAuthRedirect />
      <div className="min-h-screen bg-background">
        <LandingNav />
        <main>
          <LandingHero />
          <LandingStats />
          <LandingFeatures />
          <LandingHowItWorks />
          <LandingAudiences />
          <LandingPricing />
          <LandingCta />
        </main>
        <LandingFooter />
      </div>
    </>
  );
}
