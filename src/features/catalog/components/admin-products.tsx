"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useProtectedRoute } from "@/features/auth/hooks/use-protected-route";
import { Button } from "@/features/common/components/button";
import { Input } from "@/features/common/components/input";
import type { Product } from "../domain/product";
import { getProducts } from "../services/product-service";
import { createProduct, deleteProduct, updateProduct, type ProductInput } from "../services/admin-product-service";

const emptyProduct: ProductInput = {
  name: "",
  category: "futbol",
  price: 1,
  description: "",
  image: "",
};

export function AdminProducts() {
  const { ready, allowed } = useProtectedRoute("admin");
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    try {
      const result = await getProducts(1, 100);
      setProducts(result.data);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cargar el catálogo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!allowed) return;
    let active = true;
    getProducts(1, 100)
      .then((result) => {
        if (active) setProducts(result.data);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "No se pudo cargar el catálogo.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [allowed]);

  function startEditing(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image: product.image,
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyProduct);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId === null) {
        await createProduct(form);
      } else {
        await updateProduct(editingId, form);
      }
      cancelEditing();
      await loadProducts();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`¿Seguro que quieres eliminar “${product.name}”?`)) return;
    setError("");
    try {
      await deleteProduct(product.id);
      await loadProducts();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo eliminar el producto.");
    }
  }

  if (!ready || !allowed) return <p className="py-16 text-center text-slate-600">Verificando permisos…</p>;

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div>
        <h1 className="mb-2 text-3xl font-black text-brand-800">Administrar catálogo</h1>
        <p className="mb-6 text-slate-600">Crea, edita y elimina productos de SportZone.</p>
        <form className="grid gap-4 rounded-2xl bg-white p-6 shadow" onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold">{editingId === null ? "Nuevo producto" : "Editar producto"}</h2>
          <Input label="Nombre" name="name" minLength={2} maxLength={120} required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <label className="grid gap-1.5 font-semibold text-slate-800" htmlFor="category">
            Categoría
            <select id="category" className="rounded-lg border border-slate-300 px-3 py-2.5" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ProductInput["category"] })}>
              <option value="futbol">Fútbol</option>
              <option value="basket">Básquet</option>
              <option value="mma">MMA</option>
            </select>
          </label>
          <Input label="Precio en pesos colombianos" name="price" type="number" min={1} step={1} required value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} />
          <label className="grid gap-1.5 font-semibold text-slate-800" htmlFor="description">
            Descripción
            <textarea id="description" className="rounded-lg border border-slate-300 px-3 py-2.5" minLength={5} maxLength={1000} rows={3} required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <Input label="URL de imagen" name="image" type="url" maxLength={2048} required value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving}>{saving ? "Guardando…" : editingId === null ? "Crear producto" : "Guardar cambios"}</Button>
            {editingId !== null && <Button type="button" variant="secondary" onClick={cancelEditing}>Cancelar</Button>}
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-5 text-2xl font-bold text-slate-900">Productos ({products.length})</h2>
        {loading && <p className="text-slate-600">Cargando productos…</p>}
        {!loading && products.length === 0 && <p className="text-slate-600">Todavía no hay productos.</p>}
        <div className="grid gap-3">
          {products.map((product) => (
            <article key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div>
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-sm text-slate-600">{product.category} · ${product.price.toLocaleString("es-CO")}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => startEditing(product)}>Editar</Button>
                <Button variant="danger" onClick={() => void handleDelete(product)}>Eliminar</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
