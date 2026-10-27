"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { AuthResponse, User } from "../domain/auth";

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  saveSession: (session: AuthResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

let snapshot = { user: null as User | null, ready: false };
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function updateSnapshot(user: User | null, ready: boolean) {
  if (snapshot.user === user && snapshot.ready === ready) return;
  snapshot = { user, ready };
  listeners.forEach((listener) => listener());
}

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, ready } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    const storedToken = localStorage.getItem("sportzone-token");
    const storedUser = localStorage.getItem("sportzone-user");
    if (storedToken && storedUser) {
      try {
        const parsed: unknown = JSON.parse(storedUser);
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          "id" in parsed &&
          typeof parsed.id === "number" &&
          "name" in parsed &&
          typeof parsed.name === "string" &&
          "email" in parsed &&
          typeof parsed.email === "string" &&
          "role" in parsed &&
          (parsed.role === "admin" || parsed.role === "user")
        ) {
          updateSnapshot(parsed as User, true);
        } else {
          throw new Error("Datos de sesión no válidos.");
        }
      } catch {
        localStorage.removeItem("sportzone-token");
        localStorage.removeItem("sportzone-user");
        updateSnapshot(null, true);
      }
    } else {
      localStorage.removeItem("sportzone-token");
      localStorage.removeItem("sportzone-user");
      updateSnapshot(null, true);
    }
  }, []);

  function saveSession(session: AuthResponse) {
    localStorage.setItem("sportzone-token", session.token);
    localStorage.setItem("sportzone-user", JSON.stringify(session.user));
    updateSnapshot(session.user, true);
  }

  function logout() {
    localStorage.removeItem("sportzone-token");
    localStorage.removeItem("sportzone-user");
    updateSnapshot(null, true);
  }

  const value = { user, ready, saveSession, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }
  return context;
}
