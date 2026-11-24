"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarBlank,
  CheckCircle,
  MapPin,
  Package,
  PhoneCall,
  SealCheck,
  User,
  X,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ProductCard } from "@/components/products/product-card";
import { cn } from "@/lib/utils";
import type { Farmer, Product } from "@/types";

interface ProductDetailViewProps {
  product: Product;
  farmer?: Farmer;
  relatedProducts: Product[];
}

export function ProductDetailView({
  product,
  farmer,
  relatedProducts,
}: ProductDetailViewProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const [submittedDemo, setSubmittedDemo] = useState(false);

  const badgeVariant =
    product.availability === "disponible"
      ? "available"
      : product.availability === "pocas_unidades"
        ? "limited"
        : "seasonal";

  function handleDemoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmittedDemo(true);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      {/* Navegación superior */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#6c796b]">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#244d36]">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#244d36]">
            Productos
          </Link>
          <span>/</span>
          <span className="font-medium text-[#183b2b]">{product.name}</span>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 font-medium text-[#244d36] hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Volver al catálogo
        </Link>
      </div>

      {/* Ficha principal */}
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Imagen grande */}
        <div className="overflow-hidden rounded-[2rem] border border-[#dfe6d5] bg-white p-4 shadow-[0_20px_55px_-30px_rgba(24,59,43,0.28)]">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]"
            style={{ backgroundColor: product.backdropColor }}
          >
            <Image
              src={product.image}
              alt={`Ilustración de ${product.name}`}
              width={400}
              height={300}
              priority
              unoptimized
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3.5 py-1.5 text-xs font-semibold text-[#244d36] shadow-xs">
              {product.categoryLabel}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-[#f6f5ed] p-3">
              <p className="text-[11px] font-medium text-[#7b8677]">Origen</p>
              <p className="mt-0.5 text-xs font-semibold text-[#183b2b]">
                {product.municipality}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f6f5ed] p-3">
              <p className="text-[11px] font-medium text-[#7b8677]">
                Presentación
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#183b2b]">
                {product.minOrder}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f6f5ed] p-3">
              <p className="text-[11px] font-medium text-[#7b8677]">
                Distancia aprox.
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#183b2b]">
                {product.distanceKmMock} km (demo)
              </p>
            </div>
          </div>
        </div>

        {/* Información comercial ilustrativa */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant={badgeVariant}>{product.availabilityLabel}</Badge>
              <Badge variant="outline" className="text-[#697667]">
                Datos ilustrativos de demostración
              </Badge>
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-[#244d36]">
                ${product.priceMxn}
              </span>
              <span className="text-base font-medium text-[#7b8677]">
                MXN / {product.unit}
              </span>
            </div>

            <p className="mt-4 text-base leading-relaxed text-[#576758]">
              {product.description}
            </p>

            {/* Especificaciones */}
            <dl className="mt-6 grid gap-3 rounded-3xl border border-[#e0e6d6] bg-white p-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CalendarBlank
                  className="mt-0.5 size-5 shrink-0 text-[#71864f]"
                  weight="duotone"
                />
                <div>
                  <dt className="text-xs font-medium text-[#7b8677]">
                    Temporada de corte
                  </dt>
                  <dd className="text-sm font-semibold text-[#183b2b]">
                    {product.harvestSeason}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package
                  className="mt-0.5 size-5 shrink-0 text-[#71864f]"
                  weight="duotone"
                />
                <div>
                  <dt className="text-xs font-medium text-[#7b8677]">Empaque</dt>
                  <dd className="text-sm font-semibold text-[#183b2b]">
                    {product.packaging}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <SealCheck
                  className="mt-0.5 size-5 shrink-0 text-[#71864f]"
                  weight="duotone"
                />
                <div>
                  <dt className="text-xs font-medium text-[#7b8677]">
                    Calidad referencial
                  </dt>
                  <dd className="text-sm font-semibold text-[#183b2b]">
                    {product.qualityGrade}
                  </dd>
                </div>
              </div>
            </dl>

            {/* Tarjeta del agricultor */}
            <div className="mt-6 rounded-3xl border border-[#dce4d1] bg-[#eef2e6] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {farmer ? (
                    <Image
                      src={farmer.image}
                      alt={farmer.name}
                      width={64}
                      height={64}
                      unoptimized
                      className="size-14 rounded-2xl border border-white object-cover"
                    />
                  ) : (
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-[#dce6d2] text-[#244d36]">
                      <User className="size-6" />
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#71864f]">
                      Agricultor de muestra
                    </p>
                    <p className="text-base font-semibold text-[#183b2b]">
                      {product.farmerName}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-[#5d6c5d]">
                      <MapPin className="size-3.5 text-[#71864f]" />
                      {farmer ? `${farmer.farmName} · ` : ""}
                      {product.municipality}, Michoacán
                    </p>
                  </div>
                </div>

                {farmer && (
                  <Link
                    href={`/farmers?productor=${farmer.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "border-[#c4d0b8] bg-white text-[#244d36]",
                    )}
                  >
                    Ver perfil
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción visual */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => {
                setSubmittedDemo(false);
                setContactOpen(true);
              }}
              className="flex-1 rounded-2xl"
            >
              <PhoneCall className="size-4" weight="duotone" />
              Solicitar producto / Contactar agricultor
            </Button>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-2xl border-[#c6d2bb]",
              )}
            >
              Seguir explorando
            </Link>
          </div>
        </div>
      </div>

      {/* Modal visual de contacto / solicitud */}
      {contactOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-contact-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#183b2b]/45 p-4 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-[#dce3d3] bg-white p-6 shadow-2xl sm:p-7">
            <button
              type="button"
              aria-label="Cerrar ventana"
              onClick={() => setContactOpen(false)}
              className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-[#697666] hover:bg-[#f6f5ed]"
            >
              <X className="size-5" />
            </button>

            {submittedDemo ? (
              <div className="py-4 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#ebf4e8] text-[#244d36]">
                  <CheckCircle className="size-8" weight="duotone" />
                </span>
                <h2
                  id="demo-contact-title"
                  className="mt-4 text-xl font-semibold text-[#183b2b]"
                >
                  Vista previa de solicitud visual
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#647364]">
                  Esta es una demostración visual de interfaz. En esta etapa
                  académica no se envían pedidos ni mensajes reales al productor.
                </p>
                <Button
                  onClick={() => setContactOpen(false)}
                  className="mt-6 w-full"
                >
                  Entendido
                </Button>
              </div>
            ) : (
              <div>
                <Badge variant="secondary">Demostración visual</Badge>
                <h2
                  id="demo-contact-title"
                  className="mt-3 text-xl font-semibold text-[#183b2b]"
                >
                  Consultar {product.name}
                </h2>
                <p className="mt-1 text-xs text-[#6d7a6b]">
                  Simulación de contacto directo con {product.farmerName} (
                  {product.municipality}). No genera pedidos reales.
                </p>

                <form onSubmit={handleDemoSubmit} className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="demo-business"
                      className="mb-1.5 block text-xs font-semibold text-[#425543]"
                    >
                      Nombre de tu negocio
                    </label>
                    <Input
                      id="demo-business"
                      placeholder="Ej. Restaurante La Parcela"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="demo-qty"
                      className="mb-1.5 block text-xs font-semibold text-[#425543]"
                    >
                      Volumen aproximado ({product.unit})
                    </label>
                    <Input
                      id="demo-qty"
                      placeholder={`Ej. ${product.minOrder}`}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="demo-notes"
                      className="mb-1.5 block text-xs font-semibold text-[#425543]"
                    >
                      Mensaje para el agricultor
                    </label>
                    <Textarea
                      id="demo-notes"
                      placeholder="Consulta sobre disponibilidad semanal o punto de entrega..."
                    />
                  </div>
                  <div className="flex gap-2.5 pt-2">
                    <Button type="submit" className="flex-1">
                      Simular consulta
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setContactOpen(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-[#e0e6d6] pt-12">
          <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#183b2b]">
            Otros productos de la región
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
