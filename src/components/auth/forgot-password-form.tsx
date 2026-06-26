"use client";

import { useState } from "react";

import { AuthFooterLink } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthStatusMessage } from "@/components/auth/auth-status-message";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { validateForgotPasswordForm } from "@/lib/validations/auth";
import type { ForgotPasswordFormData } from "@/types/auth";

export function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ForgotPasswordFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateForgotPasswordForm(formData);
    setErrors(validation.errors);

    if (!validation.success) {
      return;
    }

    setIsSubmitting(true);

    // Auth integration will be wired in Milestone 1
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsEmailSent(true);
  };

  if (isEmailSent) {
    return (
      <AuthFormShell>
        <AuthStatusMessage
          title="Check your email"
          subtitle={
            <>
              We sent a password reset link to{" "}
              <span className="font-medium text-foreground">{formData.email}</span>
              . Click the link in the email to reset your password.
            </>
          }
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEmailSent(false)}
          >
            Try a different email
          </Button>
        </AuthStatusMessage>

        <AuthFooterLink
          prompt="Remember your password?"
          linkText="Sign in"
          href={routes.login}
        />
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell>
      <AuthHeader
        title="Forgot your password?"
        subtitle="Enter your email and we'll send you a reset link"
      />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-5"
        noValidate
      >
        <FormField
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={(event) =>
            setFormData({ email: event.target.value })
          }
          error={errors.email}
        />

        <Button type="submit" disabled={isSubmitting} className="mt-1">
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <AuthFooterLink
        prompt="Remember your password?"
        linkText="Sign in"
        href={routes.login}
      />
    </AuthFormShell>
  );
}
