"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AuthFooterLink } from "@/components/auth/auth-footer";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthStatusMessage } from "@/components/auth/auth-status-message";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { getDashboardPathForRole } from "@/lib/auth/session";
import { useVerifyEmailChangeMutation } from "@/services/useProfileService";
import { apiRequest } from "@/lib/queryClient";
import type { ProfileResponse } from "@/services/useProfileService";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export function VerifyEmailChangeForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const [verifyStatus, setVerifyStatus] = useState<'verifying' | 'success' | 'error'>("verifying");
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const verifyMutation = useVerifyEmailChangeMutation();
    const { role, accessToken } = useAuthStore();
    const updateUser = useAuthStore((s) => s.updateUser);

    // Guards against React 18 StrictMode (dev) firing this effect twice,
    // which would call the verify API twice for the same token.
    const hasCalledRef = useRef(false);

    useEffect(() => {
        if (!token) {
            setVerifyStatus("error");
            setVerifyError("Missing verification token. Please use the link from your email.");
            return;
        }

        if (hasCalledRef.current) return;
        hasCalledRef.current = true;

        let isMounted = true;
        let redirectTimeout: ReturnType<typeof setTimeout> | undefined;

        const syncMeIntoStore = async () => {
            if (!accessToken) return;
            try {
                const fresh = await apiRequest<ProfileResponse>("/auth/me");
                updateUser({
                    name: fresh.full_name,
                    email: fresh.email,
                    avatarUrl: fresh.avatar_url,
                    companyName: fresh.company_name,
                    plan: fresh.plan,
                    modules: fresh.modules,
                } as any);
            } catch (error) {
                console.error("Failed to sync profile after email change:", error);
            }
        };

        verifyMutation.mutate(
            { token },
            {
                onSuccess: async (response) => {
                    await syncMeIntoStore();

                    if (!isMounted) return;

                    setVerifyStatus("success");
                    setSuccessMessage(response?.message ?? null);
                    toast.success(response?.message || "Email address updated successfully!");

                    const redirectPath = role
                        ? getDashboardPathForRole(role)
                        : routes.login;

                    redirectTimeout = setTimeout(() => {
                        router.replace(redirectPath);
                    }, 2000);
                },
                onError: (error: any) => {
                    if (!isMounted) return;

                    const message =
                        (error instanceof Error ? error.message : error?.data?.message) ||
                        error?.message ||
                        "This link is no longer valid. Please request a new email change from your profile settings.";

                    setVerifyStatus("error");
                    setVerifyError(message);
                    toast.error(message);
                },
            },
        );

        return () => {
            isMounted = false;
            if (redirectTimeout) clearTimeout(redirectTimeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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