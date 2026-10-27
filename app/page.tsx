import { Catalog } from "@/features/catalog/components/catalog";
import { RequestForm } from "@/features/requests/components/request-form";

export default function HomePage() {
  return (
    <>
      <section id="inicio" className="bg-brand-800 px-5 py-24 text-center text-white sm:py-32">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-sky-200">SportZone</p>
        <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
          Equípate para la victoria
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
          Los mejores artículos deportivos para fútbol, básquetbol y MMA.
        </p>
        <a
          className="mt-8 inline-flex rounded-lg bg-white px-6 py-3 font-bold text-brand-800 transition hover:bg-sky-100"
          href="#catalogo"
        >
          Explorar catálogo
        </a>
      </section>
      <Catalog />
      <section id="contacto" className="bg-slate-100 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-brand-600">Estamos para ayudarte</p>
            <h2 className="text-3xl font-black text-brand-800">Contáctanos o haz tu pedido</h2>
            <p className="mt-3 text-slate-600">Envíanos tu consulta o pedido; necesitas una cuenta para registrarlo.</p>
          </div>
          <RequestForm />
        </div>
      </section>
    </>
  );
}
