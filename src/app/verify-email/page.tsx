import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VerifyEmailView } from "@/components/auth/verify-email-view";

export const metadata: Metadata = {
  title: "Verificar correo",
  description: "Confirma tu correo electrónico para activar tu cuenta en Delaterra.",
};

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-14 sm:px-6">
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-[2rem] border border-[#dce3d3] bg-white p-8 text-center text-sm text-[#647364]">
              Cargando verificación...
            </div>
          }
        >
          <VerifyEmailView />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
