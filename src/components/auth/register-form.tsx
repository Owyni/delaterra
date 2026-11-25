"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  EnvelopeSimple,
  Plant,
  Storefront,
  WarningCircle,
} from "@phosphor-icons/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import {
  BUSINESS_TYPES,
  MICHOACAN_MUNICIPALITIES,
} from "@/lib/validators/auth";
import { cn } from "@/lib/utils";

type AccountType = "farmer" | "business";

export function RegisterForm() {
  const [accountType, setAccountType] = useState<AccountType>("farmer");

  // Campos comunes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [municipality, setMunicipality] = useState<string>("Uruapan");
  const [description, setDescription] = useState("");

  // Campos de agricultor
  const [displayName, setDisplayName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Campos de negocio comprador
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<string>(BUSINESS_TYPES[0]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const payload =
      accountType === "farmer"
        ? {
            accountType: "farmer" as const,
            displayName,
            farmName,
            specialty,
            email,
            password,
            phone,
            whatsapp,
            municipality,
            description,
          }
        : {
            accountType: "business" as const,
            businessName,
            businessType,
            email,
            password,
            phone,
            municipality,
            description,
          };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        email?: string;
        error?: string;
      };

      if (!response.ok) {
        setErrorMessage(
          result.error || "No fue posible crear tu cuenta. Revisa los campos.",
        );
        return;
      }

      setRegisteredEmail(result.email || email);
    } catch {
      setErrorMessage(
        "No pudimos conectar con el servidor. Intenta nuevamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-2xl rounded-[2rem] border border-[#dce3d3] bg-white p-7 shadow-[0_24px_60px_-30px_rgba(24,59,43,0.28)] sm:p-9">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dce6d2]/80 px-3 py-1 text-xs font-semibold text-[#244d36]">
          Registro de cuenta
        </span>
        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b]">
          Únete a la red Delaterra
        </h1>
        <p className="mt-2 text-sm text-[#647364]">
          Crea tu cuenta real en Delaterra y verifica tu correo electrónico para
          publicar productos o solicitar cosechas de Michoacán.
        </p>
      </div>

      {/* Selector de tipo de cuenta */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setAccountType("farmer");
            setErrorMessage(null);
            setRegisteredEmail(null);
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
            Publico mis cosechas de Michoacán y coordino pedidos por WhatsApp.
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAccountType("business");
            setErrorMessage(null);
            setRegisteredEmail(null);
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
            Busco productos frescos cercanos para mi restaurante, tienda o cocina.
          </span>
        </button>
      </div>

      {registeredEmail ? (
        <div className="space-y-5 rounded-2xl border border-[#c8dac0] bg-[#f1f6ee] p-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-[#244d36] shadow-xs">
            <EnvelopeSimple className="size-7" weight="duotone" />
          </span>
          <div>
            <p className="text-base font-semibold text-[#183b2b]">
              ¡Cuenta registrada! Verifica tu correo electrónico
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[#5d6d5d]">
              Enviamos un enlace de activación a{" "}
              <strong className="text-[#183b2b]">{registeredEmail}</strong>.
              Abre el enlace en tu bandeja de entrada para habilitar el inicio de
              sesión.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/verify-email?email=${encodeURIComponent(registeredEmail)}`}
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex-1 rounded-2xl",
              )}
            >
              Reenviar o revisar verificación
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex-1 rounded-2xl",
              )}
            >
              Ir a iniciar sesión
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-[#e6c4bf] bg-[#fdf2f0] p-3.5 text-xs leading-relaxed text-[#8f2d21]"
            >
              <WarningCircle className="mt-0.5 size-4 shrink-0" weight="fill" />
              <span>{errorMessage}</span>
            </div>
          )}

          {accountType === "farmer" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reg-display-name"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Nombre público *
                  </label>
                  <Input
                    id="reg-display-name"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej. Mateo Mendoza"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-farm-name"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Huerta o parcela (opcional)
                  </label>
                  <Input
                    id="reg-farm-name"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="Ej. Huerta Los Pinos"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reg-farmer-phone"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Teléfono *
                  </label>
                  <Input
                    id="reg-farmer-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="452 123 4567"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-farmer-whatsapp"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Número de WhatsApp *
                  </label>
                  <Input
                    id="reg-farmer-whatsapp"
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+52 452 123 4567"
                  />
                  <p className="mt-1 text-[11px] text-[#7b8677]">
                    Se guardará en formato internacional (+52XXXXXXXXXX) para
                    coordinar pedidos.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reg-farmer-municipality"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Municipio en Michoacán *
                  </label>
                  <Select
                    id="reg-farmer-municipality"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                  >
                    {MICHOACAN_MUNICIPALITIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="reg-farmer-specialty"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Cultivos principales (opcional)
                  </label>
                  <Input
                    id="reg-farmer-specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Ej. Aguacate Hass, guayaba"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reg-business-name"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Nombre del negocio *
                  </label>
                  <Input
                    id="reg-business-name"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Cocina Tradicional El Portal"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-business-type"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Tipo de negocio *
                  </label>
                  <Select
                    id="reg-business-type"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  >
                    {BUSINESS_TYPES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="reg-business-phone"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Teléfono *
                  </label>
                  <Input
                    id="reg-business-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="443 123 4567"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-business-municipality"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Municipio en Michoacán *
                  </label>
                  <Select
                    id="reg-business-municipality"
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value)}
                  >
                    {MICHOACAN_MUNICIPALITIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="reg-email"
                className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
              >
                Correo electrónico *
              </label>
              <Input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.mx"
              />
            </div>
            <div>
              <label
                htmlFor="reg-pass"
                className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
              >
                Contraseña *
              </label>
              <Input
                id="reg-pass"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-description"
              className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
            >
              Descripción (opcional)
            </label>
            <Textarea
              id="reg-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                accountType === "farmer"
                  ? "Cuéntanos sobre tu producción, temporadas de corte o entregas..."
                  : "Cuéntanos qué productos compras con mayor frecuencia..."
              }
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="mt-2 w-full rounded-2xl"
          >
            {submitting
              ? "Creando cuenta y enviando verificación..."
              : `Registrarme como ${accountType === "farmer" ? "agricultor" : "negocio comprador"}`}
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
