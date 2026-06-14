"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, getPortalRoute } from "@/lib/context/AuthContext";

interface RouteGuardOptions {
  /**
   * If true, returns shouldRender flag for conditional rendering
   * If false, just redirects (for use in layouts)
   */
  returnRenderFlag?: boolean;
}

interface RouteGuardReturn {
  user: ReturnType<typeof useAuth>["user"];
  Reloading: boolean;
  mustChangePassword: boolean;
  shouldRender: boolean;
}

/**
 * Unified route guard for password change enforcement and page rendering control
 *
 * Usage in Layouts:
 * ```tsx
 * useRouteGuard(); // Just redirects, no render control needed
 * ```
 *
 * Usage in Dashboard Pages:
 * ```tsx
 * const { shouldRender, loading } = useRouteGuard({ returnRenderFlag: true });
 * if (loading || !shouldRender) return <LoadingSpinner />;
 * ```
 */
export function useRouteGuard(options: RouteGuardOptions = {}): RouteGuardReturn {
  const { returnRenderFlag = false } = options;
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !user) return;

    // ✅ If password must be changed
    if (user.mustChangePassword) {
      const portalRoute = getPortalRoute(user);
      const settingsPath = `${portalRoute}/settings`;

      // ✅ Only allow settings page; always carry the flag so the banner shows
      if (!pathname.startsWith(settingsPath)) {
        router.replace(`${settingsPath}?mustChange=true`);
      }
    }
  }, [user, loading, pathname, router]);

  // ✅ Determine if page should render
  const shouldRender = returnRenderFlag
    ? !loading && (!user?.mustChangePassword || pathname.includes("/settings"))
    : true;

  return {
    user,
    Reloading: loading,
    mustChangePassword: user?.mustChangePassword || false,
    shouldRender,
  };
}
