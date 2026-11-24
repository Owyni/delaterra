"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Info,
  Plant,
  Storefront,
} from "@phosphor-icons/react";
import { MUNICIPALITIES } from "@/data/farmers";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AccountType = "farmer" | "business";

export function RegisterForm() {
  const [accountType, setAccountType] = useState<AccountType>("farmer");
  const [demoCreated, setDemoCreated] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDemoCreated(true);
  }

  return (
    <div className="w-full max-w-xl rounded-[2rem] border border-[#dce3d3] bg-white p-7 shadow-[0_24px_60px_-30px_rgba(24,59,43,0.28)] sm:p-9">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dce6d2]/80 px-3 py-1 text-xs font-semibold text-[#244d36]">
          Registro visual (Demo)
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b]">
          Únete a la red Delaterra
        </h1>
        <p className="mt-2 text-sm text-[#647364]">
          Elige tu tipo de cuenta para personalizar la vista previa de tu
          espacio dentro del marketplace.
        </p>
      </div>

      {/* Selector de tipo de cuenta */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setAccountType("farmer");
            setDemoCreated(false);
          }}
          className={cn(
            "flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer",
            accountType === "farmer"
              ? "border-[#244d36] bg-[#eef4ea] ring-2 ring-[#244d36]/20"
              : "border-[#dce3d3] bg-[#fbfbf7] hover:border-[#b9c7ac]",
          )}
        >
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              accountType === "farmer"
                ? "bg-[#244d36] text-white"
                : "bg-[#dce6d2] text-[#244d36]",
            )}
          >
            <Plant className="size-5" weight="duotone" />
          </span>
          <span className="mt-3 text-sm font-semibold text-[#183b2b]">
            Soy agricultor
          </span>
          <span className="mt-1 text-xs leading-relaxed text-[#647364]">
            Publico mis cosechas de Michoacán y recibo contacto directo.
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAccountType("business");
            setDemoCreated(false);
          }}
          className={cn(
            "flex flex-col items-start rounded-2xl border p-4 text-left transition-all cursor-pointer",
            accountType === "business"
              ? "border-[#244d36] bg-[#eef4ea] ring-2 ring-[#244d36]/20"
              : "border-[#dce3d3] bg-[#fbfbf7] hover:border-[#b9c7ac]",
          )}
        >
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              accountType === "business"
                ? "bg-[#244d36] text-white"
                : "bg-[#dce6d2] text-[#244d36]",
            )}
          >
            <Storefront className="size-5" weight="duotone" />
          </span>
          <span className="mt-3 text-sm font-semibold text-[#183b2b]">
            Soy negocio comprador
          </span>
          <span className="mt-1 text-xs leading-relaxed text-[#647364]">
            Busco productos frescos cercanos para mi comercio o cocina.
          </span>
        </button>
      </div>

      <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-[#dce4d2] bg-[#f6f5ed] p-3.5 text-xs leading-relaxed text-[#526452]">
        <Info className="mt-0.5 size-4 shrink-0 text-[#71864f]" weight="duotone" />
        <span>
          Pantalla de diseño visual únicamente. No crea usuarios reales ni
          almacena información en PostgreSQL/Neon.
        </span>
      </div>

      {demoCreated ? (
        <div className="space-y-5 rounded-2xl border border-[#c8dac0] bg-[#f1f6ee] p-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-[#244d36] shadow-xs">
            <CheckCircle className="size-7" weight="duotone" />
          </span>
          <div>
            <p className="text-base font-semibold text-[#183b2b]">
              Perfil visual simulado como{" "}
              {accountType === "farmer" ? "Agricultor" : "Negocio comprador"}
            </p>
            <p className="mt-1 text-xs text-[#5d6d5d]">
              El registro real se habilitará en una fase posterior. Ya puedes
              previsualizar el panel demo o explorar el catálogo.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex-1 rounded-2xl",
              )}
            >
              Ver panel demo
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex-1 rounded-2xl",
              )}
            >
              Explorar catálogo
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-name"
                className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
              >
                Nombre completo
              </label>
              <Input
                id="reg-name"
                required
                placeholder="Ej. María Fernanda López"
              />
            </div>

            <div>
              <label
                htmlFor="reg-org"
                className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
              >
                {accountType === "farmer"
                  ? "Nombre de huerta o parcela"
                  : "Nombre del negocio"}
              </label>
              <Input
                id="reg-org"
                required
                placeholder={
                  accountType === "farmer"
                    ? "Ej. Huerta El Encino"
                    : "Ej. Cocina Regional Morelia"
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-municipality"
                className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
              >
                Municipio en Michoacán
              </label>
              <Select id="reg-municipality" defaultValue="Morelia">
                {MUNICIPALITIES.map((municipality) => (
                  <option key={municipality} value={municipality}>
                    {municipality}
                  </option>
                ))}
                <option value="Pátzcuaro">Pátzcuaro</option>
                <option value="Lázaro Cárdenas">Lázaro Cárdenas</option>
              </Select>
            </div>

            <div>
              <label
                htmlFor="reg-detail"
                className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
              >
                {accountType === "farmer"
                  ? "Cultivos principales"
                  : "Giro del negocio"}
              </label>
              <Input
                id="reg-detail"
                placeholder={
                  accountType === "farmer"
                    ? "Ej. Aguacate, limón, guayaba"
                    : "Ej. Restaurante, frutería, comedor"
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-email"
                className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
              >
                Correo electrónico
              </label>
              <Input
                id="reg-email"
                type="email"
                required
                placeholder="correo@ejemplo.mx"
              />
            </div>
            <div>
              <label
                htmlFor="reg-pass"
                className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
              >
                Contraseña
              </label>
              <Input
                id="reg-pass"
                type="password"
                required
                placeholder="Mínimo 8 caracteres"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full rounded-2xl">
            Continuar como{" "}
            {accountType === "farmer" ? "agricultor" : "negocio comprador"}
            <ArrowRight className="size-4" />
          </Button>
        </form>
      )}

      <p className="mt-6 border-t border-[#eef1e7] pt-5 text-center text-sm text-[#647364]">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#244d36] hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
