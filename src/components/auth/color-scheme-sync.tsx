"use client";

import { useEffect } from "react";

import { DEFAULT_COLOR_SCHEME, isColorSchemeId } from "@/lib/constants/color-scheme";
import { useMeQuery } from "@/services/authService";
import { useAuthStore } from "@/store/auth-store";

export function ColorSchemeSync() {
  const { data: profile } = useMeQuery();
  const storedScheme = useAuthStore((state) => state.user?.colorScheme);
  const updateUser = useAuthStore((state) => state.updateUser);
  const serverScheme = profile?.color_scheme;
  useEffect(() => {
    if (isColorSchemeId(serverScheme) && serverScheme !== storedScheme) updateUser({ colorScheme: serverScheme });
  }, [serverScheme, storedScheme, updateUser]);
  const activeScheme = isColorSchemeId(storedScheme) ? storedScheme : DEFAULT_COLOR_SCHEME;
  useEffect(() => {
    document.documentElement.dataset.scheme = activeScheme;
    return () => {
      delete document.documentElement.dataset.scheme;
    };
  }, [activeScheme]);
  return null;
}
