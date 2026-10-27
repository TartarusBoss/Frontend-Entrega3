"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/features/common/components/button";
import { Input } from "@/features/common/components/input";
import { HttpError } from "@/features/common/http";
import { useAuth } from "../hooks/auth-context";
import { register } from "../services/auth-service";

export function RegisterForm() {
  const router = useRouter();
  const { saveSession } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setEmailError("");
    setSubmitting(true);
    try {
      const session = await register({ name, email, password });
      saveSession(session);
      router.replace("/");
    } catch (cause) {
      if (cause instanceof HttpError && cause.status === 409) {
        setEmailError(cause.message);
      } else {
        setError(cause instanceof Error ? cause.message : "No se pudo crear la cuenta.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <Input label="Nombre completo" name="name" autoComplete="name" minLength={2} maxLength={80} required value={name} onChange={(event) => setName(event.target.value)} />
      <Input label="Correo electrónico" name="email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={(event) => setEmail(event.target.value)} error={emailError} />
      <Input label="Contraseña (mínimo 8 caracteres)" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required value={password} onChange={(event) => setPassword(event.target.value)} />
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <Button type="submit" disabled={submitting}>{submitting ? "Creando cuenta…" : "Crear cuenta"}</Button>
      <p className="text-center text-sm text-slate-600">
        ¿Ya tienes cuenta? <Link className="font-bold text-brand-800 underline" href="/login">Ingresar</Link>
      </p>
    </form>
  );
}
