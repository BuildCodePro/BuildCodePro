"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthFooterLink, SocialLoginButton } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthHeader } from "@/components/auth/auth-header";
import { FormField } from "@/components/ui/form-field";
import { PasswordField } from "@/components/ui/password-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { routes } from "@/config/routes";
import { authenticateMockUser } from "@/lib/auth/mock-users";
import {
  getDashboardPathForRole,
  setSession,
} from "@/lib/auth/session";
import { validateLoginForm } from "@/lib/validations/auth";
import type { LoginFormData } from "@/types/auth";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    const validation = validateLoginForm(formData);
    setErrors(validation.errors);

    if (!validation.success) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    const user = authenticateMockUser(formData.email, formData.password);

    if (!user) {
      setAuthError("Invalid email or password. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSession(user);
    setIsSubmitting(false);
    router.replace(getDashboardPathForRole(user.role));
  };

  return (
    <AuthFormShell>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to your BuildCode Pro account"
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
          leftIcon={<Mail className="size-[18px]" aria-hidden="true" />}
          value={formData.email}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, email: event.target.value }))
          }
          error={errors.email}
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              password: event.target.value,
            }))
          }
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  rememberMe: event.target.checked,
                }))
              }
            />
            <span className="font-body text-sm text-muted-foreground">
              Remember me
            </span>
          </label>

          <Link
            href={routes.forgotPassword}
            className="font-body text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {authError ? (
          <p className="font-body text-sm text-primary" role="alert">
            {authError}
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="mt-1">
          {isSubmitting ? "Signing in..." : "Sign In to BuildCode Pro"}
        </Button>
      </form>

      <AuthDivider />
      <SocialLoginButton />

      <AuthFooterLink
        prompt="Don't have an account?"
        linkText="Sign up free"
        href={routes.signup}
      />
    </AuthFormShell>
  );
}
