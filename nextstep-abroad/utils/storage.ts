/**
 * localStorage helpers with safe JSON parsing.
 *
 * Why: Direct localStorage access can throw in SSR (server-side rendering)
 * and when JSON is malformed. These wrappers handle both cases gracefully.
 */

export function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore quota errors
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function clearAll(): void {
  if (typeof window === "undefined") return;
  localStorage.clear();
}
