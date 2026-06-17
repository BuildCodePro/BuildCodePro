import Image from "next/image";
import Link from "next/link";

import { Logo } from "@/components/icons/logo";

export function BrandPanel() {
  return (
    <aside className="relative hidden min-h-screen w-1/2 overflow-hidden lg:block">
      <Image
        src="/images/brand-panel.png"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="50vw"
      />
      <div className="absolute inset-0 bg-slate-950/20" />

      <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
        <Link href="/" aria-label="BuildCode Pro home" className="inline-block">
          <Logo height={96} className="h-24 w-auto" />
        </Link>

        <div className="max-w-xl space-y-5 pb-4">
          <h1 className="text-brand-headline text-white">
            AI-powered fire alarm
            <br />
            estimation for contractors.
          </h1>
          <p className="text-brand-description max-w-lg">
            Upload construction drawings and receive NFPA 72 compliant design
            recommendations, material takeoffs, and compliance reports in
            minutes.
          </p>
        </div>
      </div>
    </aside>
  );
}
