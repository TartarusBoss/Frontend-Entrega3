"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/auth-context";

export function GuestOnly({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/");
  }, [ready, user, router]);

  if (!ready || user) return <p className="py-16 text-center text-slate-600">Cargando…</p>;
  return children;
}
