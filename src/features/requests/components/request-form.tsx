"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/features/common/components/button";
import { useProtectedRoute } from "@/features/auth/hooks/use-protected-route";
import { getProducts } from "@/features/catalog/services/product-service";
import type { Product } from "@/features/catalog/domain/product";
import { createRequest } from "../services/request-service";

export function RequestForm() {
  const { user, ready } = useProtectedRoute(undefined, false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!ready || !user) return;
    getProducts(1, 100)
      .then((result) => setProducts(result.data))
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "No se pudo cargar el catálogo."));
  }, [ready, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await createRequest({ productId: Number(productId), message });
      setMessage("");
      setSuccess("Tu solicitud quedó registrada. Puedes consultarla en “Mis solicitudes”.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo enviar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) return <p className="text-center text-slate-600">Cargando sesión…</p>;
  if (!user) {
    return (
      <p className="text-center text-slate-600">
        <a className="font-bold text-brand-800 underline" href="/login">Inicia sesión</a> para enviar una solicitud.
      </p>
    );
  }

  return (
    <form className="mx-auto grid max-w-2xl gap-5 rounded-2xl bg-white p-6 shadow-lg sm:p-8" onSubmit={handleSubmit}>
      <label className="grid gap-1.5 font-semibold text-slate-800" htmlFor="request-product">
        Producto de interés
        <select
          id="request-product"
          className="rounded-lg border border-slate-300 px-3 py-2.5"
          required
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
        >
          <option value="">Selecciona un producto</option>
          {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
        </select>
      </label>
      <label className="grid gap-1.5 font-semibold text-slate-800" htmlFor="request-message">
        Mensaje o pedido
        <textarea
          id="request-message"
          className="rounded-lg border border-slate-300 px-3 py-2.5"
          rows={4}
          minLength={10}
          maxLength={2000}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Cuéntanos qué necesitas (mínimo 10 caracteres)"
        />
      </label>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      {success && <p className="text-sm font-semibold text-green-700" role="status">{success}</p>}
      <Button type="submit" disabled={submitting}>{submitting ? "Enviando…" : "Enviar solicitud"}</Button>
    </form>
  );
}
