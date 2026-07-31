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
import { useLoginMutation } from "@/services/authService";
import { useAuthStore } from "@/store/auth-store";
import { validateLoginForm } from "@/lib/validations/auth";
import type { LoginFormData } from "@/types/auth";
import { toast } from "sonner";

const ROLE_REDIRECT_MAP: Record<string, string> = {
  company_owner: "/company/dashboard",
  engineer: "/engineer",
  estimator: "/estimator",
  super_admin: "/super-admin",
};

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [authError, setAuthError] = useState<string | null>(null);

  const { mutate: loginUser, isPending: isSubmitting } = useLoginMutation();
  const role = useAuthStore((s) => s.role);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    const validation = validateLoginForm(formData);
    setErrors(validation.errors);

    if (!validation.success) {
      return;
    }

    loginUser(
      {
        email: formData.email,
        password: formData.password,
        remember_me: formData.rememberMe,
      },
      {
        onSuccess: (data) => {
          if (!data?.requires_otp) {
            const raw = data?.payload ?? data?.data ?? data;
            const directRole = (data as any)?.role ?? raw?.role ?? raw?.user?.role ?? raw?.user?.roleName ?? useAuthStore.getState().role;
            const destination = directRole
              ? ROLE_REDIRECT_MAP[directRole as string] ?? "/dashboard"
              : "/dashboard";
            router.replace(destination);
            toast.success("Login Successfully");
            return;
          }
          router.push(`${routes.verifyOtp}?email=${encodeURIComponent(formData.email)}&flow=login&remember_me=${formData.rememberMe}`);
          toast.success("OTP sent on your email successfully")
          return;
        },
        onError: (error: any) => {
          const message =
            error instanceof Error
              ? error.message : error?.data?.message;
          toast.error(message)
          console.log("error",error);
          
          setAuthError(message);
        },
      },
    );
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