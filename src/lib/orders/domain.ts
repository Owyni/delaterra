import { randomBytes } from "node:crypto";
import { normalizeMexicanWhatsApp, toWhatsAppDigits } from "@/lib/phone";
import type { OrderItemRequest, OrderStatus } from "@/lib/validators/orders";

export class OrderBusinessError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "OrderBusinessError";
    this.status = status;
  }
}

/**
 * Convierte un precio decimal (string o number) a centavos enteros de forma segura.
 */
export function decimalToCents(value: string | number): number {
  const normalized =
    typeof value === "number" ? value.toFixed(2) : value.trim();
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(normalized);
  if (!match) {
    throw new OrderBusinessError(`Monto monetario inválido: ${value}`);
  }
  const whole = Number.parseInt(match[1], 10);
  const fraction = (match[2] ?? "").padEnd(2, "0");
  return whole * 100 + Number.parseInt(fraction, 10);
}

/**
 * Formatea centavos enteros a string decimal con 2 decimales para PostgreSQL numeric(12,2).
 */
export function centsToDecimalString(cents: number): string {
  if (!Number.isInteger(cents) || cents < 0) {
    throw new OrderBusinessError("El total en centavos no es válido.");
  }
  const whole = Math.floor(cents / 100);
  const rem = cents % 100;
  return `${whole}.${String(rem).padStart(2, "0")}`;
}

export function formatMxn(value: string | number): string {
  const numeric = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numeric) ? numeric : 0);
}

/**
 * Genera una referencia única legible para pedidos: DEL-YYYYMMDD-XXXXXX
 */
export function generateOrderReference(now = new Date()): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const suffix = randomBytes(4).toString("hex").toUpperCase().slice(0, 6);
  return `DEL-${year}${month}${day}-${suffix}`;
}

/**
 * Consolida líneas repetidas del mismo producto sumando sus cantidades.
 */
