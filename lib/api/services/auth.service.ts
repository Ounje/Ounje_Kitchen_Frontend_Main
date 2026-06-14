import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";
import type { LoginCredentials, LoginResponse, User, ChangePasswordData } from "@/types";

// ─── cookie helpers (private to this module) ─────────────────────────────────
// Backend's protect middleware reads the Bearer header, not the HttpOnly cookie
// it sets. So we store the token in a JS-readable cookie and attach it as a
// header on every request via client.ts.  Cookie name matches what the backend
// already uses so nothing conflicts if the backend is later updated to also
// read from cookies.

const COOKIE_NAME = "ounje_token";
const THIRTY_DAYS = 60 * 60 * 24 * 30; // seconds

function setCookie(token: string, rememberMe = false) {
  const parts = [`${COOKIE_NAME}=${encodeURIComponent(token)}`, "Path=/", "SameSite=Lax"];
  if (rememberMe) parts.push(`Max-Age=${THIRTY_DAYS}`);
  // Secure flag only in production (localhost doesn't use HTTPS)
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    parts.push("Secure");
  }
  document.cookie = parts.join("; ");
}

function getCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function removeCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0`;
}

// ─── service ──────────────────────────────────────────────────────────────────
class AuthService {
  // ── token accessors (used by client.ts and AuthContext) ─────────────────────
  getToken(): string | null {
    return getCookie();
  }
  hasToken(): boolean {
    return !!getCookie();
  }
  saveToken(token: string, rememberMe = false) {
    setCookie(token, rememberMe);
  }
  clearToken() {
    removeCookie();
  }

  // ── API calls ───────────────────────────────────────────────────────────────

  /**
   * POST /api/auth/login
   * Returns the raw backend body: { success, message, data: { token, user } }
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      { email: credentials.email, password: credentials.password },
      { requiresAuth: false }
    );
  }

  /**
   * GET /api/auth/me
   * Backend returns { success: true, data: { ...user } }.
   * We unwrap .data here so callers just get the User object.
   */
  async getMe(): Promise<User> {
    const res = await apiClient.get<{ success: boolean; data: User }>(ENDPOINTS.AUTH.ME);
    return res.data;
  }

  /**
   * PUT /api/auth/change-password
   */
  async changePassword(
    payload: ChangePasswordData
  ): Promise<{ success: boolean; message: string; data?: { dashboardUrl: string } }> {
    return apiClient.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  }

  /**
   * POST /api/auth/logout
   * Backend only logs the event; it does not clear its own cookie.
   * We clear ours after the call (or even if it fails).
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      removeCookie();
    }
  }
}

export const authService = new AuthService();
