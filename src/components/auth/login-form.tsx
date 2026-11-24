"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  EnvelopeSimple,
  Info,
  LockKey,
} from "@phosphor-icons/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDemoSubmitted(true);
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[#dce3d3] bg-white p-7 shadow-[0_24px_60px_-30px_rgba(24,59,43,0.28)] sm:p-9">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dce6d2]/80 px-3 py-1 text-xs font-semibold text-[#244d36]">
          Acceso de demostración
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b]">
          Inicia sesión en Delaterra
        </h1>
        <p className="mt-2 text-sm text-[#647364]">
          Ingresa tus credenciales para acceder a tu perfil de agricultor o
          negocio comprador.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-[#dce4d2] bg-[#f6f5ed] p-3.5 text-xs leading-relaxed text-[#526452]">
        <Info className="mt-0.5 size-4 shrink-0 text-[#71864f]" weight="duotone" />
        <span>
          Interfaz visual sin autenticación real. El envío no valida ni consulta
          la base de datos en esta etapa.
        </span>
      </div>

      {demoSubmitted ? (
        <div className="space-y-5 rounded-2xl border border-[#c8dac0] bg-[#f1f6ee] p-5 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-[#244d36] shadow-xs">
            <CheckCircle className="size-7" weight="duotone" />
          </span>
          <div>
            <p className="text-base font-semibold text-[#183b2b]">
              Vista previa de acceso completada
            </p>
            <p className="mt-1 text-xs text-[#5d6d5d]">
              Puedes explorar el panel administrativo demostrativo o volver al
              marketplace.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full rounded-2xl",
              )}
            >
              Ir al panel demo
              <ArrowRight className="size-4" />
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setDemoSubmitted(false)}
            >
              Volver al formulario
            </Button>
          </div>
        </div>
      ) : (
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
              <span className="text-xs text-[#7b8677]">Solo demostración</span>
            </div>
            <Input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full rounded-2xl">
            Iniciar sesión
            <ArrowRight className="size-4" />
          </Button>
        </form>
      )}

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
