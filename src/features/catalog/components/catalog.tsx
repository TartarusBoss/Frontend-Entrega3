"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/features/common/components/button";
import { useProducts } from "../hooks/use-products";
import type { Product } from "../domain/product";

const categories = [
  { value: "todos", label: "Todos" },
  { value: "futbol", label: "Fútbol" },
  { value: "basket", label: "Básquet" },
  { value: "mma", label: "MMA" },
] as const;

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [category, setCategory] = useState<(typeof categories)[number]["value"]>("todos");
  const { result, error, loading } = useProducts(page);
  const products = (result?.data ?? []).filter((product) => category === "todos" || product.category === category);

  function changePage(nextPage: number) {
    router.push(`/?page=${nextPage}#catalogo`);
  }

  return (
    <section id="catalogo" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-600">SportZone</p>
        <h2 className="text-3xl font-black text-brand-800 sm:text-4xl">Nuestro catálogo</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Encuentra tu próximo equipo para fútbol, básquet y MMA.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2" aria-label="Filtrar por categoría">
        {categories.map((item) => (
          <Button
            key={item.value}
            variant={category === item.value ? "primary" : "secondary"}
            aria-pressed={category === item.value}
            onClick={() => setCategory(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {loading && <p className="py-12 text-center text-slate-600" role="status">Cargando productos…</p>}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-800" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <p className="rounded-xl bg-white p-8 text-center text-slate-600">No hay productos para mostrar.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}

      {result && result.pagination.totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Paginación del catálogo">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-slate-600">
            Página {result.pagination.page} de {result.pagination.totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= result.pagination.totalPages}
            onClick={() => changePage(page + 1)}
          >
            Siguiente
          </Button>
        </nav>
      )}
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const label = categories.find((item) => item.value === product.category)?.label ?? product.category;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <Image
        className="h-52 w-full object-cover"
        src={product.image}
        alt={product.name}
        width={640}
        height={420}
        unoptimized
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="w-fit rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase text-brand-800">
          {label}
        </span>
        <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
        <p className="flex-1 text-sm leading-6 text-slate-600">{product.description}</p>
        <p className="text-xl font-extrabold text-brand-800">{currency.format(product.price)}</p>
      </div>
    </article>
  );
}

export function Catalog() {
  return (
    <Suspense fallback={<p className="py-12 text-center text-slate-600">Cargando catálogo…</p>}>
      <CatalogContent />
    </Suspense>
  );
}
