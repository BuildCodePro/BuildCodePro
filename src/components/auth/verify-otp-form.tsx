"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthFooterLink } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthHeader } from "@/components/auth/auth-header";
import { OtpInput } from "@/components/ui/otp-input";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useVerifyOTPMutation, useResendOTPMutation } from "@/services/authService";
import { useAuthStore } from "@/store/auth-store";
import type { VerifyOTPDto } from "@/services/authService";
import { toast } from "sonner";

const ROLE_REDIRECT_MAP: Record<string, string> = {
  company_owner: "/company/dashboard",
  engineer: "/engineer",
  estimator: "/estimator",
  super_admin: "/super-admin",
};

const RESEND_COOLDOWN = 60; // seconds

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  // "login" = post-login OTP, "forgot-password" = password reset OTP
  const flow = searchParams.get("flow") || "forgot-password";

  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0); // seconds remaining

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCooldown = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCooldown(seconds);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOTPMutation();
  const { mutate: resendOtp, isPending: isResending } = useResendOTPMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResendMessage(null);

    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    const rememberMe = searchParams.get("remember_me") === "true";

    const data: VerifyOTPDto = {
      email,
      otp_code: otpCode.trim(),
      remember_me: rememberMe,
    };

    verifyOtp(data, {
      onSuccess: (response: any) => {
        if (flow === "login") {

          const currentRole = useAuthStore.getState().role;
          const destination = currentRole
            ? ROLE_REDIRECT_MAP[currentRole] ?? "/dashboard"
            : "/dashboard";
          router.replace(destination);
          toast.success("Login Successfully")
        } else {
          const token =
            response?.payload?.token ||
            response?.payload?.accessToken ||
            response?.data?.token ||
            response?.token ||
            response?.access_token ||
            "";
          router.push(
            `${routes.resetPassword}?token=${token}&email=${encodeURIComponent(email)}`
          );
          toast.error("Invalid OTP code. Please try again.")
        }
      },
      onError: (err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Invalid OTP code. Please try again.";
        setError(message);
      },
    });
  };

  const handleResend = () => {
    if (!email) {
      setError("Email is missing. Please go back and try again.");
      return;
    }

    setError(null);
    setResendMessage(null);

    resendOtp(
      { email },
      {
        onSuccess: () => {
          setResendMessage("A new OTP has been sent to your email.");
          startCooldown(RESEND_COOLDOWN);
        },
        onError: (err: any) => {
          // If backend returns a cooldown error, honour its retry_after_seconds
          const raw = (err as any)?.response ?? (err as any);
          const retryAfter: number =
            raw?.retry_after_seconds ?? raw?.data?.retry_after_seconds ?? 0;

          if (retryAfter > 0) {
            startCooldown(retryAfter);
            setError(`Please wait ${retryAfter}s before requesting a new code.`);
          } else {
            const message =
              err instanceof Error ? err.message : err.data.message;
            setError(message);
          }
        },
      }
    );
  };

  const isResendDisabled = isResending || cooldown > 0;

  return (
    <AuthFormShell>
      <AuthHeader
        title={flow === "login" ? "Verify your identity" : "Enter OTP"}
        subtitle={
          email
            ? `We sent a verification code to ${email}`
            : "Enter the verification code sent to your email"
        }
      />

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
        <OtpInput
          label="OTP Code"
          value={otpCode}
          onChange={setOtpCode}
          error={error ?? undefined}
        />

        {resendMessage ? (
          <p className="font-body text-sm text-green-600" role="alert">
            {resendMessage}
          </p>
        ) : null}

        <Button type="submit" disabled={isVerifying} className="mt-1">
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>

      <div className="mt-4 flex flex-col gap-2 text-center">
        <p className="font-body text-sm text-muted-foreground">
          Didn't receive the code?
        </p>
        <Button
          type="button"
          variant="link"
          disabled={isResendDisabled}
          onClick={handleResend}
          className="h-auto p-0 text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending
            ? "Resending..."
            : cooldown > 0
              ? `Resend OTP (${cooldown}s)`
              : "Resend OTP"}
        </Button>
      </div>

      <AuthFooterLink
        prompt="Back to"
        linkText="Sign in"
        href={routes.login}
      />
    </AuthFormShell>
  );
}
