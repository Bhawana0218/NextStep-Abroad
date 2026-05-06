import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

/**
 * Request interceptor — attaches the auth token from Zustand
 * persisted storage to every outgoing request.
 *
 * Why: DummyJSON's protected endpoints require a Bearer token.
 * Reading from localStorage here avoids circular imports with
 * the Zustand store.
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("auth-storage");
        if (raw) {
          const parsed = JSON.parse(raw);
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch {
        // Silently ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor — handles 401 Unauthorized globally.
 * Clears auth state and redirects to login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth-storage");
      document.cookie =
        "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
