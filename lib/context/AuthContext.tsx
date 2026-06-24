"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/lib/api/services/auth.service";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import type { User, LoginCredentials, LoginResponse } from "@/types";

// ─── types ────────────────────────────────────────────────────────────────────
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── pure helper: which portal does this user belong to? ─────────────────────
export function getPortalRoute(user: User): string {
  if (user.isSuperAdmin) return "/admin";

  const dept = user.department?.toLowerCase();
  if (dept === "it") return "/it";
  if (dept === "operations") return "/operations";
  if (dept === "finance") return "/finance";
  if (dept === "investors") return "/investor";

  return "/";
}

// ─── provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  usePushNotifications(!!user);

  // Single effect: runs once on mount.
  // If a token cookie exists, fetch the user to hydrate context.
  // Otherwise just stop the loading state so the login page renders.
  useEffect(() => {
    if (!authService.hasToken()) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((userData) => setUser(userData))
      .catch(() => authService.clearToken())
      .finally(() => setLoading(false));
  }, []);

  // ── login ───────────────────────────────────────────────────────────────────
  const login = async (credentials: LoginCredentials) => {
    const response: LoginResponse = await authService.login(credentials);

    if (!response.success || !response.data?.token || !response.data?.user) {
      throw new Error(response.message || "Invalid login response");
    }

    const { token, user: userData } = response.data;

    // persist token into cookie (the only write in the entire app)
    authService.saveToken(token, credentials.rememberMe);

    // hydrate context so every consumer re-renders
    setUser(userData);

    // route: password-change gate first, then the correct portal
    if (userData.mustChangePassword) {
      window.location.href = `${getPortalRoute(userData)}/settings?mustChange=true`;
    } else {
      window.location.href = getPortalRoute(userData);
    }
  };

  // ── logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await authService.logout(); // hits backend + clears cookie
    } catch {
      authService.clearToken(); // even if the network call fails
    }
    setUser(null);
    window.location.href = "/";
  };

  // ── refreshUser ─────────────────────────────────────────────────────────────
  const refreshUser = async () => {
    if (!authService.hasToken()) {
      setUser(null);
      return;
    }

    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      authService.clearToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
