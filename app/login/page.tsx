"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getPortalRoute } from "@/lib/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.push(getPortalRoute(user));
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login({ email, password, rememberMe });
      toast.success("Login successful!");
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() ?? "";
      const friendly =
        msg.includes("invalid") || msg.includes("incorrect")
          ? "Invalid email or password."
          : msg.includes("deactivated")
            ? "Account deactivated. Contact IT support."
            : msg.includes("suspended")
              ? "Account suspended. Contact support."
              : err?.message || "Login failed. Please try again.";
      setError(friendly);
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="login-loading-bg min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a3f1c]" />
      </div>
    );
  }
  if (user) return null;

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="login-brand-panel hidden lg:flex lg:w-[52%] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="login-blob-gold absolute -top-32 -left-32 w-96 h-96 rounded-full" />
        <div className="login-blob-green absolute -bottom-20 -right-20 w-72 h-72 rounded-full" />
        <div className="login-blob-white absolute top-1/2 right-12 w-40 h-40 rounded-full" />

        <div className="relative z-10 text-center space-y-8 max-w-sm">
          {/* Logo */}
          <Image
            src="/images/mamput.png"
            alt="Ounje Logo"
            width={112}
            height={112}
            className="mx-auto"
            priority
          />

          <div>
            <h1 className="text-5xl font-black text-white tracking-tight">Ounjefood</h1>
            <p className="text-white/60 mt-3 text-base leading-relaxed">
              Internal operations platform for managing orders, vendors, riders and more.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {[
              "Real-time order monitoring",
              "Vendor & rider management",
              "Finance & revenue insights",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-left">
                <div className="login-check-circle w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path
                      d="M1 4.5L4 7.5L10 1.5"
                      stroke="#1a3f1c"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-white/80 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center gap-3">
            <Image src="/images/mamput.png" alt="Ounje Logo" width={64} height={64} priority />
            <h1 className="text-2xl font-black text-[#1a3f1c]">Ounjefood</h1>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-base">Sign in to your staff account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-gray-800">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                disabled={submitting}
                required
                placeholder="you@ounjefood.com"
                className="h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold text-gray-800">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={submitting}
                  required
                  placeholder="••••••••"
                  className="h-12 bg-gray-50 border-gray-200 text-gray-900 focus:bg-white text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(v === true)}
                disabled={submitting}
              />
              <Label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer font-normal select-none"
              >
                Keep me signed in for 30 days
              </Label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="login-submit-btn w-full h-12 rounded-xl text-white font-bold text-base transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Having trouble? <span className="font-semibold text-[#1a3f1c]">Contact IT support</span>
          </p>
        </div>
      </div>
    </div>
  );
}
