"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthFooterLink } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthStatusMessage } from "@/components/auth/auth-status-message";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { getDashboardPathForRole } from "@/lib/auth/session";
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/services/authService";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types/auth";
import { toast } from "sonner";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const inviteCount = Number.parseInt(searchParams.get("invites") ?? "0", 10);

  const [verifyStatus, setVerifyStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const verifyMutation = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) return;

    verifyMutation.mutate(
      { token },
      {
        onSuccess: (response) => {
          setVerifyStatus("success");
          toast.success("Email Verified Successfully!");

          const role = (response.role ?? useAuthStore.getState().role) as UserRole | null;
          if (role) {
            router.replace(getDashboardPathForRole(role));
            return;
          }

          router.replace(routes.login);
        },
        onError: (error: any) => {
          setVerifyStatus("error");
          setVerifyError(
            error instanceof Error
              ? error.message
              : error.data.message,
          );
          toast.error(error.message || error.data.message)
        },
      },
    );
  }, [token]);

  const [isResent, setIsResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const { mutate: resendVerification, isPending: isResending } =
    useResendVerificationMutation();

  const handleResend = () => {
    if (!email) {
      setResendError("Email address not found. Please sign up again.");
      return;
    }

    setResendError(null);

    resendVerification(
      { email },
      {
        onSuccess: () => setIsResent(true),
        onError: (error: unknown) => {
          const message =
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.";
          setResendError(message);
        },
      },
    );
  };

  if (token) {
    if (verifyStatus === "verifying") {
      return (
        <AuthFormShell>
          <AuthStatusMessage
            title="Verifying your email"
            subtitle="Please wait a moment..."
          />
        </AuthFormShell>
      );
    }

    if (verifyStatus === "success") {
      return (
        <AuthFormShell>
          <AuthStatusMessage
            title="Email verified successfully"
            subtitle="Your account has been activated. Redirecting you to your dashboard..."
          />
        </AuthFormShell>
      );
    }

    return (
      <AuthFormShell>
        <AuthStatusMessage
          title="Verification link expired"
          subtitle={verifyError ?? "This link is no longer valid."}
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

          {resendError ? (
            <p className="mt-2 font-body text-sm text-primary">
              {resendError}
            </p>
          ) : null}
        </AuthStatusMessage>

        <AuthFooterLink
          prompt="Back to"
          linkText="Sign in"
          href={routes.login}
        />
      </AuthFormShell>
    );
  }

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

        {resendError ? (
          <p className="mt-2 font-body text-sm text-primary">
            {resendError}
          </p>
        ) : null}
      </AuthStatusMessage>

      <AuthFooterLink
        prompt="Back to"
        linkText="Sign in"
        href={routes.login}
      />
    </AuthFormShell>
  );
}