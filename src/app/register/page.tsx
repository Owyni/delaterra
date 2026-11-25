import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Registrarse",
  description:
    "Crea tu cuenta real de agricultor o negocio comprador en Delaterra.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-14 sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-8 size-80 rounded-full bg-[#dce6d2]/60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-8 size-80 rounded-full bg-[#dce6d2]/50 blur-3xl"
        />
        <div className="relative z-10 flex w-full justify-center">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
