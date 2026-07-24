"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthFooterLink, SocialLoginButton } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { routes } from "@/config/routes";
import { useRegisterMutation } from "@/services/authService";
import { toast } from "sonner";
import { PasswordField } from "../ui";

const signupSchema = z
  .object({
    ownerName: z
      .string()
      .min(1, "Owner name is required")
      .min(2, "Owner name must be at least 2 characters"),
    companyName: z
      .string()
      .min(1, "Company name is required")
      .min(2, "Company name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "You must accept the Terms and Privacy Policy",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

interface RegisterPayload {
  email: string;
  owner_name: string;
  company_name: string;
  role: "company_owner";
  is_verified: boolean;
  password: string;
}

export function SignupForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      ownerName: "",
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const { mutate: registerUser, isPending } = useRegisterMutation();

  const acceptTerms = watch("acceptTerms");

  const onSubmit = (values: SignupFormValues) => {
    setApiError(null);

    const payload: RegisterPayload = {
      email: values.email,
      owner_name: values.ownerName,
      company_name: values.companyName,
      role: "company_owner",
      is_verified: true,
      password: values.password,
    };

    registerUser(payload, {
      onSuccess: () => {
        router.push(
          `${routes.verifyEmail}?email=${encodeURIComponent(values.email)}`,
        );
        toast.success("Verification email sent on your email id.")
      },
      onError: (error: any) => {
        const message =
          error instanceof Error
            ? error.message
            : error.data.message;
        setApiError(message);
      },
    });
  };

  return (
    <AuthFormShell size="wide">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Owner Name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            error={errors.ownerName?.message}
            {...register("ownerName")}
          />

          <FormField
            label="Company Name"
            type="text"
            autoComplete="organization"
            placeholder="Acme Fire Protection"
            error={errors.companyName?.message}
            {...register("companyName")}
          />
        </div>

        <FormField
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordField
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordField
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="pt-1">
          <label className="flex cursor-pointer items-start gap-2.5">
            <Checkbox
              id="acceptTerms"
              className="mt-0.5"
              checked={acceptTerms}
              onChange={(event) =>
                setValue("acceptTerms", event.target.checked, {
                  shouldValidate: true,
                })
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
              {errors.acceptTerms.message}
            </p>
          ) : null}
        </div>

        {apiError ? (
          <p className="font-body text-sm text-primary">{apiError}</p>
        ) : null}

        <Button type="submit" disabled={isPending} className="mt-2 max-w-none">
          {isPending ? "Creating account..." : "Create Account"}
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