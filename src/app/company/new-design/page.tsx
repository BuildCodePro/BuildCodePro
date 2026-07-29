import type { Metadata } from "next";

import { NewDesignPageClient } from "@/components/new-design/new-design-with-fallback";

export const metadata: Metadata = {
  title: "New Design",
  description: "Create a new fire alarm design and estimation",
};

export default function NewDesignPage() {
  return <NewDesignPageClient />;
}