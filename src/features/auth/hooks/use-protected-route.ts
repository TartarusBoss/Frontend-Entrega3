"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";
import type { UserRole } from "../domain/auth";

export function useProtectedRoute(role?: UserRole, requireSession = true) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user && requireSession) {
      router.replace("/login");
    } else if (user && role && user.role !== role) {
      router.replace("/");
    }
  }, [ready, user, role, requireSession, router]);

  return { user, ready, allowed: ready && Boolean(user) && (!role || user?.role === role) };
}
