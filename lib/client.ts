import { API_CONFIG } from "./config";
import { toast } from "sonner";

export class PasswordChangeRequiredError extends Error {
  constructor(message: string = "Password change required") {
    super(message);
    this.name = "PasswordChangeRequiredError";
  }
}

// Lazy import so there is no circular dependency at module-load time.
// authService is the single owner of the token; client.ts just asks for it.
let _authService: typeof import("@/lib/api/services/auth.service").authService;
async function getAuthService() {
  if (!_authService) {
    const mod = await import("@/lib/api/services/auth.service");
    _authService = mod.authService;
  }
  return _authService;
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  params?: Record<string, any>; // Query parameters
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Build query string from params object
   */
  private buildQueryString(params?: Record<string, any>): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  private async handleResponse<T>(response: Response, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true } = options;

    if (response.status === 401 && requiresAuth) {
      const { authService } = await import("@/lib/api/services/auth.service");
      authService.clearToken();
      if (typeof window !== "undefined") window.location.href = "/";
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      let message = response.statusText;
      try {
        const body = await response.json();
        message = body.message || message;
      } catch {
        // not JSON – keep statusText
      }

      // ✅ GLOBAL INTERCEPTOR: Trap exact security requirements
      if (response.status === 403 && message.toLowerCase().includes("password") && requiresAuth) {
        if (typeof window !== "undefined") {
          const portalRoute = window.location.pathname.split("/")[1] || "";
          const settingsPath = portalRoute ? `/${portalRoute}/settings` : "/settings";

          // Only redirect if NOT already on the settings page — avoids a hard-reload loop
          // when the settings page itself makes API calls that are blocked by requirePasswordChange
          if (!window.location.pathname.startsWith(settingsPath)) {
            toast.error(message || "Password change required. Please update your password.");

            // Allow toast to show briefly before navigating
            setTimeout(() => {
              window.location.href = `${settingsPath}?mustChange=true`;
            }, 1000);
          }
        }
        throw new PasswordChangeRequiredError(message);
      }

      throw new Error(message);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return "" as unknown as T;
    return response.json();
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { requiresAuth = true, headers: extra, params, body, ...rest } = options;

    const headers: Record<string, string> = {
      ...((extra as Record<string, string>) || {}),
    };

    // ✅ Only set Content-Type for JSON, not for FormData
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (requiresAuth) {
      const svc = await getAuthService();
      const token = svc.getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    // Build full URL with query params
    const queryString = this.buildQueryString(params);
    const url = `${this.baseURL}${endpoint}${queryString}`;

    console.log("[API Client] Request:", { url, method: rest.method || "GET", params });

    const response = await fetch(url, {
      ...rest,
      body, // ✅ Pass body as-is (could be FormData or string)
      headers,
    });

    return this.handleResponse<T>(response, options);
  }

  // ── convenience ─────────────────────────────────────────────────────────────
  get<T>(ep: string, opts?: RequestOptions) {
    return this.request<T>(ep, { ...opts, method: "GET" });
  }

  post<T>(ep: string, data?: unknown, opts?: RequestOptions) {
    // ✅ Check if data is FormData
    const isFormData = data instanceof FormData;

    return this.request<T>(ep, {
      ...opts,
      method: "POST",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(ep: string, data?: unknown, opts?: RequestOptions) {
    // ✅ Check if data is FormData
    const isFormData = data instanceof FormData;

    return this.request<T>(ep, {
      ...opts,
      method: "PUT",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(ep: string, opts?: RequestOptions) {
    return this.request<T>(ep, { ...opts, method: "DELETE" });
  }

  patch<T>(ep: string, data?: unknown, opts?: RequestOptions) {
    return this.request<T>(ep, {
      ...opts,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new APIClient(API_CONFIG.BASE_URL);
