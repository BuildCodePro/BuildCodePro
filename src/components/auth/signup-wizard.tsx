"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthFooterLink, SocialLoginButton } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthHeader } from "@/components/auth/auth-header";
import { SignupAccountStep } from "@/components/auth/signup-account-step";
import { SignupInviteTeamStep } from "@/components/auth/signup-invite-team-step";
import { SignupStepIndicator } from "@/components/auth/signup-step-indicator";
import { routes } from "@/config/routes";
import type { SignupFormData } from "@/types/auth";
import type { SignupTeamInvite } from "@/types/team";

const SIGNUP_DRAFT_KEY = "buildcodepro-signup-draft";

export function SignupWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountData, setAccountData] = useState<SignupFormData>({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [invites, setInvites] = useState<SignupTeamInvite[]>([]);

  const handleComplete = async () => {
    setIsSubmitting(true);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        SIGNUP_DRAFT_KEY,
        JSON.stringify({ account: accountData, invites }),
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);

    const params = new URLSearchParams({
      email: accountData.email,
      invites: String(invites.length),
    });
    router.push(`${routes.verifyEmail}?${params.toString()}`);
  };

  return (
    <AuthFormShell size="wide">
      <SignupStepIndicator currentStep={step} />

      <AuthHeader
        title={step === 1 ? "Create your company account" : "Invite your team"}
        subtitle={
          step === 1
            ? "Sign up as a fire alarm contractor — estimators and engineers are invited by you"
            : "Add estimators and engineers with login credentials, or skip and invite later from Team settings"
        }
        className="mb-8"
      />

      {step === 1 ? (
        <SignupAccountStep
          formData={accountData}
          onChange={setAccountData}
          onContinue={() => setStep(2)}
        />
      ) : (
        <SignupInviteTeamStep
          invites={invites}
          onAddInvite={(invite) =>
            setInvites((current) => [...current, invite])
          }
          onRemoveInvite={(id) =>
            setInvites((current) => current.filter((item) => item.id !== id))
          }
          onBack={() => setStep(1)}
          onComplete={handleComplete}
          onSkip={handleComplete}
          isSubmitting={isSubmitting}
        />
      )}

      {step === 1 ? (
        <>
          <AuthDivider className="my-6" />
          <SocialLoginButton fullWidth />
        </>
      ) : null}

      <AuthFooterLink
        prompt="Already have an account?"
        linkText="Sign in"
        href={routes.login}
        className="mt-8"
      />
    </AuthFormShell>
  );
}
