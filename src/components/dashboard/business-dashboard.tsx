"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChartLineUp,
  CheckCircle,
  MapPin,
  Receipt,
  Storefront,
  UserCircle,
  WarningCircle,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { updateOrderStatusAction } from "@/app/actions/orders";
import { updateBusinessProfileAction } from "@/app/actions/profile";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import type { BusinessProfileRecord } from "@/lib/auth-session";
import { formatMxn, ORDER_STATUS_META } from "@/lib/orders/domain";
import {
  BUSINESS_TYPES,
  MICHOACAN_MUNICIPALITIES,
} from "@/lib/validators/auth";
import type { OrderStatus } from "@/lib/validators/orders";
import { cn } from "@/lib/utils";

type BusinessTab = "resumen" | "pedidos" | "perfil";

export interface BusinessOrderItemView {
  id: string;
  reference: string;
  status: OrderStatus;
  total: string;
  notes: string | null;
  createdAt: Date | string;
  receivedAt: Date | string | null;
  farmerId: string;
  farmerName: string;
  farmName: string | null;
  farmerMunicipality: string;
  farmerWhatsapp: string | null;
  farmerPhone: string | null;
  whatsappUrl: string | null;
  items: Array<{
    id: string;
    productName: string;
    unitPrice: string;
    unit: string;
    quantity: number;
    subtotal: string;
  }>;
}

interface BusinessDashboardProps {
  profile: BusinessProfileRecord;
  email: string;
  orders: BusinessOrderItemView[];
  initialTab?: string;
}

const SIDEBAR_ITEMS: {
  id: BusinessTab;
  label: string;
  icon: typeof ChartLineUp;
}[] = [
  { id: "resumen", label: "Resumen", icon: ChartLineUp },
  { id: "pedidos", label: "Mis pedidos", icon: Receipt },
  { id: "perfil", label: "Perfil del negocio", icon: UserCircle },
];

