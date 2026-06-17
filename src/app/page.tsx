import type { Metadata } from "next";

import { LandingPage } from "@/components/landing";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "AI Fire Alarm Estimation for Contractors",
  description: siteConfig.description,
};

export default function HomePage() {
  return <LandingPage />;
}
