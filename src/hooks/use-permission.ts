"use client";

import { useAuthStore } from "@/store/auth-store";

export type ModuleKey =
    | "ai_design_engine"
    | "bom_generation"
    | "pdf_export"
    | "compliance_engine"
    | "csv_export"
    | "team_accounts"
    | "dedicated_support";

interface UseModulePermissionResult {
    /** Whether the current user's plan includes this module. */
    hasModule: (moduleKey: ModuleKey) => boolean;
    /** True only when role === "company_owner" — the only role this
     * plan-based restriction applies to. */
    isRestrictedRole: boolean;
    modules: Record<ModuleKey, boolean> | undefined;
    planName: string | undefined;
}

export function useModulePermission(): UseModulePermissionResult {
    const { user, role } = useAuthStore();

    const isRestrictedRole = role === "company_owner";

    const modules = (user as any)?.modules as
        | Record<ModuleKey, boolean>
        | undefined;

    const hasModule = (moduleKey: ModuleKey): boolean => {
        if (!isRestrictedRole) return true;
        return Boolean(modules?.[moduleKey]);
    };

    return {
        hasModule,
        isRestrictedRole,
        modules,
        planName: (user as any)?.plan?.name,
    };
}