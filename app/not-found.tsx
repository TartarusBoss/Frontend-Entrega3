import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">Error 404</p>
      <h1 className="mt-3 text-4xl font-black text-brand-800">No encontramos esa página</h1>
      <p className="mt-4 text-slate-600">El enlace puede estar vencido o la página ya no existe.</p>
      <Link className="mt-8 inline-flex rounded-lg bg-brand-800 px-5 py-3 font-bold text-white" href="/">Volver al inicio</Link>
    </section>
  );
}
