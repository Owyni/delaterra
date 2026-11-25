"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import {
  AuthorizationError,
  requireBusinessContext,
  requireVerifiedUser,
} from "@/lib/auth-session";
import { OrderBusinessError } from "@/lib/orders/domain";
import {
  createOrdersForBusiness,
  transitionOrderStatus,
  type CreatedOrderSummary,
} from "@/lib/services/orders";
import type { CreateOrdersInput, OrderStatus } from "@/lib/validators/orders";

export type OrderActionResult<T = undefined> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string };

function formatOrderError(error: unknown): string {
  if (
    error instanceof AuthorizationError ||
    error instanceof OrderBusinessError
  ) {
    return error.message;
  }
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Revisa los datos del pedido.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "No se pudo procesar el pedido.";
}

export async function createOrdersAction(
  input: CreateOrdersInput,
): Promise<OrderActionResult<CreatedOrderSummary[]>> {
  try {
    const { businessProfile } = await requireBusinessContext();
    const createdOrders = await createOrdersForBusiness({
      businessId: businessProfile.id,
      businessName: businessProfile.businessName,
      businessMunicipality: businessProfile.municipality,
      input,
    });

    revalidatePath("/products");
    revalidatePath("/dashboard");
    revalidatePath("/pedido");

    return {
      ok: true,
      data: createdOrders,
      message:
        createdOrders.length === 1
          ? `Pedido ${createdOrders[0].reference} creado correctamente.`
          : `Se generaron ${createdOrders.length} pedidos independientes (uno por agricultor).`,
    };
  } catch (error) {
    return { ok: false, error: formatOrderError(error) };
  }
}

export async function updateOrderStatusAction(input: {
  orderId: string;
  nextStatus: OrderStatus;
}): Promise<OrderActionResult<{ id: string; status: OrderStatus; receivedAt: string | null }>> {
  try {
    const context = await requireVerifiedUser();

    const updated = await transitionOrderStatus({
      orderId: input.orderId,
      nextStatus: input.nextStatus,
      actorFarmerId: context.farmerProfile?.id ?? null,
      actorBusinessId: context.businessProfile?.id ?? null,
    });

    revalidatePath("/dashboard");

    return {
      ok: true,
      data: {
        id: updated.id,
        status: updated.status,
        receivedAt: updated.receivedAt ? updated.receivedAt.toISOString() : null,
      },
      message:
        updated.status === "received"
          ? "Recepción del pedido confirmada."
          : "Estado del pedido actualizado a En coordinación.",
    };
  } catch (error) {
    return { ok: false, error: formatOrderError(error) };
  }
}
