import { useAuthStore } from "@/store";

const RENTFIT_SESSION_STORAGE_PREFIX = "rentfit_";

/**
 * Resets auth state and removes Rentfit-owned `sessionStorage` keys (chat bootstrap, etc.).
 * Call when the API returns 401 for an authenticated request.
 */
export function clearClientSession(): void {
  useAuthStore.getState().clearAuth();
  if (typeof sessionStorage === "undefined") return;
  for (const key of Object.keys(sessionStorage)) {
    if (key.startsWith(RENTFIT_SESSION_STORAGE_PREFIX)) {
      sessionStorage.removeItem(key);
    }
  }
}
