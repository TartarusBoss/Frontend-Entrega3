"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";
import type { UserRole } from "../domain/auth";

export function useProtectedRoute(role?: UserRole) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
    } else if (role && user.role !== role) {
      router.replace("/");
    }
  }, [ready, user, role, router]);

  return { user, ready, allowed: ready && Boolean(user) && (!role || user?.role === role) };
}
