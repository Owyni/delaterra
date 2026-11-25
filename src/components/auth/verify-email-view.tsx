"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle,
  EnvelopeSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendVerificationEmail } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "1";
  const urlError = searchParams.get("error");
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError
      ? "El enlace de verificación es inválido o expiró. Solicita uno nuevo."
      : null,
  );

  async function handleResend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      const { error } = await sendVerificationEmail({
        email: email.trim().toLowerCase(),
        callbackURL: "/verify-email?verified=1",
      });

      if (error) {
        setErrorMessage(
          error.message || "No fue posible reenviar el enlace de verificación.",
        );
        return;
      }

      setMessage(
        "Si el correo está registrado y pendiente de confirmación, recibirás un nuevo enlace en tu bandeja.",
      );
    } catch {
      setErrorMessage("Error de red al solicitar un nuevo enlace.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isVerified) {
    return (
      <div className="w-full max-w-md rounded-[2rem] border border-[#dce3d3] bg-white p-8 text-center shadow-[0_24px_60px_-30px_rgba(24,59,43,0.28)]">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#ebf4e8] text-[#244d36]">
          <CheckCircle className="size-8" weight="duotone" />
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#183b2b]">
          ¡Correo verificado correctamente!
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#647364]">
          Tu cuenta ya está habilitada. Ahora puedes acceder a tu panel para
          publicar productos o generar pedidos.
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full rounded-2xl",
            )}
          >
            Ir a mi panel
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full rounded-2xl",
            )}
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[#dce3d3] bg-white p-7 shadow-[0_24px_60px_-30px_rgba(24,59,43,0.28)] sm:p-9">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dce6d2]/80 px-3 py-1 text-xs font-semibold text-[#244d36]">
        Verificación de correo
      </span>
      <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight text-[#183b2b]">
        Confirma tu dirección de correo
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[#647364]">
        Abre el enlace que enviamos a tu correo electrónico para activar tu
        cuenta. Si no lo encuentras o expiró, puedes solicitar uno nuevo aquí.
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

      {message && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#c8dac0] bg-[#f1f6ee] p-3.5 text-xs text-[#244d36]">
          <CheckCircle className="mt-0.5 size-4 shrink-0" weight="fill" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleResend} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="verify-email-input"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#3e5240]"
          >
            <EnvelopeSimple className="size-3.5 text-[#71864f]" />
            Correo electrónico
          </label>
          <Input
            id="verify-email-input"
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
          {submitting ? "Enviando enlace..." : "Reenviar correo de verificación"}
        </Button>
      </form>

      <p className="mt-6 border-t border-[#eef1e7] pt-5 text-center text-sm text-[#647364]">
        <Link
          href="/login"
          className="font-semibold text-[#244d36] hover:underline"
        >
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
