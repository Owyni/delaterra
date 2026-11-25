"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Basket,
  CalendarBlank,
  CheckCircle,
  MapPin,
  Package,
  SealCheck,
  ShoppingBag,
  User,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { createOrdersAction } from "@/app/actions/orders";
import { useOrderCart } from "@/components/orders/order-cart-provider";
import { OrderConfirmationCards } from "@/components/orders/order-confirmation-cards";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { formatMxn } from "@/lib/orders/domain";
import type { PublicProductDTO } from "@/lib/services/catalog";
import type { CreatedOrderSummary } from "@/lib/services/orders";
import { cn } from "@/lib/utils";

interface ProductDetailViewProps {
  product: PublicProductDTO & {
    farmerDescription: string | null;
    farmerSpecialty: string | null;
  };
  relatedProducts: PublicProductDTO[];
  viewerRole: "farmer" | "business" | "admin" | null;
}

export function ProductDetailView({
  product,
  relatedProducts,
  viewerRole,
}: ProductDetailViewProps) {
  const { addItem } = useOrderCart();

  const [orderOpen, setOrderOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [createdOrders, setCreatedOrders] = useState<
    CreatedOrderSummary[] | null
  >(null);
  const [addedToCartNotice, setAddedToCartNotice] = useState(false);

  const isOutOfStock = product.availableQuantity <= 0;
  const isLowStock = !isOutOfStock && product.availableQuantity <= 10;
  const badgeVariant = isOutOfStock || isLowStock ? "limited" : "available";
  const availabilityLabel = isOutOfStock
    ? "Sin existencias"
    : isLowStock
      ? `Quedan ${product.availableQuantity} ${product.unit}`
      : `Disponible (${product.availableQuantity} ${product.unit})`;

  function handleAddToCart() {
    if (isOutOfStock) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        priceMxn: product.priceMxn,
        unit: product.unit,
        availableQuantity: product.availableQuantity,
        imageUrl: product.imageUrl,
        backdropColor: product.backdropColor,
        farmerId: product.farmerId,
        farmerName: product.farmerName,
        municipality: product.municipality,
      },
      quantity,
    );
    setAddedToCartNotice(true);
  }

  async function handleDirectOrderSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setOrderError(null);

    try {
      const result = await createOrdersAction({
        items: [{ productId: product.id, quantity }],
        notes: notes.trim() || null,
      });

      if (!result.ok) {
        setOrderError(result.error);
        return;
      }

      setCreatedOrders(result.data);
    } catch {
      setOrderError("No se pudo enviar tu solicitud de pedido.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
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

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[2rem] border border-[#dfe6d5] bg-white p-4 shadow-[0_20px_55px_-30px_rgba(24,59,43,0.28)]">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]"
            style={{ backgroundColor: product.backdropColor }}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={300}
              priority
              unoptimized
              className="h-full w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3.5 py-1.5 text-xs font-semibold text-[#244d36] shadow-xs">
              {product.categoryName}
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
                {product.minOrderNote || `Por ${product.unit}`}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f6f5ed] p-3">
              <p className="text-[11px] font-medium text-[#7b8677]">
                Disponibilidad
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#183b2b]">
                {product.availableQuantity} {product.unit}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant={badgeVariant}>{availabilityLabel}</Badge>
              <Badge variant="outline" className="text-[#697667]">
                Comercio directo Michoacán
              </Badge>
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b] sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tight text-[#244d36]">
                {formatMxn(product.priceMxn).replace(" MXN", "")}
              </span>
              <span className="text-base font-medium text-[#7b8677]">
                MXN / {product.unit}
              </span>
            </div>

            <p className="mt-4 text-base leading-relaxed text-[#576758]">
              {product.description}
            </p>

            {(product.harvestSeason ||
              product.packaging ||
              product.qualityGrade) && (
              <dl className="mt-6 grid gap-3 rounded-3xl border border-[#e0e6d6] bg-white p-5 sm:grid-cols-2">
                {product.harvestSeason && (
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
                )}

                {product.packaging && (
                  <div className="flex items-start gap-3">
                    <Package
                      className="mt-0.5 size-5 shrink-0 text-[#71864f]"
                      weight="duotone"
                    />
                    <div>
                      <dt className="text-xs font-medium text-[#7b8677]">
                        Empaque
                      </dt>
                      <dd className="text-sm font-semibold text-[#183b2b]">
                        {product.packaging}
                      </dd>
                    </div>
                  </div>
                )}

                {product.qualityGrade && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <SealCheck
                      className="mt-0.5 size-5 shrink-0 text-[#71864f]"
                      weight="duotone"
                    />
                    <div>
                      <dt className="text-xs font-medium text-[#7b8677]">
                        Calidad
                      </dt>
                      <dd className="text-sm font-semibold text-[#183b2b]">
                        {product.qualityGrade}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            )}

            <div className="mt-6 rounded-3xl border border-[#dce4d1] bg-[#eef2e6] p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-[#dce6d2] text-[#244d36]">
                    <User className="size-6" weight="duotone" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#71864f]">
                      Productor
                    </p>
                    <p className="text-base font-semibold text-[#183b2b]">
                      {product.farmerName}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-[#5d6c5d]">
                      <MapPin className="size-3.5 text-[#71864f]" />
                      {product.farmName ? `${product.farmName} · ` : ""}
                      {product.municipality}, Michoacán
                    </p>
                  </div>
                </div>

                <Link
                  href={`/farmers?productor=${product.farmerId}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "border-[#c4d0b8] bg-white text-[#244d36]",
                  )}
                >
                  Ver perfil
                </Link>
              </div>
            </div>
          </div>

          {addedToCartNotice && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#c8dac0] bg-[#f1f6ee] p-3.5 text-xs text-[#244d36]">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle className="size-4 shrink-0" weight="fill" />
                Producto agregado a tu lista de pedido.
              </span>
              <Link href="/pedido" className="font-semibold underline">
                Revisar mi pedido
              </Link>
            </div>
          )}

          {viewerRole === "business" ? (
            <div className="space-y-3">
              {!isOutOfStock && (
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="detail-qty"
                    className="text-xs font-semibold text-[#3e5240]"
                  >
                    Cantidad ({product.unit}):
                  </label>
                  <Input
                    id="detail-qty"
                    type="number"
                    min={1}
                    max={product.availableQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const val = Number.parseInt(e.target.value, 10);
                      if (Number.isNaN(val)) {
                        setQuantity(1);
                      } else {
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(product.availableQuantity, val),
                          ),
                        );
                      }
                    }}
                    className="w-28"
                  />
                  <span className="text-xs text-[#647364]">
                    Estimado:{" "}
                    <strong className="text-[#244d36]">
                      {formatMxn(product.priceMxn * quantity)}
                    </strong>
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={() => {
                    setCreatedOrders(null);
                    setOrderError(null);
                    setOrderOpen(true);
                  }}
                  className="flex-1 rounded-2xl"
                >
                  <ShoppingBag className="size-4" weight="duotone" />
                  {isOutOfStock ? "Sin existencias" : "Solicitar pedido ahora"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="rounded-2xl border-[#c6d2bb]"
                >
                  <Basket className="size-4" weight="duotone" />
                  Agregar al pedido
                </Button>
              </div>
            </div>
          ) : viewerRole === "farmer" ? (
            <div className="rounded-2xl border border-[#dce4d2] bg-[#f6f5ed] p-4 text-xs text-[#526452]">
              Iniciaste sesión con una cuenta de <strong>agricultor</strong>.
              Solo las cuentas de negocio comprador pueden generar solicitudes
              de pedido.
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/login?next=${encodeURIComponent(`/products/${product.id}`)}`}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "flex-1 rounded-2xl",
                )}
              >
                <ShoppingBag className="size-4" weight="duotone" />
                Inicia sesión como negocio para pedir
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-2xl border-[#c6d2bb]",
                )}
              >
                Registrar negocio
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal de pedido directo */}
      {orderOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="direct-order-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#183b2b]/45 p-4 backdrop-blur-xs"
        >
          <div className="relative my-8 w-full max-w-xl rounded-3xl border border-[#dce3d3] bg-white p-6 shadow-2xl sm:p-7">
            <button
              type="button"
              aria-label="Cerrar ventana"
              onClick={() => setOrderOpen(false)}
              className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-[#697666] hover:bg-[#f6f5ed]"
            >
              <X className="size-5" />
            </button>

            {createdOrders ? (
              <div className="space-y-4">
                <OrderConfirmationCards orders={createdOrders} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOrderOpen(false)}
                  className="w-full"
                >
                  Cerrar
                </Button>
              </div>
            ) : (
              <div>
                <Badge variant="secondary">Pedido directo</Badge>
                <h2
                  id="direct-order-title"
                  className="mt-3 text-xl font-semibold text-[#183b2b]"
                >
                  Solicitar {product.name}
                </h2>
                <p className="mt-1 text-xs text-[#6d7a6b]">
                  Se generará un pedido para{" "}
                  <strong>{product.farmerName}</strong> ({product.municipality})
                  y recibirás el enlace directo de WhatsApp para coordinar pago
                  y entrega.
                </p>

                {orderError && (
                  <div
                    role="alert"
                    className="mt-4 flex items-start gap-2 rounded-2xl border border-[#e6c4bf] bg-[#fdf2f0] p-3 text-xs text-[#8f2d21]"
                  >
                    <WarningCircle
                      className="mt-0.5 size-4 shrink-0"
                      weight="fill"
                    />
                    <span>{orderError}</span>
                  </div>
                )}

                <form
                  onSubmit={handleDirectOrderSubmit}
                  className="mt-5 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="modal-qty"
                      className="mb-1.5 block text-xs font-semibold text-[#425543]"
                    >
                      Cantidad ({product.unit}) · Máx.{" "}
                      {product.availableQuantity}
                    </label>
                    <Input
                      id="modal-qty"
                      type="number"
                      min={1}
                      max={product.availableQuantity}
                      required
                      value={quantity}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value, 10);
                        setQuantity(
                          Number.isNaN(val)
                            ? 1
                            : Math.max(
                                1,
                                Math.min(product.availableQuantity, val),
                              ),
                        );
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-notes"
                      className="mb-1.5 block text-xs font-semibold text-[#425543]"
                    >
                      Notas para el agricultor (opcional)
                    </label>
                    <Textarea
                      id="modal-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Horario preferido de entrega, punto de recolección o detalles de empaque..."
                    />
                  </div>

                  <div className="rounded-2xl bg-[#f6f5ed] p-3.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#5d6c5d]">Total estimado:</span>
                      <span className="font-bold text-[#244d36]">
                        {formatMxn(product.priceMxn * quantity)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? "Creando pedido..." : "Confirmar pedido"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOrderOpen(false)}
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
