"use client";

import Link from "next/link";
import { useState } from "react";

import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { routes } from "@/config/routes";
import { validateSignupForm } from "@/lib/validations/auth";
import type { SignupFormData } from "@/types/auth";

interface SignupAccountStepProps {
  formData: SignupFormData;
  onChange: (data: SignupFormData) => void;
  onContinue: () => void;
}

export function SignupAccountStep({
  formData,
  onChange,
  onContinue,
}: SignupAccountStepProps) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateSignupForm(formData);
    setErrors(validation.errors);

    if (!validation.success) {
      return;
    }

    onContinue();
  };

  return (
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
            onChange({ ...formData, fullName: event.target.value })
          }
          error={errors.fullName}
          required
        />

        <FormField
          label="Company Name"
          name="companyName"
          type="text"
          autoComplete="organization"
          placeholder="Acme Fire Protection"
          value={formData.companyName}
          onChange={(event) =>
            onChange({ ...formData, companyName: event.target.value })
          }
          error={errors.companyName}
          required
        />
      </div>

      <FormField
        label="Work Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        value={formData.email}
        onChange={(event) =>
          onChange({ ...formData, email: event.target.value })
        }
        error={errors.email}
        required
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Create a password"
        value={formData.password}
        onChange={(event) =>
          onChange({ ...formData, password: event.target.value })
        }
        error={errors.password}
        required
      />

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter password"
        value={formData.confirmPassword}
        onChange={(event) =>
          onChange({ ...formData, confirmPassword: event.target.value })
        }
        error={errors.confirmPassword}
        required
      />

      <div className="pt-1">
        <label className="flex cursor-pointer items-start gap-2.5">
          <Checkbox
            id="acceptTerms"
            className="mt-0.5"
            checked={formData.acceptTerms}
            onChange={(event) =>
              onChange({ ...formData, acceptTerms: event.target.checked })
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

      <Button type="submit" className="mt-2 max-w-none">
        Continue to Team Setup
      </Button>
    </form>
  );
}
