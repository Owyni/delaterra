"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle,
  EnvelopeSimple,
  LockKey,
  WarningCircle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendVerificationEmail, signIn } from "@/lib/auth-client";

function getSafeRedirectPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/dashboard";
  }
  return raw;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeRedirectPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setNeedsVerification(false);
    setResendSuccess(null);

    try {
      const { error } = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
        callbackURL: nextPath,
      });

      if (error) {
        const isUnverified =
          error.status === 403 ||
          error.code === "EMAIL_NOT_VERIFIED" ||
          error.message?.toLowerCase().includes("verify") ||
          error.message?.toLowerCase().includes("verific");

        if (isUnverified) {
          setNeedsVerification(true);
          setErrorMessage(
            "Tu correo electrónico aún no está verificado. Revisa tu bandeja o solicita un nuevo enlace.",
          );
          return;
        }

        setErrorMessage(
          error.message || "Correo electrónico o contraseña incorrectos.",
        );
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setErrorMessage("Error de conexión al intentar iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResendVerification() {
    if (!email.trim()) return;
    setResending(true);
    setResendSuccess(null);
    setErrorMessage(null);

    try {
      const { error } = await sendVerificationEmail({
        email: email.trim().toLowerCase(),
        callbackURL: "/verify-email?verified=1",
      });

      if (error) {
        setErrorMessage(
          error.message || "No se pudo reenviar el correo de verificación.",
        );
        return;
      }

      setResendSuccess(
        "Enviamos un nuevo correo de verificación. Revisa tu bandeja de entrada o carpeta de spam.",
      );
    } catch {
      setErrorMessage("Error al intentar reenviar el correo de verificación.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[#dce3d3] bg-white p-7 shadow-[0_24px_60px_-30px_rgba(24,59,43,0.28)] sm:p-9">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dce6d2]/80 px-3 py-1 text-xs font-semibold text-[#244d36]">
          Acceso a tu cuenta
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b]">
          Inicia sesión en Delaterra
        </h1>
        <p className="mt-2 text-sm text-[#647364]">
          Ingresa tus credenciales para acceder a tu panel de agricultor o
          negocio comprador.
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-5 space-y-2.5 rounded-2xl border border-[#e6c4bf] bg-[#fdf2f0] p-3.5 text-xs leading-relaxed text-[#8f2d21]"
        >
          <div className="flex items-start gap-2">
            <WarningCircle className="mt-0.5 size-4 shrink-0" weight="fill" />
            <span>{errorMessage}</span>
          </div>
          {needsVerification && (
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                type="button"
                size="xs"
                variant="outline"
                disabled={resending}
                onClick={handleResendVerification}
                className="border-[#d7a8a1] bg-white text-[#8f2d21] hover:bg-[#fae5e2]"
              >
                {resending ? "Reenviando..." : "Reenviar correo de verificación"}
              </Button>
              <Link
                href={`/verify-email?email=${encodeURIComponent(email.trim())}`}
                className="self-center font-semibold underline"
              >
                Ir a página de verificación
              </Link>
            </div>
          )}
        </div>
      )}

      {resendSuccess && (
        <div className="mb-5 flex items-start gap-2 rounded-2xl border border-[#c8dac0] bg-[#f1f6ee] p-3.5 text-xs leading-relaxed text-[#244d36]">
          <CheckCircle className="mt-0.5 size-4 shrink-0" weight="fill" />
          <span>{resendSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#3e5240]"
          >
            <EnvelopeSimple className="size-3.5 text-[#71864f]" />
            Correo electrónico
          </label>
          <Input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@huerta-michoacan.mx"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#3e5240]"
            >
              <LockKey className="size-3.5 text-[#71864f]" />
              Contraseña
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#244d36] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="mt-2 w-full rounded-2xl"
        >
          {submitting ? "Verificando acceso..." : "Iniciar sesión"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <p className="mt-6 border-t border-[#eef1e7] pt-5 text-center text-sm text-[#647364]">
        ¿Aún no tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#244d36] hover:underline"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