export function mergeOrderItemRequests(
  items: OrderItemRequest[],
): OrderItemRequest[] {
  const merged = new Map<string, number>();
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new OrderBusinessError(
        "Todas las cantidades deben ser enteros positivos.",
      );
    }
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }
  return Array.from(merged.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export interface PricedOrderCandidate {
  productId: string;
  farmerId: string;
  productName: string;
  unitPrice: string;
  unit: string;
  quantity: number;
}

export interface GroupedFarmerOrderPlan {
  farmerId: string;
  totalCents: number;
  totalDecimal: string;
  items: Array<{
    productId: string;
    productName: string;
    unitPriceDecimal: string;
    unit: string;
    quantity: number;
    subtotalCents: number;
    subtotalDecimal: string;
  }>;
}

/**
 * Agrupa productos validados por agricultor y calcula subtotales y totales en el servidor.
 * Garantiza que cada pedido resultante pertenezca exclusivamente a un único agricultor.
 */
export function groupAndCalculateOrdersByFarmer(
  candidates: PricedOrderCandidate[],
): GroupedFarmerOrderPlan[] {
  if (candidates.length === 0) {
    throw new OrderBusinessError("El pedido no contiene productos.");
  }

  const byFarmer = new Map<string, GroupedFarmerOrderPlan>();

  for (const candidate of candidates) {
    if (!Number.isInteger(candidate.quantity) || candidate.quantity <= 0) {
      throw new OrderBusinessError(
        `Cantidad inválida para ${candidate.productName}.`,
      );
    }

    const unitPriceCents = decimalToCents(candidate.unitPrice);
    if (unitPriceCents <= 0) {
      throw new OrderBusinessError(
        `El producto ${candidate.productName} no tiene un precio válido.`,
      );
    }

    const subtotalCents = unitPriceCents * candidate.quantity;
    const line = {
      productId: candidate.productId,
      productName: candidate.productName,
      unitPriceDecimal: centsToDecimalString(unitPriceCents),
      unit: candidate.unit,
      quantity: candidate.quantity,
      subtotalCents,
      subtotalDecimal: centsToDecimalString(subtotalCents),
    };

    const existing = byFarmer.get(candidate.farmerId);
    if (existing) {
      existing.items.push(line);
      existing.totalCents += subtotalCents;
      existing.totalDecimal = centsToDecimalString(existing.totalCents);
    } else {
      byFarmer.set(candidate.farmerId, {
        farmerId: candidate.farmerId,
        totalCents: subtotalCents,
        totalDecimal: centsToDecimalString(subtotalCents),
        items: [line],
      });
    }
  }

  return Array.from(byFarmer.values());
}

export interface OrderTransitionCheck {
  currentStatus: OrderStatus;
  nextStatus: OrderStatus;
  isOrderBusinessOwner: boolean;
  isOrderFarmerOwner: boolean;
}

export function assertValidOrderStatusTransition(
  params: OrderTransitionCheck,
): void {
  const {
    currentStatus,
    nextStatus,
    isOrderBusinessOwner,
    isOrderFarmerOwner,
  } = params;

  if (!isOrderBusinessOwner && !isOrderFarmerOwner) {
    throw new OrderBusinessError(
      "No tienes permiso para modificar este pedido.",
      403,
    );
  }

  if (currentStatus === nextStatus) {
    throw new OrderBusinessError("El pedido ya se encuentra en ese estado.", 400);
  }

  if (currentStatus === "received") {
    throw new OrderBusinessError(
      "Un pedido ya confirmado como recibido no puede cambiar de estado.",
      400,
    );
  }

  if (nextStatus === "requested") {
    throw new OrderBusinessError(
      "No se puede revertir el pedido al estado inicial de solicitud.",
      400,
    );
  }

  if (nextStatus === "received" && !isOrderBusinessOwner) {
    throw new OrderBusinessError(
      "Solamente el negocio comprador propietario puede confirmar la recepción del pedido.",
      403,
    );
  }

  // Transiciones válidas restantes:
  // - requested -> coordination (comprador o agricultor propietario)
  // - requested -> received (solo comprador propietario)
  // - coordination -> received (solo comprador propietario)
}

export interface WhatsAppOrderLinkParams {
  farmerWhatsapp: string | null | undefined;
  farmerName: string;
  orderReference: string;
  businessName: string;
  businessMunicipality?: string | null;
  items: Array<{
    productName: string;
    quantity: number;
    unit: string;
    subtotal: string | number;
  }>;
  total: string | number;
  notes?: string | null;
}

/**
 * Construye un enlace https://wa.me/ con mensaje prellenado para coordinar entrega y pago.
 * Abrir este enlace no modifica automáticamente el estado del pedido.
 */
export function buildWhatsAppOrderLink(
  params: WhatsAppOrderLinkParams,
): string | null {
  if (!params.farmerWhatsapp) return null;

  const normalized = normalizeMexicanWhatsApp(params.farmerWhatsapp);
  if (!normalized) return null;

  const digits = toWhatsAppDigits(normalized);
  const linesText = params.items
    .map(
      (item) =>
        `• ${item.productName}: ${item.quantity} ${item.unit} (${formatMxn(item.subtotal)})`,
    )
    .join("\n");

  const locationPart = params.businessMunicipality
    ? ` (${params.businessMunicipality}, Michoacán)`
    : "";

  const messageParts = [
    `Hola ${params.farmerName}, te contacto desde Delaterra por el pedido *${params.orderReference}*.`,
    `Negocio comprador: ${params.businessName}${locationPart}`,
    "",
    "Detalle del pedido:",
    linesText,
    `Total estimado: ${formatMxn(params.total)}`,
  ];

  if (params.notes) {
    messageParts.push("", `Notas de coordinación: ${params.notes}`);
  }

  messageParts.push(
    "",
    "¿Podemos coordinar disponibilidad, forma de pago y entrega directa?",
  );

  return `https://wa.me/${digits}?text=${encodeURIComponent(messageParts.join("\n"))}`;
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    description: string;
    badgeVariant: "limited" | "seasonal" | "available";
  }
> = {
  requested: {
    label: "Solicitud creada",
    description: "Pedido registrado, pendiente de coordinación por WhatsApp.",
    badgeVariant: "limited",
  },
  coordination: {
    label: "En coordinación",
    description: "Comprador y agricultor están acordando entrega y pago.",
    badgeVariant: "seasonal",
  },
  received: {
    label: "Recibido",
    description: "Recepción confirmada por el negocio comprador.",
    badgeVariant: "available",
  },
};
