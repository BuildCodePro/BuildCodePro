"use client";

import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COLOR_SCHEME_OPTIONS, DEFAULT_COLOR_SCHEME, type ColorSchemeId } from "@/lib/constants/color-scheme";
import { cn } from "@/lib/utils/cn";
import { getDynamicErrorMessage } from "@/lib/utils/error-handler";
import { useUpdateProfileMutation } from "@/services/useProfileService";
import { useAuthStore } from "@/store/auth-store";

export function AppearanceSettingsPanel() {
  const activeScheme = useAuthStore((state) => state.user?.colorScheme) ?? DEFAULT_COLOR_SCHEME;
  const updateUser = useAuthStore((state) => state.updateUser);
  const updateProfileMutation = useUpdateProfileMutation();
  const pendingScheme = updateProfileMutation.isPending ? updateProfileMutation.variables?.color_scheme : undefined;

  const selectScheme = async (schemeId: ColorSchemeId) => {
    if (schemeId === activeScheme || updateProfileMutation.isPending) return;
    const previousScheme = activeScheme;
    updateUser({ colorScheme: schemeId });
    try {
      await updateProfileMutation.mutateAsync({ color_scheme: schemeId });
      toast.success("Color scheme updated for your whole company.");
    } catch (updateError) {
      updateUser({ colorScheme: previousScheme });
      toast.error(getDynamicErrorMessage(updateError, "Could not update the color scheme"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color scheme</CardTitle>
        <CardDescription>Choose the colors everyone in your company sees. Only the company owner can change this.</CardDescription>
      </CardHeader>
      <CardContent>
        <div role="radiogroup" aria-label="Color scheme" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {COLOR_SCHEME_OPTIONS.map((schemeOption) => {
            const isActive = schemeOption.id === activeScheme;
            return (
              <button
                key={schemeOption.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => void selectScheme(schemeOption.id)}
                disabled={updateProfileMutation.isPending}
                data-testid={`color-scheme-${schemeOption.id}`}
                className={cn(
                  "flex flex-col gap-3 rounded-[16px] border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-wait",
                  isActive ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary",
                )}
              >
                <span className="flex h-12 overflow-hidden rounded-[10px] border border-border">
                  {schemeOption.swatches.map((swatchColor) => (
                    <span key={swatchColor} className="flex-1" style={{ backgroundColor: swatchColor }} />
                  ))}
                </span>
                <span className="flex items-center justify-between font-heading text-sm font-semibold text-foreground">
                  {schemeOption.label}
                  {pendingScheme === schemeOption.id ? <Loader2 className="size-4 animate-spin" /> : isActive ? <Check className="size-4 text-primary" /> : null}
                </span>
                <span className="font-body text-xs text-stat-label">{schemeOption.description}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
