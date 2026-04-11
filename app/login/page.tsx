"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getPortalRoute } from "@/lib/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ✅ ALL HOOKS MUST BE AT THE TOP - NO EARLY RETURNS BEFORE THEM
  
  // Redirect logged in user
  useEffect(() => {
    if (!loading && user) {
      router.push(getPortalRoute(user));
    }
  }, [user, loading, router]);

  // ✅ AFTER all early returns, add remaining logic

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(""); // ✅ Clear error on new submit

    try {
      await login({ email, password, rememberMe });
      toast.success("Login successful!");
    } catch (err: any) {
      let message = "Login failed. Please try again.";
      
      if (err?.message) {
        const msg = err.message.toLowerCase();
        if (msg.includes("invalid") || msg.includes("incorrect")) {
          message = "Invalid email or password";
        } else if (msg.includes("deactivated")) {
          message = "Account deactivated. Contact IT support.";
        } else if (msg.includes("suspended")) {
          message = "Account suspended. Contact support.";
        } else {
          message = err.message;
        }
      }

      setError(message);
      toast.error(message);
      setPassword(""); // Clear password field
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Clear error when user types (using change handlers instead of useEffect)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(""); // Clear error when typing
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(""); // Clear error when typing
  };

  // ✅ NOW it's safe to have conditional renders
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#e8f7e8" }}
      >
        <div className="w-12 h-12 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Don't render login if user is already logged in
  if (user) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#e8f7e8" }}
    >
      <Card className="w-full max-w-sm border-none shadow-none bg-transparent">
        <CardContent className="pt-8 pb-6 px-6 space-y-6">
          
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="w-24 h-24 relative rounded-full overflow-hidden">
              <Image
                src="/images/mamput.png"
                alt="Ounje Logo"
                fill
                sizes="96px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-xl font-bold text-gray-900">
            Welcome Back
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={isSubmitting}
                required
                className="h-10 bg-white border border-gray-300"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                disabled={isSubmitting}
                required
                className="h-10 bg-white border border-gray-300"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setRememberMe(checked === true)
                }
                disabled={isSubmitting}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal text-gray-700 cursor-pointer"
              >
                Keep me logged in
              </Label>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-700 p-3 text-sm rounded-md">
                {error}
              </div>
            )}

            {/* Button */}
            <Button
              type="submit"
              className="w-full h-10 bg-[#1a3f1c] text-white hover:bg-[#164016]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
