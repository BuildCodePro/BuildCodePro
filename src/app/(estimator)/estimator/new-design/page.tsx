import type { Metadata } from "next";

import { DesignWizard } from "@/components/new-design";

export const metadata: Metadata = {
  title: "New Design",
  description: "Create a new fire alarm design and estimation",
};

export default function EstimatorNewDesignPage() {
  return <DesignWizard />;
}
