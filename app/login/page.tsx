import { GuestOnly } from "@/features/auth/components/guest-only";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <GuestOnly>
      <section className="mx-auto max-w-lg px-5 py-16">
        <div className="rounded-2xl bg-white p-7 shadow-lg sm:p-9">
          <h1 className="mb-2 text-center text-3xl font-black text-brand-800">Bienvenido de nuevo</h1>
          <p className="mb-7 text-center text-slate-600">Ingresa a tu cuenta SportZone.</p>
          <LoginForm />
        </div>
      </section>
    </GuestOnly>
  );
}
