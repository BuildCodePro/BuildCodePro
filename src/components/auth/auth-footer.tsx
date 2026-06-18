import Link from "next/link";

import { GoogleIcon } from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface SocialLoginButtonProps {
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
}

export function SocialLoginButton({
  fullWidth = false,
  className,
  onClick,
}: SocialLoginButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="social"
      onClick={onClick}
      className={cn(fullWidth && "max-w-none", className)}
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}

interface AuthFooterLinkProps {
  prompt: string;
  linkText: string;
  href: string;
  className?: string;
}

export function AuthFooterLink({
  prompt,
  linkText,
  href,
  className,
}: AuthFooterLinkProps) {
  return (
    <p className={cn("mt-10 font-body text-sm text-muted-foreground", className)}>
      {prompt}{" "}
      <Link href={href} className="font-medium text-primary hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