export function BusinessDashboard({
  profile,
  email,
  orders,
  initialTab,
}: BusinessDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BusinessTab>(
    initialTab === "pedidos" || initialTab === "perfil"
      ? initialTab
      : "resumen",
  );
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);

  const [businessName, setBusinessName] = useState(profile.businessName);
  const [businessType, setBusinessType] = useState(profile.businessType);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [municipality, setMunicipality] = useState(profile.municipality);
  const [description, setDescription] = useState(profile.description ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const pendingOrdersCount = orders.filter(
    (o) => o.status !== "received",
  ).length;
  const receivedOrdersCount = orders.filter(
    (o) => o.status === "received",
  ).length;

  async function handleStatusChange(orderId: string, nextStatus: OrderStatus) {
    setBusyOrderId(orderId);
    setFeedback(null);
    try {
      const result = await updateOrderStatusAction({ orderId, nextStatus });
      if (!result.ok) {
        setFeedback({ type: "error", text: result.error });
        return;
      }
      setFeedback({
        type: "success",
        text: result.message || "Estado actualizado.",
      });
      router.refresh();
    } finally {
      setBusyOrderId(null);
    }
  }

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingProfile(true);
    setFeedback(null);

    try {
      const result = await updateBusinessProfileAction({
        businessName,
        businessType,
        phone,
        municipality,
        description,
      });

      if (!result.ok) {
        setFeedback({ type: "error", text: result.error });
        return;
      }
      setFeedback({ type: "success", text: result.message });
      router.refresh();
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mb-6 flex flex-col justify-between gap-3 rounded-3xl border border-[#d6e0cb] bg-[#ebf2e5] px-5 py-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-[#183b2b]">
            Panel de negocio comprador · {profile.businessName}
          </p>
          <p className="text-xs text-[#546754]">
            Coordina entregas con agricultores por WhatsApp y confirma la
            recepción de tus pedidos ({email}).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/pedido"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "bg-white",
            )}
          >
            Mi lista de pedido
          </Link>
          <Link
            href="/products"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Explorar productos
          </Link>
        </div>
      </div>

      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={cn(
            "mb-6 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-xs font-medium",
            feedback.type === "error"
              ? "border-[#e6c4bf] bg-[#fdf2f0] text-[#8f2d21]"
              : "border-[#c8dac0] bg-white text-[#244d36]",
          )}
        >
          <span className="flex items-center gap-2">
            {feedback.type === "error" ? (
              <WarningCircle className="size-4 shrink-0" weight="fill" />
            ) : (
              <CheckCircle className="size-4 shrink-0" weight="fill" />
            )}
            {feedback.text}
          </span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="font-semibold underline cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col justify-between rounded-3xl border border-[#dce3d3] bg-white p-4 shadow-[0_12px_32px_-24px_rgba(24,59,43,0.22)] lg:min-h-[30rem]">
          <div>
            <div className="flex items-center gap-3 rounded-2xl bg-[#f6f5ed] p-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#dce6d2] text-[#244d36]">
                <Storefront className="size-5" weight="duotone" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#183b2b]">
                  {profile.businessName}
                </p>
                <p className="truncate text-xs text-[#71864f]">
                  {profile.businessType} · {profile.municipality}
                </p>
              </div>
            </div>

            <nav
              aria-label="Navegación del panel de negocio"
              className="mt-4 flex flex-row gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:pb-0"
            >
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                      active
                        ? "bg-[#244d36] text-white"
                        : "text-[#475b49] hover:bg-[#f1f4eb] hover:text-[#183b2b]",
                    )}
                  >
                    <Icon
                      className="size-4.5 shrink-0"
                      weight={active ? "fill" : "duotone"}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="space-y-6">
          {activeTab === "resumen" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-[#dce3d3] bg-white p-5">
                  <p className="text-xs font-medium text-[#6f7d6e]">
                    Pedidos solicitados
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#244d36]">
                    {orders.length}
                  </p>
                </div>
                <div className="rounded-3xl border border-[#dce3d3] bg-white p-5">
                  <p className="text-xs font-medium text-[#6f7d6e]">
                    En curso / coordinación
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#244d36]">
                    {pendingOrdersCount}
                  </p>
                </div>
                <div className="rounded-3xl border border-[#dce3d3] bg-white p-5">
                  <p className="text-xs font-medium text-[#6f7d6e]">
                    Recibidos confirmados
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#244d36]">
                    {receivedOrdersCount}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#183b2b]">
                    Tus pedidos recientes
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab("pedidos")}
                    className="text-xs font-semibold text-[#244d36] hover:underline cursor-pointer"
                  >
                    Ver todos
                  </button>
                </div>

                {orders.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {orders.slice(0, 4).map((order) => {
                      const statusMeta = ORDER_STATUS_META[order.status];
                      return (
                        <div
                          key={order.id}
                          className="flex flex-col justify-between gap-3 rounded-2xl border border-[#ebf0e4] bg-[#fbfbf7] p-4 sm:flex-row sm:items-center"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-[#71864f]">
                                {order.reference}
                              </span>
                              <span className="text-sm font-semibold text-[#183b2b]">
                                {order.farmerName}
                              </span>
                            </div>
                            <p className="mt-1 flex items-center gap-1 text-xs text-[#647364]">
                              <MapPin className="size-3.5" />
                              {order.farmerMunicipality}, Michoacán
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <Badge variant={statusMeta.badgeVariant}>
                              {statusMeta.label}
                            </Badge>
                            <p className="mt-1.5 text-sm font-bold text-[#244d36]">
                              {formatMxn(order.total)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[#647364]">
                    Aún no has realizado pedidos. Explora el catálogo para
                    solicitar cosechas directamente a los productores.
                  </p>
                )}
              </div>
            </>
          )}

          {activeTab === "pedidos" && (
            <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
              <div className="border-b border-[#eef2e8] pb-5">
                <h2 className="text-xl font-semibold text-[#183b2b]">
                  Mis pedidos realizados
                </h2>
                <p className="mt-1 text-xs text-[#647364]">
                  Cada pedido corresponde a un único agricultor. Confirma la
                  recepción únicamente cuando hayas recibido tu mercancía.
                </p>
              </div>

              {orders.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {orders.map((order) => {
                    const statusMeta = ORDER_STATUS_META[order.status];
                    const canConfirmReceived = order.status !== "received";

                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-[#e5ebdc] bg-[#fbfbf7] p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[#dce6d2] px-2.5 py-0.5 font-mono text-xs font-semibold text-[#244d36]">
                                {order.reference}
                              </span>
                              <Badge variant={statusMeta.badgeVariant}>
                                {statusMeta.label}
                              </Badge>
                            </div>
                            <h3 className="mt-2 text-base font-semibold text-[#183b2b]">
                              {order.farmerName}
                              {order.farmName ? ` · ${order.farmName}` : ""}
                            </h3>
                            <p className="text-xs text-[#647364]">
                              {order.farmerMunicipality}, Michoacán
                            </p>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-lg font-bold text-[#244d36]">
                              {formatMxn(order.total)}
                            </p>
                            <p className="text-[11px] text-[#7b8677]">
                              Creado el{" "}
                              {new Date(order.createdAt).toLocaleDateString(
                                "es-MX",
                              )}
                            </p>
                            {order.receivedAt && (
                              <p className="text-[11px] font-medium text-[#244d36]">
                                Recepción confirmada:{" "}
                                {new Date(order.receivedAt).toLocaleString(
                                  "es-MX",
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        <ul className="mt-3 space-y-1.5 border-t border-[#e9efe0] pt-3 text-xs text-[#475b49]">
                          {order.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-center justify-between"
                            >
                              <span>
                                {item.productName} — {item.quantity} {item.unit}{" "}
                                × {formatMxn(item.unitPrice)}
                              </span>
                              <span className="font-semibold text-[#183b2b]">
                                {formatMxn(item.subtotal)}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {order.notes && (
                          <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs text-[#546754]">
                            <strong>Notas:</strong> {order.notes}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-2.5">
                          {order.whatsappUrl && (
                            <a
                              href={order.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                buttonVariants({
                                  variant: "default",
                                  size: "sm",
                                }),
                                "bg-[#1f6b43] hover:bg-[#185636]",
                              )}
                            >
                              <WhatsappLogo
                                className="size-4"
                                weight="fill"
                              />
                              Contactar por WhatsApp
                            </a>
                          )}

                          {order.status === "requested" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={busyOrderId === order.id}
                              onClick={() =>
                                handleStatusChange(order.id, "coordination")
                              }
                            >
                              Marcar en coordinación
                            </Button>
                          )}

                          {canConfirmReceived && (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              disabled={busyOrderId === order.id}
                              onClick={() =>
                                handleStatusChange(order.id, "received")
                              }
                            >
                              <CheckCircle className="size-4" />
                              {busyOrderId === order.id
                                ? "Confirmando..."
                                : "Confirmar recepción"}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-5 text-sm text-[#647364]">
                  Aún no has realizado ningún pedido.
                </p>
              )}
            </div>
          )}

          {activeTab === "perfil" && (
            <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
              <div className="border-b border-[#eef2e8] pb-5">
                <h2 className="text-xl font-semibold text-[#183b2b]">
                  Perfil del negocio comprador
                </h2>
              </div>

              <form
                onSubmit={handleProfileSubmit}
                className="mt-5 grid gap-4 sm:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor="biz-prof-name"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Nombre del negocio *
                  </label>
                  <Input
                    id="biz-prof-name"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="biz-prof-type"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Tipo de negocio *
                  </label>
                  <Select
                    id="biz-prof-type"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  >
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="biz-prof-phone"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Teléfono *
                  </label>
                  <Input
                    id="biz-prof-phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="biz-prof-mun"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Municipio *
                  </label>
                  <Select
                    id="biz-prof-mun"
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
                <div className="sm:col-span-2">
                  <label
                    htmlFor="biz-prof-desc"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Descripción
                  </label>
                  <Textarea
                    id="biz-prof-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={savingProfile}>
                    {savingProfile ? "Guardando..." : "Guardar perfil"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
