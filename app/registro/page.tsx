import { GuestOnly } from "@/features/auth/components/guest-only";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <GuestOnly>
      <section className="mx-auto max-w-lg px-5 py-16">
        <div className="rounded-2xl bg-white p-7 shadow-lg sm:p-9">
          <h1 className="mb-2 text-center text-3xl font-black text-brand-800">Crear una cuenta</h1>
          <p className="mb-7 text-center text-slate-600">Regístrate para realizar y consultar pedidos.</p>
          <RegisterForm />
        </div>
      </section>
    </GuestOnly>
  );
}
