import type { AuthUser } from "@/types/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isHydrated: boolean;
  setHydrated: (value: boolean) => void;
  setSession: (user: AuthUser, accessToken: string) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isHydrated: false,
      setHydrated: (value) => set({ isHydrated: value }),
      setSession: (user, accessToken) => set({ user, accessToken }),
      clearSession: () => set({ user: null, accessToken: null }),
      isAuthenticated: () => Boolean(get().accessToken && get().user),
    }),
    {
      name: "sneaker-drop-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
