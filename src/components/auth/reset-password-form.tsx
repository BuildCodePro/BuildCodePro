"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthFooterLink } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthStatusMessage } from "@/components/auth/auth-status-message";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { validateResetPasswordForm } from "@/lib/validations/auth";
import type { ResetPasswordFormData } from "@/types/auth";
import { useResetPasswordMutation } from "@/services/authService";
import { toast } from "sonner";
import { PasswordField } from "../ui";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ResetPasswordFormData, string>>
  >({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isResetComplete, setIsResetComplete] = useState(false);

  const { mutate: resetPassword, isPending: isSubmitting } = useResetPasswordMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setAuthError(null);

    const validation = validateResetPasswordForm(formData);
    setErrors(validation.errors);

    if (!validation.success) {
      return;
    }

    if (!token) {
      setAuthError("Missing or invalid reset token. Please try requesting a new link.");
      return;
    }

    resetPassword(
      { token, new_password: formData.password },
      {
        onSuccess: () => {
          setIsResetComplete(true);
          toast.success("Password reset successfully")
        },
        onError: (error: any) => {
          const message =
            error instanceof Error
              ? error.message
              : error.data.message;
          toast.error(message)
          setAuthError(message);
        },
      }
    );
  };

  if (isResetComplete) {
    return (
      <AuthFormShell>
        <AuthStatusMessage
          title="Password updated"
          subtitle="Your password has been reset successfully. You can now sign in with your new password."
        >
          <Button type="button" onClick={() => router.push(routes.login)}>
            Sign In to BuildCode Pro
          </Button>
        </AuthStatusMessage>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell>
      <AuthHeader
        title="Reset your password"
        subtitle="Enter a new password for your BuildCode Pro account"
      />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-5"
        noValidate
      >
        
        <PasswordField
          label="New Password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a new password"
          value={formData.password}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              password: event.target.value,
            }))
          }
          error={errors.password}
        />

        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              confirmPassword: event.target.value,
            }))
          }
          error={errors.confirmPassword}
        />

        {authError ? (
          <p className="font-body text-sm text-primary" role="alert">
            {authError}
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="mt-1">
          {isSubmitting ? "Updating..." : "Reset Password"}
        </Button>
      </form>

      <AuthFooterLink
        prompt="Back to"
        linkText="Sign in"
        href={routes.login}
      />
    </AuthFormShell>
  );
}
