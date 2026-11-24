"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Basket,
  ChartLineUp,
  Info,
  MapPin,
  Package,
  Plus,
  Receipt,
  UserCircle,
} from "@phosphor-icons/react";
import {
  DASHBOARD_ACTIVITY,
  DASHBOARD_ORDERS,
  DASHBOARD_STATS,
} from "@/data/dashboard";
import { FARMERS } from "@/data/farmers";
import { PRODUCTS } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardTab = "resumen" | "productos" | "pedidos" | "perfil";

const SIDEBAR_ITEMS: {
  id: DashboardTab;
  label: string;
  icon: typeof ChartLineUp;
}[] = [
  { id: "resumen", label: "Resumen de actividad", icon: ChartLineUp },
  { id: "productos", label: "Productos publicados", icon: Basket },
  { id: "pedidos", label: "Pedidos", icon: Receipt },
  { id: "perfil", label: "Perfil", icon: UserCircle },
];

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("resumen");
  const [demoMessage, setDemoMessage] = useState<string | null>(null);

  const demoFarmer = FARMERS[0];
  const samplePublished = PRODUCTS.slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      {/* Banner aclaratorio */}
      <div className="mb-6 flex flex-col justify-between gap-3 rounded-3xl border border-[#d6e0cb] bg-[#ebf2e5] px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <Info
            className="mt-0.5 size-5 shrink-0 text-[#244d36]"
            weight="duotone"
          />
          <div>
            <p className="text-sm font-semibold text-[#183b2b]">
              Panel administrativo visual (Datos de demostración)
            </p>
            <p className="text-xs text-[#546754]">
              Esta vista muestra el diseño preliminar para productores. No
              realiza consultas reales ni modifica registros en base de datos.
            </p>
          </div>
        </div>
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "shrink-0 bg-white",
          )}
        >
          Ver vitrina pública
        </Link>
      </div>

      {demoMessage && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#c8dac0] bg-white px-4 py-3 text-xs font-medium text-[#244d36] shadow-xs">
          <span>{demoMessage}</span>
          <button
            type="button"
            onClick={() => setDemoMessage(null)}
            className="ml-4 font-semibold underline cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Navegación lateral */}
        <aside className="flex flex-col justify-between rounded-3xl border border-[#dce3d3] bg-white p-4 shadow-[0_12px_32px_-24px_rgba(24,59,43,0.22)] lg:min-h-[34rem]">
          <div>
            <div className="flex items-center gap-3 rounded-2xl bg-[#f6f5ed] p-3">
              <Image
                src={demoFarmer.image}
                alt={demoFarmer.name}
                width={48}
                height={48}
                unoptimized
                className="size-11 rounded-xl border border-white object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#183b2b]">
                  {demoFarmer.farmName}
                </p>
                <p className="truncate text-xs text-[#71864f]">
                  {demoFarmer.municipality}, Mich.
                </p>
              </div>
            </div>

            <nav
              aria-label="Navegación del panel"
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

          <div className="mt-6 hidden rounded-2xl border border-[#e3e8da] bg-[#fbfbf7] p-4 lg:block">
            <p className="text-xs font-semibold text-[#244d36]">
              Estado del prototipo
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#6b7869]">
              Módulo listo para conectarse posteriormente con Drizzle, Neon y
              PostGIS.
            </p>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="space-y-6">
          {activeTab === "resumen" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {DASHBOARD_STATS.map((stat) => (
                  <div
                    key={stat.id}
                    className="rounded-3xl border border-[#dce3d3] bg-white p-5 shadow-[0_8px_24px_-18px_rgba(24,59,43,0.18)]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-[#6f7d6e]">
                        {stat.label}
                      </p>
                      <Badge variant="secondary" className="text-[10px]">
                        {stat.trend}
                      </Badge>
                    </div>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-[#244d36]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-[#7b8677]">{stat.helper}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                {/* Pedidos recientes */}
                <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#183b2b]">
                      Pedidos recientes (Demo)
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab("pedidos")}
                      className="text-xs font-semibold text-[#244d36] hover:underline cursor-pointer"
                    >
                      Ver todos
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {DASHBOARD_ORDERS.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col justify-between gap-3 rounded-2xl border border-[#ebf0e4] bg-[#fbfbf7] p-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-[#71864f]">
                              {order.id}
                            </span>
                            <span className="text-sm font-semibold text-[#183b2b]">
                              {order.businessName}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#647364]">
                            {order.productSummary}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-[11px] text-[#7b8677]">
                            <MapPin className="size-3" />
                            {order.municipality} · {order.requestedDate}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <Badge variant="available">{order.statusLabel}</Badge>
                          <p className="mt-1.5 text-sm font-bold text-[#244d36]">
                            ${order.totalEstimateMxn.toLocaleString("es-MX")} MXN
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actividad reciente */}
                <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
                  <h2 className="text-lg font-semibold text-[#183b2b]">
                    Actividad reciente
                  </h2>
                  <div className="mt-4 space-y-4">
                    {DASHBOARD_ACTIVITY.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 border-b border-[#eff3e9] pb-3.5 last:border-b-0 last:pb-0"
                      >
                        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#dce6d2]/70 text-[#244d36]">
                          <Package className="size-4" weight="duotone" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-[#183b2b]">
                            {activity.title}
                          </p>
                          <p className="mt-0.5 text-xs text-[#647364]">
                            {activity.detail}
                          </p>
                          <p className="mt-1 text-[11px] text-[#7b8677]">
                            {activity.timeAgo}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "productos" && (
            <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
              <div className="flex flex-col justify-between gap-4 border-b border-[#eef2e8] pb-5 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-[#183b2b]">
                    Productos publicados (Muestra)
                  </h2>
                  <p className="mt-1 text-xs text-[#647364]">
                    Vista previa de cómo un agricultor administra sus cosechas.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() =>
                    setDemoMessage(
                      "Acción visual: el alta real de productos se conectará en una siguiente etapa.",
                    )
                  }
                >
                  <Plus className="size-4" />
                  Nuevo producto (Demo)
                </Button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {samplePublished.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 rounded-2xl border border-[#e6ecdd] bg-[#fbfbf7] p-3.5"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={96}
                      height={72}
                      unoptimized
                      className="h-20 w-24 shrink-0 rounded-xl border border-[#e3e8da] object-cover"
                      style={{ backgroundColor: product.backdropColor }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-[#183b2b]">
                          {product.name}
                        </h3>
                        <Badge variant="available" className="text-[10px]">
                          {product.availabilityLabel}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-[#6b7869]">
                        {product.categoryLabel} · {product.municipality}
                      </p>
                      <p className="mt-2 text-sm font-bold text-[#244d36]">
                        ${product.priceMxn} MXN / {product.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "pedidos" && (
            <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
              <div className="border-b border-[#eef2e8] pb-5">
                <h2 className="text-xl font-semibold text-[#183b2b]">
                  Acuerdos y pedidos de demostración
                </h2>
                <p className="mt-1 text-xs text-[#647364]">
                  Seguimiento visual de solicitudes realizadas por comercios
                  compradores. No representa transacciones reales.
                </p>
              </div>

              <div className="mt-5 space-y-3.5">
                {DASHBOARD_ORDERS.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e5ebdc] bg-[#fbfbf7] p-4 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#dce6d2] px-2.5 py-0.5 font-mono text-xs font-semibold text-[#244d36]">
                          {order.id}
                        </span>
                        <h3 className="text-sm font-semibold text-[#183b2b]">
                          {order.businessName}
                        </h3>
                      </div>
                      <p className="text-xs text-[#5d6c5d]">
                        {order.productSummary}
                      </p>
                      <p className="text-xs text-[#7b8677]">
                        Destino: {order.municipality}, Michoacán ·{" "}
                        {order.requestedDate}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <Badge
                        variant={
                          order.status === "pendiente" ? "limited" : "available"
                        }
                      >
                        {order.statusLabel}
                      </Badge>
                      <p className="text-base font-bold text-[#244d36]">
                        ${order.totalEstimateMxn.toLocaleString("es-MX")} MXN
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "perfil" && (
            <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
              <div className="border-b border-[#eef2e8] pb-5">
                <h2 className="text-xl font-semibold text-[#183b2b]">
                  Perfil del productor (Vista previa)
                </h2>
                <p className="mt-1 text-xs text-[#647364]">
                  Formulario ilustrativo de datos de huerta y ubicación en
                  Michoacán.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDemoMessage(
                    "Vista previa: los cambios de perfil no se guardan en esta etapa visual.",
                  );
                }}
                className="mt-5 grid gap-4 sm:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor="dash-name"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Nombre público
                  </label>
                  <Input id="dash-name" defaultValue={demoFarmer.name} />
                </div>
                <div>
                  <label
                    htmlFor="dash-farm"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Huerta / Rancho
                  </label>
                  <Input id="dash-farm" defaultValue={demoFarmer.farmName} />
                </div>
                <div>
                  <label
                    htmlFor="dash-municipality"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Municipio
                  </label>
                  <Input
                    id="dash-municipality"
                    defaultValue={demoFarmer.municipality}
                  />
                </div>
                <div>
                  <label
                    htmlFor="dash-specialty"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Especialidad agrícola
                  </label>
                  <Input
                    id="dash-specialty"
                    defaultValue={demoFarmer.specialty}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="dash-bio"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Descripción breve
                  </label>
                  <Textarea id="dash-bio" defaultValue={demoFarmer.bio} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit">Guardar vista previa (Demo)</Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
