/**
 * useAuth — convenience hook that exposes auth state and actions.
 *
 * Wraps the Zustand authStore so components don't need to import
 * the store directly. This also makes it easy to swap the auth
 * implementation later without touching every consumer.
 */

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const isAuthenticated = !!token;

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
  };
}
