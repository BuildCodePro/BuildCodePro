"use client";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthHeader } from "@/components/auth/auth-header";
import { SignupForm } from "./signup-form";

export function SignupWizard() {
  return (
    <AuthFormShell size="wide">
      <AuthHeader
        title="Create your company account"
        subtitle="Sign up as a fire alarm company_owner  estimators and engineers are invited by you"
        className=""
      />

      <SignupForm />
    </AuthFormShell>
  );
}