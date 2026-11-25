"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Basket,
  ChartLineUp,
  CheckCircle,
  MapPin,
  PencilSimple,
  Plus,
  Receipt,
  User,
  UserCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { updateOrderStatusAction } from "@/app/actions/orders";
import {
  createProductAction,
  toggleProductActiveAction,
  updateProductAction,
} from "@/app/actions/products";
import { updateFarmerProfileAction } from "@/app/actions/profile";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import type { FarmerProfileRecord } from "@/lib/auth-session";
import { formatMxn, ORDER_STATUS_META } from "@/lib/orders/domain";
import type { PublicCategoryDTO } from "@/lib/services/catalog";
import type { OrderStatus } from "@/lib/validators/orders";
import { MICHOACAN_MUNICIPALITIES } from "@/lib/validators/auth";
import {
  PRODUCT_IMAGE_PRESETS,
  PRODUCT_UNITS,
} from "@/lib/validators/catalog";
import { cn } from "@/lib/utils";

type FarmerTab = "resumen" | "productos" | "pedidos" | "perfil";

export interface FarmerOwnedProductItem {
  id: string;
  name: string;
  description: string;
  priceMxn: number;
  unit: string;
  availableQuantity: number;
  imageUrl: string;
  backdropColor: string;
  minOrderNote: string | null;
  harvestSeason: string | null;
  packaging: string | null;
  qualityGrade: string | null;
  active: boolean;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
}

export interface FarmerOrderItemView {
  id: string;
  reference: string;
  status: OrderStatus;
  total: string;
  notes: string | null;
  createdAt: Date | string;
  receivedAt: Date | string | null;
  businessName: string;
  businessType: string;
  businessMunicipality: string;
  businessPhone: string | null;
  items: Array<{
    id: string;
    productName: string;
    unitPrice: string;
    unit: string;
    quantity: number;
    subtotal: string;
  }>;
}

interface FarmerDashboardProps {
  profile: FarmerProfileRecord;
  email: string;
  products: FarmerOwnedProductItem[];
  orders: FarmerOrderItemView[];
  categories: PublicCategoryDTO[];
}

const SIDEBAR_ITEMS: {
  id: FarmerTab;
  label: string;
  icon: typeof ChartLineUp;
}[] = [
  { id: "resumen", label: "Resumen de actividad", icon: ChartLineUp },
  { id: "productos", label: "Mis productos", icon: Basket },
  { id: "pedidos", label: "Pedidos recibidos", icon: Receipt },
  { id: "perfil", label: "Perfil", icon: UserCircle },
];

