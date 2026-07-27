"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthFooterLink } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthStatusMessage } from "@/components/auth/auth-status-message";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { getDashboardPathForRole } from "@/lib/auth/session";
import { useVerifyEmailChangeMutation } from "@/services/useProfileService";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { useMeQuery } from "@/services/authService";

export function VerifyEmailChangeForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const [verifyStatus, setVerifyStatus] = useState<'verifying' | 'success' | 'error'>("verifying");
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const verifyMutation = useVerifyEmailChangeMutation();
    const { role } = useAuthStore();

    useEffect(() => {
        if (!token) {
            setVerifyStatus("error");
            setVerifyError("Missing verification token. Please use the link from your email.");
            return;
        }

        verifyMutation.mutate(
            { token },
            {
                onSuccess: (response) => {
                    setVerifyStatus("success");
                    setSuccessMessage(response?.message ?? null);
                    toast.success("Email address updated successfully!");


                    const redirectPath = role
                        ? getDashboardPathForRole(role)
                        : routes.login;

                    const timer = setTimeout(() => {
                        router.replace(redirectPath);
                    }, 2000);

                    return () => clearTimeout(timer);
                },
                onError: (error: any) => {
                    setVerifyStatus("error");
                    setVerifyError(
                        error instanceof Error ? error.message : error?.data?.message,
                    );
                    toast.error("This verification link has expired or is invalid.");
                },
            },
        );
    }, [token]);

    if (verifyStatus === "verifying") {
        return (
            <AuthFormShell>
                <AuthStatusMessage
                    title="Verifying your new email"
                    subtitle="Please wait a moment..."
                />
            </AuthFormShell>
        );
    }

    if (verifyStatus === "success") {
        return (
            <AuthFormShell>
                <AuthStatusMessage
                    title="Email address updated"
                    subtitle={
                        successMessage ??
                        "Your email address has been changed successfully. Redirecting you..."
                    }
                />
            </AuthFormShell>
        );
    }

    return (
        <AuthFormShell>
            <AuthStatusMessage
                title="Verification link expired"
                subtitle={
                    verifyError ??
                    "This link is no longer valid. Please request a new email change from your profile settings."
                }
            >
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(routes.login)}
                >
                    Back to Sign in
                </Button>
            </AuthStatusMessage>

            <AuthFooterLink
                prompt="Back to"
                linkText="Sign in"
                href={routes.login}
            />
        </AuthFormShell>
    );
}