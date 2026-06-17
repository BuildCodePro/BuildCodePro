import type { ReactNode } from "react";

import { BrandPanel } from "@/components/auth/brand-panel";

interface AuthSplitLayoutProps {
  children: ReactNode;
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <BrandPanel />
      <main className="flex min-h-screen w-full flex-1 items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        {children}
      </main>
    </div>
  );
}
