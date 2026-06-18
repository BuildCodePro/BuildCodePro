"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthFooterLink, SocialLoginButton } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthHeader } from "@/components/auth/auth-header";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { routes } from "@/config/routes";
import { validateSignupForm } from "@/lib/validations/auth";
import type { SignupFormData } from "@/types/auth";

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateSignupForm(formData);
    setErrors(validation.errors);

    if (!validation.success) {
      return;
    }

    setIsSubmitting(true);

    // Auth integration will be wired in Milestone 1
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    router.push(`${routes.verifyEmail}?email=${encodeURIComponent(formData.email)}`);
  };

  return (
    <AuthFormShell size="wide">
      <AuthHeader
        title="Create your account"
        subtitle="Start your free trial — no credit card required"
        className="mb-8"
      />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4"
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Full Name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                fullName: event.target.value,
              }))
            }
            error={errors.fullName}
          />

          <FormField
            label="Company Name"
            name="companyName"
            type="text"
            autoComplete="organization"
            placeholder="Acme Fire Protection"
            value={formData.companyName}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                companyName: event.target.value,
              }))
            }
            error={errors.companyName}
          />
        </div>

        <FormField
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, email: event.target.value }))
          }
          error={errors.email}
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
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

        <div className="pt-1">
          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              id="acceptTerms"
              className="mt-0.5"
              checked={formData.acceptTerms}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  acceptTerms: event.target.checked,
                }))
              }
            />
            <span className="font-body text-sm leading-snug text-muted-foreground">
              I agree to the{" "}
              <Link
                href={routes.terms}
                className="font-medium text-primary hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href={routes.privacy}
                className="font-medium text-primary hover:underline"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.acceptTerms ? (
            <p className="mt-1.5 font-body text-xs text-primary">
              {errors.acceptTerms}
            </p>
          ) : null}
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-2 max-w-none">
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <AuthDivider className="my-6" />
      <SocialLoginButton fullWidth />

      <AuthFooterLink
        prompt="Already have an account?"
        linkText="Sign in"
        href={routes.login}
        className="mt-8"
      />
    </AuthFormShell>
  );
}
