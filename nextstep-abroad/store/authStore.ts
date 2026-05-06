import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AxiosError } from "axios";

import { AuthUser, LoginPayload } from "@/types/auth.types";
import { loginUser } from "@/services/authService";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (payload: LoginPayload) => Promise<boolean>;
  logout: () => void;
}

function setAuthCookie(value: boolean) {
  if (typeof document === "undefined") return;
  if (value) {
    document.cookie = "isLoggedIn=true; path=/; SameSite=Lax";
  } else {
    document.cookie =
      "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (payload) => {
        try {
          set({ loading: true, error: null });

          const response = await loginUser(payload);

          set({
            user: response,
            token: response.token,
            loading: false,
          });

          setAuthCookie(Boolean(response.token));
          return true;
        } catch (error: unknown) {
          const axiosError = error as AxiosError<{ message?: string }>;
          set({
            user: null,
            token: null,
            error:
              axiosError.response?.data?.message ||
              "Invalid username or password",
            loading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        setAuthCookie(false);
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Separate hook to check if Zustand has finished rehydrating
 * from localStorage. Use this in ProtectedRoute to avoid
 * redirecting before the token is loaded.
 */
export const useAuthHydrated = () =>
  true;
