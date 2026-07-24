"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, UserRole } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  role: UserRole | null;
  _hasHydrated: boolean;

  setSession: (
    user: AuthUser,
    accessToken: string,
    role: UserRole
  ) => void;

  setAccessToken: (accessToken: string) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  clearSession: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      role: null,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setSession: (user, accessToken, role) => {
        set({ user, accessToken, role });
      },

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),

      clearSession: () => {
        set({ user: null, accessToken: null, role: null });
      },
    }),
    {
      name: "build-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);