export function FarmerDashboard({
  profile,
  email,
  products,
  orders,
  categories,
}: FarmerDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FarmerTab>("resumen");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Estado del formulario de producto (alta / edición)
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodCategoryId, setProdCategoryId] = useState(
    categories[0]?.id ?? "",
  );
  const [prodPrice, setProdPrice] = useState("");
  const [prodUnit, setProdUnit] = useState<string>(PRODUCT_UNITS[0]);
  const [prodQuantity, setProdQuantity] = useState("10");
  const [prodImageUrl, setProdImageUrl] = useState<string>(
    PRODUCT_IMAGE_PRESETS[0].url,
  );
  const [prodBackdropColor, setProdBackdropColor] = useState<string>(
    PRODUCT_IMAGE_PRESETS[0].color,
  );
  const [prodMinOrder, setProdMinOrder] = useState("");
  const [prodSeason, setProdSeason] = useState("");
  const [prodPackaging, setProdPackaging] = useState("");
  const [prodQuality, setProdQuality] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodActive, setProdActive] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);

  // Estado del formulario de perfil
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [farmName, setFarmName] = useState(profile.farmName ?? "");
  const [specialty, setSpecialty] = useState(profile.specialty ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? "");
  const [municipality, setMunicipality] = useState(profile.municipality);
  const [description, setDescription] = useState(profile.description ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const activeProductsCount = products.filter((p) => p.active).length;
  const openOrdersCount = orders.filter((o) => o.status !== "received").length;

  function openNewProductForm() {
    setEditingId(null);
    setProdName("");
    setProdCategoryId(categories[0]?.id ?? "");
    setProdPrice("");
    setProdUnit(PRODUCT_UNITS[0]);
    setProdQuantity("10");
    setProdImageUrl(PRODUCT_IMAGE_PRESETS[0].url);
    setProdBackdropColor(PRODUCT_IMAGE_PRESETS[0].color);
    setProdMinOrder("");
    setProdSeason("");
    setProdPackaging("");
    setProdQuality("");
    setProdDescription("");
    setProdActive(true);
    setFormOpen(true);
    setFeedback(null);
  }

  function openEditProductForm(product: FarmerOwnedProductItem) {
    setEditingId(product.id);
    setProdName(product.name);
    setProdCategoryId(product.categoryId);
    setProdPrice(String(product.priceMxn));
    setProdUnit(product.unit);
    setProdQuantity(String(product.availableQuantity));
    setProdImageUrl(product.imageUrl);
    setProdBackdropColor(product.backdropColor);
    setProdMinOrder(product.minOrderNote ?? "");
    setProdSeason(product.harvestSeason ?? "");
    setProdPackaging(product.packaging ?? "");
    setProdQuality(product.qualityGrade ?? "");
    setProdDescription(product.description);
    setProdActive(product.active);
    setFormOpen(true);
    setFeedback(null);
  }

  async function handleProductSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingProduct(true);
    setFeedback(null);

    try {
      const payload = {
        categoryId: prodCategoryId,
        name: prodName,
        description: prodDescription,
        price: Number(prodPrice),
        unit: prodUnit,
        availableQuantity: Number.parseInt(prodQuantity, 10),
        imageUrl: prodImageUrl,
        backdropColor: prodBackdropColor,
        minOrderNote: prodMinOrder || null,
        harvestSeason: prodSeason || null,
        packaging: prodPackaging || null,
        qualityGrade: prodQuality || null,
        active: prodActive,
      };

      const result = editingId
        ? await updateProductAction({ ...payload, id: editingId })
        : await createProductAction(payload);

      if (!result.ok) {
        setFeedback({ type: "error", text: result.error });
        return;
      }

      setFeedback({
        type: "success",
        text: result.message || "Producto guardado.",
      });
      setFormOpen(false);
      router.refresh();
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleToggleActive(product: FarmerOwnedProductItem) {
    setBusyProductId(product.id);
    setFeedback(null);
    try {
      const result = await toggleProductActiveAction({
        id: product.id,
        active: !product.active,
      });
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
      setBusyProductId(null);
    }
  }

  async function handleMarkCoordination(orderId: string) {
    setBusyOrderId(orderId);
    setFeedback(null);
    try {
      const result = await updateOrderStatusAction({
        orderId,
        nextStatus: "coordination",
      });
      if (!result.ok) {
        setFeedback({ type: "error", text: result.error });
        return;
      }
      setFeedback({
        type: "success",
        text: result.message || "Pedido marcado en coordinación.",
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
      const result = await updateFarmerProfileAction({
        displayName,
        farmName,
        specialty,
        phone,
        whatsapp,
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
            Panel de agricultor · {profile.displayName}
          </p>
          <p className="text-xs text-[#546754]">
            Administra tus cosechas publicadas, actualiza existencias y da
            seguimiento a los pedidos recibidos ({email}).
          </p>
        </div>
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "shrink-0 bg-white",
          )}
        >
          Ver catálogo público
        </Link>
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
        <aside className="flex flex-col justify-between rounded-3xl border border-[#dce3d3] bg-white p-4 shadow-[0_12px_32px_-24px_rgba(24,59,43,0.22)] lg:min-h-[34rem]">
          <div>
            <div className="flex items-center gap-3 rounded-2xl bg-[#f6f5ed] p-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#dce6d2] text-[#244d36]">
                <User className="size-5" weight="duotone" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#183b2b]">
                  {profile.farmName || profile.displayName}
                </p>
                <p className="truncate text-xs text-[#71864f]">
                  {profile.municipality}, {profile.state}
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
              WhatsApp de coordinación
            </p>
            <p className="mt-1 text-xs text-[#6b7869]">
              {profile.whatsapp || "Agrega tu número en la pestaña Perfil"}
            </p>
          </div>
        </aside>

        <div className="space-y-6">
          {activeTab === "resumen" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-[#dce3d3] bg-white p-5">
                  <p className="text-xs font-medium text-[#6f7d6e]">
                    Productos activos
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#244d36]">
                    {activeProductsCount}
                  </p>
                  <p className="mt-1 text-xs text-[#7b8677]">
                    De {products.length} publicados en total
                  </p>
                </div>

                <div className="rounded-3xl border border-[#dce3d3] bg-white p-5">
                  <p className="text-xs font-medium text-[#6f7d6e]">
                    Pedidos totales
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#244d36]">
                    {orders.length}
                  </p>
                  <p className="mt-1 text-xs text-[#7b8677]">
                    Solicitudes registradas
                  </p>
                </div>

                <div className="rounded-3xl border border-[#dce3d3] bg-white p-5">
                  <p className="text-xs font-medium text-[#6f7d6e]">
                    Pedidos por entregar
                  </p>
                  <p className="mt-3 text-3xl font-bold text-[#244d36]">
                    {openOrdersCount}
                  </p>
                  <p className="mt-1 text-xs text-[#7b8677]">
                    Pendientes de recepción
                  </p>
                </div>

                <div className="rounded-3xl border border-[#dce3d3] bg-white p-5">
                  <p className="text-xs font-medium text-[#6f7d6e]">
                    Municipio base
                  </p>
                  <p className="mt-3 text-xl font-bold text-[#244d36]">
                    {profile.municipality}
                  </p>
                  <p className="mt-1 text-xs text-[#7b8677]">
                    {profile.state}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#183b2b]">
                    Pedidos recientes
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
                                {order.businessName}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[#647364]">
                              {order.items
                                .map(
                                  (it) =>
                                    `${it.quantity} ${it.unit} de ${it.productName}`,
                                )
                                .join(" · ")}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-[11px] text-[#7b8677]">
                              <MapPin className="size-3" />
                              {order.businessMunicipality}
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
                    Aún no tienes pedidos recibidos. Publica tus productos en la
                    pestaña &ldquo;Mis productos&rdquo; para aparecer en el
                    catálogo.
                  </p>
                )}
              </div>
            </>
          )}

          {activeTab === "productos" && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
                <div className="flex flex-col justify-between gap-4 border-b border-[#eef2e8] pb-5 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-[#183b2b]">
                      Mis productos publicados
                    </h2>
                    <p className="mt-1 text-xs text-[#647364]">
                      Solo los productos activos aparecen en el catálogo público.
                    </p>
                  </div>
                  <Button type="button" onClick={openNewProductForm}>
                    <Plus className="size-4" />
                    Publicar producto
                  </Button>
                </div>

                {formOpen && (
                  <form
                    onSubmit={handleProductSubmit}
                    className="mt-6 space-y-4 rounded-3xl border border-[#d6e0cb] bg-[#f6f5ed] p-5"
                  >
                    <h3 className="text-base font-semibold text-[#183b2b]">
                      {editingId
                        ? "Editar producto"
                        : "Publicar nuevo producto"}
                    </h3>

                    {categories.length === 0 && (
                      <p className="rounded-2xl border border-[#e6d5ad] bg-[#fbf5e6] p-3 text-xs text-[#7c5819]">
                        No hay categorías activas en la base de datos. Ejecuta el
                        script de categorías iniciales tras aplicar las
                        migraciones.
                      </p>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="prod-name"
                          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                        >
                          Nombre del producto *
                        </label>
                        <Input
                          id="prod-name"
                          required
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          placeholder="Ej. Aguacate Hass"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="prod-category"
                          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                        >
                          Categoría *
                        </label>
                        <Select
                          id="prod-category"
                          required
                          value={prodCategoryId}
                          onChange={(e) => setProdCategoryId(e.target.value)}
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label
                          htmlFor="prod-price"
                          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                        >
                          Precio (MXN) *
                        </label>
                        <Input
                          id="prod-price"
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          placeholder="58.00"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="prod-unit"
                          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                        >
                          Unidad de venta *
                        </label>
                        <Select
                          id="prod-unit"
                          value={prodUnit}
                          onChange={(e) => setProdUnit(e.target.value)}
                        >
                          {PRODUCT_UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label
                          htmlFor="prod-qty"
                          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                        >
                          Cantidad disponible *
                        </label>
                        <Input
                          id="prod-qty"
                          type="number"
                          min={0}
                          required
                          value={prodQuantity}
                          onChange={(e) => setProdQuantity(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="prod-preset"
                          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                        >
                          Ilustración del catálogo
                        </label>
                        <Select
                          id="prod-preset"
                          value={prodImageUrl}
                          onChange={(e) => {
                            const selected = PRODUCT_IMAGE_PRESETS.find(
                              (p) => p.url === e.target.value,
                            );
                            setProdImageUrl(e.target.value);
                            if (selected) {
                              setProdBackdropColor(selected.color);
                            }
                          }}
                        >
                          {PRODUCT_IMAGE_PRESETS.map((preset) => (
                            <option key={preset.url} value={preset.url}>
                              {preset.label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <label
                          htmlFor="prod-min-order"
                          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                        >
                          Presentación / pedido sugerido (opcional)
                        </label>
                        <Input
                          id="prod-min-order"
                          value={prodMinOrder}
                          onChange={(e) => setProdMinOrder(e.target.value)}
                          placeholder="Ej. Caja de 10 kg"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label
                          htmlFor="prod-season"
                          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                        >
                          Temporada (opcional)
                        </label>
                        <Input
                          id="prod-season"
                          value={prodSeason}
                          onChange={(e) => setProdSeason(e.target.value)}
                          placeholder="Todo el año"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="prod-pack"
                          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                        >
                          Empaque (opcional)
                        </label>
                        <Input
                          id="prod-pack"
                          value={prodPackaging}
                          onChange={(e) => setProdPackaging(e.target.value)}
                          placeholder="Caja ventilada"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="prod-quality"
                          className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                        >
                          Calidad (opcional)
                        </label>
                        <Input
                          id="prod-quality"
                          value={prodQuality}
                          onChange={(e) => setProdQuality(e.target.value)}
                          placeholder="Primera calidad"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="prod-desc"
                        className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                      >
                        Descripción del producto *
                      </label>
                      <Textarea
                        id="prod-desc"
                        required
                        minLength={10}
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        placeholder="Describe variedad, madurez, calibre o condiciones de entrega..."
                      />
                    </div>

                    <label className="flex items-center gap-2 text-xs font-medium text-[#3e5240]">
                      <input
                        type="checkbox"
                        checked={prodActive}
                        onChange={(e) => setProdActive(e.target.checked)}
                        className="size-4 accent-[#244d36]"
                      />
                      Producto activo en el catálogo público
                    </label>

                    <div className="flex flex-wrap gap-2.5">
                      <Button
                        type="submit"
                        disabled={savingProduct || categories.length === 0}
                      >
                        {savingProduct
                          ? "Guardando..."
                          : editingId
                            ? "Guardar cambios"
                            : "Publicar producto"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                )}

                {products.length > 0 ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e6ecdd] bg-[#fbfbf7] p-4"
                      >
                        <div className="flex items-center gap-4">
                          <Image
                            src={product.imageUrl}
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
                              <Badge
                                variant={
                                  product.active ? "available" : "limited"
                                }
                                className="text-[10px]"
                              >
                                {product.active ? "Activo" : "Inactivo"}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs text-[#6b7869]">
                              {product.categoryName} · Stock:{" "}
                              {product.availableQuantity} {product.unit}
                            </p>
                            <p className="mt-1.5 text-sm font-bold text-[#244d36]">
                              {formatMxn(product.priceMxn)} / {product.unit}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 border-t border-[#e6ecdd] pt-3">
                          <Button
                            type="button"
                            size="xs"
                            variant="outline"
                            onClick={() => openEditProductForm(product)}
                          >
                            <PencilSimple className="size-3.5" />
                            Editar
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            variant={
                              product.active ? "destructive" : "secondary"
                            }
                            disabled={busyProductId === product.id}
                            onClick={() => handleToggleActive(product)}
                          >
                            {busyProductId === product.id
                              ? "Actualizando..."
                              : product.active
                                ? "Desactivar"
                                : "Activar"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-[#647364]">
                    Todavía no has publicado productos. Usa el botón
                    &ldquo;Publicar producto&rdquo; para agregar tu primera
                    cosecha.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "pedidos" && (
            <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
              <div className="border-b border-[#eef2e8] pb-5">
                <h2 className="text-xl font-semibold text-[#183b2b]">
                  Pedidos recibidos
                </h2>
                <p className="mt-1 text-xs text-[#647364]">
                  Solo el negocio comprador propietario puede confirmar la
                  recepción final del pedido.
                </p>
              </div>

              {orders.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {orders.map((order) => {
                    const statusMeta = ORDER_STATUS_META[order.status];
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
                              {order.businessName} ({order.businessType})
                            </h3>
                            <p className="text-xs text-[#647364]">
                              {order.businessMunicipality}, Michoacán
                              {order.businessPhone
                                ? ` · Tel: ${order.businessPhone}`
                                : ""}
                            </p>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-lg font-bold text-[#244d36]">
                              {formatMxn(order.total)}
                            </p>
                            {order.receivedAt && (
                              <p className="text-[11px] text-[#5c6e58]">
                                Recibido el{" "}
                                {new Date(order.receivedAt).toLocaleDateString(
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
                            <strong>Notas del comprador:</strong> {order.notes}
                          </p>
                        )}

                        {order.status === "requested" && (
                          <div className="mt-4">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={busyOrderId === order.id}
                              onClick={() => handleMarkCoordination(order.id)}
                            >
                              {busyOrderId === order.id
                                ? "Actualizando..."
                                : "Marcar en coordinación"}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-5 text-sm text-[#647364]">
                  No tienes pedidos registrados todavía.
                </p>
              )}
            </div>
          )}

          {activeTab === "perfil" && (
            <div className="rounded-3xl border border-[#dce3d3] bg-white p-6">
              <div className="border-b border-[#eef2e8] pb-5">
                <h2 className="text-xl font-semibold text-[#183b2b]">
                  Perfil del agricultor
                </h2>
                <p className="mt-1 text-xs text-[#647364]">
                  Mantén actualizado tu número de WhatsApp para recibir
                  coordinación de pedidos.
                </p>
              </div>

              <form
                onSubmit={handleProfileSubmit}
                className="mt-5 grid gap-4 sm:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor="farmer-prof-name"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Nombre público *
                  </label>
                  <Input
                    id="farmer-prof-name"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="farmer-prof-farm"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Huerta / Rancho
                  </label>
                  <Input
                    id="farmer-prof-farm"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="farmer-prof-phone"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Teléfono *
                  </label>
                  <Input
                    id="farmer-prof-phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="farmer-prof-whatsapp"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    WhatsApp (+52XXXXXXXXXX) *
                  </label>
                  <Input
                    id="farmer-prof-whatsapp"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="farmer-prof-mun"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Municipio *
                  </label>
                  <Select
                    id="farmer-prof-mun"
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
                    htmlFor="farmer-prof-spec"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Especialidad agrícola
                  </label>
                  <Input
                    id="farmer-prof-spec"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="farmer-prof-desc"
                    className="mb-1.5 block text-xs font-semibold text-[#3e5240]"
                  >
                    Descripción breve
                  </label>
                  <Textarea
                    id="farmer-prof-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={savingProfile}>
                    {savingProfile ? "Guardando cambios..." : "Guardar perfil"}
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
