"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { AuthorizationError, requireFarmerContext } from "@/lib/auth-session";
import {
  createFarmerProduct,
  toggleFarmerProductActive,
  updateFarmerProduct,
} from "@/lib/services/catalog";
import type { CreateProductInput, UpdateProductInput } from "@/lib/validators/catalog";

export type ActionResult<T = undefined> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string };

function formatActionError(error: unknown): string {
  if (error instanceof AuthorizationError) {
    return error.message;
  }
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Revisa los datos del producto.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error inesperado al guardar el producto.";
}

export async function createProductAction(
  input: CreateProductInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { farmerProfile } = await requireFarmerContext();
    const created = await createFarmerProduct(farmerProfile.id, input);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/farmers");
    revalidatePath("/dashboard");

    return {
      ok: true,
      data: { id: created.id },
      message: "Producto publicado correctamente en el catálogo.",
    };
  } catch (error) {
    return { ok: false, error: formatActionError(error) };
  }
}

export async function updateProductAction(
  input: UpdateProductInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { farmerProfile } = await requireFarmerContext();
    const updated = await updateFarmerProduct(farmerProfile.id, input);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${updated.id}`);
    revalidatePath("/farmers");
    revalidatePath("/dashboard");

    return {
      ok: true,
      data: { id: updated.id },
      message: "Producto actualizado correctamente.",
    };
  } catch (error) {
    return { ok: false, error: formatActionError(error) };
  }
}

export async function toggleProductActiveAction(input: {
  id: string;
  active: boolean;
}): Promise<ActionResult<{ id: string; active: boolean }>> {
  try {
    const { farmerProfile } = await requireFarmerContext();
    const updated = await toggleFarmerProductActive(farmerProfile.id, input);

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${updated.id}`);
    revalidatePath("/farmers");
    revalidatePath("/dashboard");

    return {
      ok: true,
      data: { id: updated.id, active: updated.active },
      message: updated.active
        ? "Producto activado en el catálogo público."
        : "Producto desactivado del catálogo público.",
    };
  } catch (error) {
    return { ok: false, error: formatActionError(error) };
  }
}
