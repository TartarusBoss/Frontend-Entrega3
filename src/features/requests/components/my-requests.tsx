"use client";

import { useProtectedRoute } from "@/features/auth/hooks/use-protected-route";
import { useMyRequests } from "../hooks/use-my-requests";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export function MyRequests() {
  const { ready, allowed } = useProtectedRoute();
  const { requests, error, loading } = useMyRequests(allowed);

  if (!ready || !allowed) return <p className="py-16 text-center text-slate-600">Verificando sesión…</p>;
  if (loading) return <p className="py-16 text-center text-slate-600">Cargando tus solicitudes…</p>;
  if (error) return <p className="mx-auto max-w-3xl py-16 text-center text-red-700" role="alert">{error}</p>;
  if (requests.length === 0) return <p className="py-16 text-center text-slate-600">Todavía no tienes solicitudes.</p>;

  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="mb-8 text-3xl font-black text-brand-800">Mis solicitudes</h1>
      <div className="grid gap-4">
        {requests.map((request) => (
          <article key={request.id} className="rounded-xl bg-white p-5 shadow">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{request.product.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{request.message}</p>
              </div>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-bold text-brand-800">{request.status}</span>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              {currency.format(request.product.price)} · {new Date(request.createdAt).toLocaleDateString("es-CO")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
