"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { routes } from "@/config/routes";
import { validateSignupForm } from "@/lib/validations/auth";
import type { SignupFormData } from "@/types/auth";
import { PasswordField } from "../ui";

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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (data: SignupFormData) => setFormData(data);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);

    const validation = validateSignupForm(formData);
    setErrors(validation.errors);
    if (!validation.success) return;

    setIsSubmitting(true);

    try {
      const payload = {
        email: formData.email,
        name: formData.fullName,
        role: "company_owner",
        is_verified: true,
        password: formData.password,
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Signup failed. Please try again.");
      }

      const params = new URLSearchParams({ email: formData.email });
      router.push(`${routes.verifyEmail}?${params.toString()}`);
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4"
      noValidate
    >
      <div className="grid grid-cols-1">


        <FormField
          label="Company Name"
          name="companyName"
          type="text"
          autoComplete="organization"
          placeholder="Acme Fire Protection"
          value={formData.companyName}
          onChange={(event) =>
            handleChange({ ...formData, companyName: event.target.value })
          }

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
          handleChange({ ...formData, email: event.target.value })
        }

        required
      />

      <PasswordField
        label="Password"
        name="password"
        autoComplete="new-password"
        placeholder="Create a password"
        value={formData.password}
        onChange={(event) =>
          handleChange({ ...formData, password: event.target.value })
        }

        required
      />

      <PasswordField
        label="Confirm Password"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Re-enter password"
        value={formData.confirmPassword}
        onChange={(event) =>
          handleChange({ ...formData, confirmPassword: event.target.value })
        }

        required
      />

      <div className="pt-1">
        <label className="flex cursor-pointer items-start gap-2.5">
          <Checkbox
            id="acceptTerms"
            className="mt-0.5"
            checked={formData.acceptTerms}
            onChange={(event) =>
              handleChange({ ...formData, acceptTerms: event.target.checked })
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

      </div>

      {apiError ? (
        <p className="font-body text-sm text-primary">{apiError}</p>
      ) : null}

      <Button type="submit" className="mt-2 max-w-none" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}