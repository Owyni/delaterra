"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  LockKey,
  WarningCircle,
} from "@phosphor-icons/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const urlError = searchParams.get("error");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError
      ? "El enlace de recuperación es inválido o expiró. Solicita uno nuevo."
      : !token
        ? "Falta el token de recuperación en el enlace."
        : null,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await resetPassword({
        newPassword,
        token,
      });

      if (error) {
        setErrorMessage(
          error.message || "No fue posible restablecer la contraseña.",
        );
        return;
      }

      setDone(true);
    } catch {
      setErrorMessage("Error de conexión al restablecer la contraseña.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[#dce3d3] bg-white p-7 shadow-[0_24px_60px_-30px_rgba(24,59,43,0.28)] sm:p-9">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dce6d2]/80 px-3 py-1 text-xs font-semibold text-[#244d36]">
        Nueva contraseña
      </span>
      <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight text-[#183b2b]">
        Define tu nueva contraseña
      </h1>

      {errorMessage && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-2xl border border-[#e6c4bf] bg-[#fdf2f0] p-3.5 text-xs text-[#8f2d21]"
        >
          <WarningCircle className="mt-0.5 size-4 shrink-0" weight="fill" />
          <span>{errorMessage}</span>
        </div>
      )}

      {done ? (
        <div className="mt-5 space-y-4 rounded-2xl border border-[#c8dac0] bg-[#f1f6ee] p-5 text-center">
          <CheckCircle
            className="mx-auto size-8 text-[#244d36]"
            weight="duotone"
          />
          <p className="text-sm font-semibold text-[#183b2b]">
            Contraseña actualizada correctamente
          </p>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full rounded-2xl",
            )}
          >
            Iniciar sesión con mi nueva contraseña
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="reset-pass"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#3e5240]"
            >
              <LockKey className="size-3.5 text-[#71864f]" />
              Nueva contraseña
            </label>
            <Input
              id="reset-pass"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label
              htmlFor="reset-pass-confirm"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#3e5240]"
            >
              <LockKey className="size-3.5 text-[#71864f]" />
              Confirmar contraseña
            </label>
            <Input
              id="reset-pass-confirm"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={submitting || !token}
            className="w-full rounded-2xl"
          >
            {submitting ? "Guardando..." : "Guardar nueva contraseña"}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-14 sm:px-6">
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-[2rem] border border-[#dce3d3] bg-white p-8 text-center text-sm text-[#647364]">
              Cargando formulario...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
