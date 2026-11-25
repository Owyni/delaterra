"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  EnvelopeSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await requestPasswordReset({
        email: email.trim().toLowerCase(),
        redirectTo: "/reset-password",
      });

      if (error) {
        setErrorMessage(
          error.message || "No se pudo procesar la solicitud de recuperación.",
        );
        return;
      }

      setSent(true);
    } catch {
      setErrorMessage("Error de conexión al solicitar el restablecimiento.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-14 sm:px-6">
        <div className="w-full max-w-md rounded-[2rem] border border-[#dce3d3] bg-white p-7 shadow-[0_24px_60px_-30px_rgba(24,59,43,0.28)] sm:p-9">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dce6d2]/80 px-3 py-1 text-xs font-semibold text-[#244d36]">
            Recuperación de contraseña
          </span>
          <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight text-[#183b2b]">
            Restablece tu acceso
          </h1>
          <p className="mt-2 text-sm text-[#647364]">
            Ingresa el correo electrónico de tu cuenta y te enviaremos un enlace
            para definir una nueva contraseña.
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-2xl border border-[#e6c4bf] bg-[#fdf2f0] p-3.5 text-xs text-[#8f2d21]"
            >
              <WarningCircle className="mt-0.5 size-4 shrink-0" weight="fill" />
              <span>{errorMessage}</span>
            </div>
          )}

          {sent ? (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-[#c8dac0] bg-[#f1f6ee] p-4 text-xs leading-relaxed text-[#244d36]">
              <CheckCircle className="mt-0.5 size-5 shrink-0" weight="duotone" />
              <span>
                Si existe una cuenta verificada con ese correo, recibirás un
                enlace para restablecer tu contraseña en unos instantes.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#3e5240]"
                >
                  <EnvelopeSimple className="size-3.5 text-[#71864f]" />
                  Correo electrónico
                </label>
                <Input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.mx"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full rounded-2xl"
              >
                {submitting ? "Enviando enlace..." : "Enviar enlace de recuperación"}
              </Button>
            </form>
          )}

          <p className="mt-6 border-t border-[#eef1e7] pt-5 text-center text-sm text-[#647364]">
            <Link
              href="/login"
              className="font-semibold text-[#244d36] hover:underline"
            >
              Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
