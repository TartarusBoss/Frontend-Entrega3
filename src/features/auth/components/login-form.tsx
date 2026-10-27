"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/features/common/components/button";
import { Input } from "@/features/common/components/input";
import { HttpError } from "@/features/common/http";
import { useAuth } from "../hooks/auth-context";
import { login } from "../services/auth-service";

export function LoginForm() {
  const router = useRouter();
  const { saveSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const session = await login({ email, password });
      saveSession(session);
      router.replace("/");
    } catch (cause) {
      setError(cause instanceof HttpError ? cause.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <Input label="Correo electrónico" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
      <Input label="Contraseña" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <Button type="submit" disabled={submitting}>{submitting ? "Ingresando…" : "Ingresar"}</Button>
      <p className="text-center text-sm text-slate-600">
        ¿Aún no tienes cuenta? <Link className="font-bold text-brand-800 underline" href="/registro">Regístrate</Link>
      </p>
    </form>
  );
}
