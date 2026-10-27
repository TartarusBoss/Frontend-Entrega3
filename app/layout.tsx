import type { Metadata } from "next";
import Link from "next/link";
import { AuthProvider } from "@/features/auth/hooks/auth-context";
import { AuthLinks } from "@/features/auth/components/auth-links";
import "./globals.css";

export const metadata: Metadata = {
  title: "SportZone | Tienda deportiva",
  description: "Artículos deportivos para fútbol, básquetbol y MMA.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
              <Link className="text-2xl font-black tracking-tight text-brand-800" href="/">SportZone</Link>
              <nav className="flex items-center gap-5 text-sm font-semibold text-slate-700" aria-label="Navegación principal">
                <Link className="hover:text-brand-600" href="/#inicio">Inicio</Link>
                <Link className="hover:text-brand-600" href="/#catalogo">Catálogo</Link>
                <Link className="hover:text-brand-600" href="/#contacto">Contacto</Link>
              </nav>
              <AuthLinks />
            </div>
          </header>
          <main className="min-h-[70vh]">{children}</main>
          <footer className="bg-brand-900 px-5 py-6 text-center text-sm text-white">
            © 2026 SportZone. Todos los derechos reservados.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
