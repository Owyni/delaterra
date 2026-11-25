import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta de agricultor o negocio comprador en Delaterra.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-14 sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 size-80 rounded-full bg-[#dce6d2]/60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-10 size-72 rounded-full bg-[#dce6d2]/50 blur-3xl"
        />
        <div className="relative z-10 flex w-full justify-center">
          <Suspense
            fallback={
              <div className="w-full max-w-md rounded-[2rem] border border-[#dce3d3] bg-white p-9 text-center text-sm text-[#647364]">
                Cargando acceso...
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
