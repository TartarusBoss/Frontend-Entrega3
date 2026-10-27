"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/auth-context";

export function AuthLinks() {
  const { user, ready, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/");
  }

  return (
    <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold" aria-label="Cuenta">
      {user ? (
        <>
          <Link className="hover:text-brand-600" href="/mis-solicitudes">Mis solicitudes</Link>
          {user.role === "admin" && <Link className="hover:text-brand-600" href="/admin">Administración</Link>}
          <span className="hidden text-slate-600 sm:inline">{user.name}</span>
          <button className="text-brand-800 underline" onClick={handleLogout}>Salir</button>
        </>
      ) : ready ? (
        <Link className="rounded-lg bg-brand-800 px-4 py-2 text-white hover:bg-brand-600" href="/login">Ingresar</Link>
      ) : null}
    </nav>
  );
}
