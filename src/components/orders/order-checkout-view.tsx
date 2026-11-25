"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Basket,
  MapPin,
  Trash,
  WarningCircle,
} from "@phosphor-icons/react";
import { createOrdersAction } from "@/app/actions/orders";
import { useOrderCart } from "@/components/orders/order-cart-provider";
import { OrderConfirmationCards } from "@/components/orders/order-confirmation-cards";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { formatMxn } from "@/lib/orders/domain";
import type { CreatedOrderSummary } from "@/lib/services/orders";
import { cn } from "@/lib/utils";

interface OrderCheckoutViewProps {
  viewerRole: "farmer" | "business" | "admin" | null;
  businessName: string | null;
}

export function OrderCheckoutView({
  viewerRole,
  businessName,
}: OrderCheckoutViewProps) {
  const {
    items,
    groupedByFarmer,
    updateQuantity,
    removeItem,
    clearCart,
  } = useOrderCart();

  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrders, setCreatedOrders] = useState<
    CreatedOrderSummary[] | null
  >(null);

  async function handleSubmitOrders(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await createOrdersAction({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        notes: notes.trim() || null,
      });

      if (!result.ok) {
        setErrorMessage(result.error);
        return;
      }

      clearCart();
      setCreatedOrders(result.data);
    } catch {
      setErrorMessage("Error de conexión al generar los pedidos.");
    } finally {
      setSubmitting(false);
    }
  }

  if (createdOrders) {
    return <OrderConfirmationCards orders={createdOrders} />;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#cdd7c3] bg-white p-12 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#eef4ea] text-[#244d36]">
          <Basket className="size-7" weight="duotone" />
        </span>
        <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#183b2b]">
          Tu lista de pedido está vacía
        </h2>
        <p className="mt-2 text-sm text-[#647364]">
          Explora el catálogo agrícola y agrega cosechas de uno o varios
          agricultores. Delaterra separará automáticamente un pedido por cada
          productor.
        </p>
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "mt-6 rounded-2xl",
          )}
        >
          Explorar productos
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitOrders} className="space-y-6">
      <div className="rounded-3xl border border-[#d6e0cb] bg-[#ebf2e5] px-5 py-4 text-xs leading-relaxed text-[#244d36]">
        {groupedByFarmer.length === 1 ? (
          <span>
            Todos los productos seleccionados pertenecen a{" "}
            <strong>{groupedByFarmer[0].farmerName}</strong>. Se generará{" "}
            <strong>1 pedido</strong>.
          </span>
        ) : (
          <span>
            Seleccionaste productos de{" "}
            <strong>{groupedByFarmer.length} agricultores distintos</strong>. Al
            confirmar, Delaterra generará{" "}
            <strong>
              {groupedByFarmer.length} pedidos independientes
            </strong>{" "}
            (uno por agricultor) para coordinar cada entrega por WhatsApp.
          </span>
        )}
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-[#e6c4bf] bg-[#fdf2f0] p-4 text-xs leading-relaxed text-[#8f2d21]"
        >
          <WarningCircle className="mt-0.5 size-4 shrink-0" weight="fill" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-5">
        {groupedByFarmer.map((group, idx) => (
          <section
            key={group.farmerId}
            className="rounded-3xl border border-[#dce3d3] bg-white p-6 shadow-[0_12px_32px_-24px_rgba(24,59,43,0.22)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef2e8] pb-4">
              <div>
                <Badge variant="secondary">
                  Pedido independiente #{idx + 1}
                </Badge>
                <h2 className="mt-2 text-lg font-semibold text-[#183b2b]">
                  {group.farmerName}
                </h2>
                <p className="flex items-center gap-1 text-xs text-[#647364]">
                  <MapPin className="size-3.5 text-[#71864f]" />
                  {group.municipality}, Michoacán
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#7b8677]">Subtotal estimado</p>
                <p className="text-xl font-bold text-[#244d36]">
                  {formatMxn(group.estimatedTotalMxn)}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {group.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-[#ebf0e4] bg-[#fbfbf7] p-3.5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3.5">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={72}
                      height={54}
                      unoptimized
                      className="h-14 w-18 shrink-0 rounded-xl border border-[#e3e8da] object-cover"
                      style={{ backgroundColor: item.backdropColor }}
                    />
                    <div>
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-sm font-semibold text-[#183b2b] hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-[#647364]">
                        {formatMxn(item.priceMxn)} / {item.unit} · Disponibles:{" "}
                        {item.availableQuantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={1}
                      max={item.availableQuantity}
                      aria-label={`Cantidad de ${item.name}`}
                      value={item.quantity}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value, 10);
                        if (!Number.isNaN(val) && val > 0) {
                          updateQuantity(item.productId, val);
                        }
                      }}
                      className="w-24"
                    />
                    <span className="min-w-24 text-right text-sm font-bold text-[#244d36]">
                      {formatMxn(item.priceMxn * item.quantity)}
                    </span>
                    <button
                      type="button"
                      aria-label={`Quitar ${item.name}`}
                      onClick={() => removeItem(item.productId)}
                      className="inline-flex size-9 items-center justify-center rounded-full text-[#8f2d21] hover:bg-[#fdf2f0]"
                    >
                      <Trash className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
        <label
          htmlFor="checkout-notes"
          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
        >
          Notas generales de coordinación (opcional)
        </label>
        <Textarea
          id="checkout-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Indica horarios preferidos de entrega o detalles para el agricultor..."
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#eef2e8] pt-5">
          {viewerRole === "business" ? (
            <>
              <p className="text-xs text-[#5d6c5d]">
                Comprando como <strong>{businessName}</strong>. Los totales se
                validarán en el servidor antes de confirmar.
              </p>
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="rounded-2xl"
              >
                {submitting
                  ? "Generando pedidos..."
                  : `Confirmar ${groupedByFarmer.length === 1 ? "pedido" : `${groupedByFarmer.length} pedidos`}`}
                <ArrowRight className="size-4" />
              </Button>
            </>
          ) : viewerRole === "farmer" ? (
            <p className="text-xs text-[#8f2d21]">
              Iniciaste sesión como agricultor. Cambia a una cuenta de negocio
              comprador para confirmar pedidos.
            </p>
          ) : (
            <div className="flex w-full flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#5d6c5d]">
                Inicia sesión con tu cuenta de negocio comprador para enviar tu
                solicitud.
              </p>
              <Link
                href="/login?next=/pedido"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "rounded-2xl",
                )}
              >
                Iniciar sesión para pedir
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
