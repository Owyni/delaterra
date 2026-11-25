"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  MapPin,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatMxn, ORDER_STATUS_META } from "@/lib/orders/domain";
import type { CreatedOrderSummary } from "@/lib/services/orders";
import { cn } from "@/lib/utils";

interface OrderConfirmationCardsProps {
  orders: CreatedOrderSummary[];
}

export function OrderConfirmationCards({
  orders,
}: OrderConfirmationCardsProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[#c3d9bd] bg-[#ebf4e8] p-6">
        <div className="flex items-start gap-3">
          <CheckCircle
            className="mt-0.5 size-7 shrink-0 text-[#244d36]"
            weight="duotone"
          />
          <div>
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#183b2b]">
              {orders.length === 1
                ? "Pedido creado correctamente"
                : `${orders.length} pedidos independientes creados`}
            </h2>
            <p className="mt-1 text-sm text-[#49614b]">
              Cada pedido pertenece a un único agricultor y comienza en estado{" "}
              <strong>Solicitud creada</strong>. Usa el botón de WhatsApp para
              coordinar pago y entrega directa; abrir WhatsApp no cambia el
              estado del pedido automáticamente.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusMeta = ORDER_STATUS_META[order.status];
          return (
            <div
              key={order.id}
              className="rounded-3xl border border-[#dce3d3] bg-white p-6 shadow-[0_12px_32px_-24px_rgba(24,59,43,0.22)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#eef2e8] pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#dce6d2] px-3 py-1 font-mono text-xs font-semibold text-[#244d36]">
                      {order.reference}
                    </span>
                    <Badge variant={statusMeta.badgeVariant}>
                      {statusMeta.label}
                    </Badge>
                  </div>
                  <h3 className="mt-2.5 text-lg font-semibold text-[#183b2b]">
                    {order.farmer.displayName}
                    {order.farmer.farmName ? ` · ${order.farmer.farmName}` : ""}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-[#647364]">
                    <MapPin className="size-3.5 text-[#71864f]" />
                    {order.farmer.municipality}, Michoacán
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs font-medium text-[#7b8677]">
                    Total calculado en servidor
                  </p>
                  <p className="text-2xl font-bold text-[#244d36]">
                    {formatMxn(order.total)}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-[#fbfbf7] px-3.5 py-2.5"
                  >
                    <div>
                      <span className="font-medium text-[#183b2b]">
                        {item.productName}
                      </span>
                      <span className="ml-2 text-xs text-[#647364]">
                        {item.quantity} {item.unit} × {formatMxn(item.unitPrice)}
                      </span>
                    </div>
                    <span className="font-semibold text-[#244d36]">
                      {formatMxn(item.subtotal)}
                    </span>
                  </li>
                ))}
              </ul>

              {order.notes && (
                <p className="mt-3 rounded-2xl border border-[#edf1e7] bg-[#f6f5ed] px-3.5 py-2 text-xs text-[#546754]">
                  <strong>Notas:</strong> {order.notes}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {order.whatsappUrl ? (
                  <a
                    href={order.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "default", size: "default" }),
                      "bg-[#1f6b43] hover:bg-[#185636]",
                    )}
                  >
                    <WhatsappLogo className="size-4.5" weight="fill" />
                    Contactar por WhatsApp
                  </a>
                ) : (
                  <span className="text-xs text-[#7b8677]">
                    Este agricultor aún no registra número de WhatsApp.
                    {order.farmer.phone
                      ? ` Teléfono: ${order.farmer.phone}`
                      : ""}
                  </span>
                )}

                <Link
                  href="/dashboard?tab=pedidos"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                  )}
                >
                  Ver en mi panel
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
