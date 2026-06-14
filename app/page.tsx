"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

export default function HomePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    if (user.isSuperAdmin) {
      router.push("/admin");
    } else {
      const dept = user.department?.toLowerCase();

      switch (dept) {
        case "it":
          router.push("/it");
          break;
        case "operations":
          router.push("/operations");
          break;
        case "finance":
          router.push("/finance");
          break;
        case "investors":
          router.push("/investor");
          break;
        default:
          router.push("/login");
      }
    }
  }, [mounted, user, isAuthenticated, loading, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8F5E9]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#1a3f1c] mt-3 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}
