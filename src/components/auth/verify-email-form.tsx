"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthFooterLink } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthStatusMessage } from "@/components/auth/auth-status-message";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const inviteCount = Number.parseInt(searchParams.get("invites") ?? "0", 10);
  const [isResending, setIsResending] = useState(false);
  const [isResent, setIsResent] = useState(false);

  const handleResend = async () => {
    setIsResending(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsResending(false);
    setIsResent(true);
  };

  return (
    <AuthFormShell>
      <AuthStatusMessage
        title="Verify your email"
        subtitle={
          email ? (
            <>
              We sent a verification link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Click the link in the email to activate your company account.
              {inviteCount > 0 ? (
                <>
                  {" "}
                  {inviteCount} team member{inviteCount === 1 ? "" : "s"} will
                  receive login credentials once you verify.
                </>
              ) : null}
            </>
          ) : (
            "We sent a verification link to your email address. Click the link to activate your account."
          )
        }
      >
        <Button
          type="button"
          variant="outline"
          disabled={isResending || isResent}
          onClick={handleResend}
        >
          {isResending
            ? "Sending..."
            : isResent
              ? "Verification email sent"
              : "Resend verification email"}
        </Button>
      </AuthStatusMessage>

      <AuthFooterLink
        prompt="Back to"
        linkText="Sign in"
        href={routes.login}
      />
    </AuthFormShell>
  );
}
