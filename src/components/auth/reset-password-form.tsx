"use client";

import { useRouter } from "next/navigation";
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

export function ResetPasswordForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ResetPasswordFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateResetPasswordForm(formData);
    setErrors(validation.errors);

    if (!validation.success) {
      return;
    }

    setIsSubmitting(true);

    // Auth integration will be wired in Milestone 1
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsResetComplete(true);
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
        <FormField
          label="New Password"
          name="password"
          type="password"
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

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
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
