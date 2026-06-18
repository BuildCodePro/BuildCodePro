import Image from "next/image";

import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  height?: number;
}

const LOGO_ASPECT_RATIO = 266 / 78;

export function Logo({ className, height = 48 }: LogoProps) {
  const width = Math.round(height * LOGO_ASPECT_RATIO);

  return (
    <Image
      src="/images/buildcode-pro-logo.png"
      alt="BuildCode Pro"
      width={width}
      height={height}
      priority
      className={cn("w-auto", className)}
    />
  );
}
