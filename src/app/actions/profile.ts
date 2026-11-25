"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

import { db } from "@/db";
import { businessProfiles, farmerProfiles, users } from "@/db/schema";
import {
  AuthorizationError,
  requireBusinessContext,
  requireFarmerContext,
} from "@/lib/auth-session";
import {
  updateBusinessProfileSchema,
  updateFarmerProfileSchema,
} from "@/lib/validators/auth";

export type ProfileActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

function formatProfileError(error: unknown): string {
  if (error instanceof AuthorizationError) return error.message;
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Revisa los datos del perfil.";
  }
  if (error instanceof Error) return error.message;
  return "No se pudo actualizar el perfil.";
}

export async function updateFarmerProfileAction(input: {
  displayName: string;
  farmName?: string;
  specialty?: string;
  phone: string;
  whatsapp: string;
  municipality: string;
  description?: string;
}): Promise<ProfileActionResult> {
  try {
    const { user, farmerProfile } = await requireFarmerContext();
    const parsed = updateFarmerProfileSchema.parse(input);
    const now = new Date();

    await db.transaction(async (tx) => {
      await tx
        .update(farmerProfiles)
        .set({
          displayName: parsed.displayName,
          farmName: parsed.farmName,
          specialty: parsed.specialty,
          phone: parsed.phone,
          whatsapp: parsed.whatsapp,
          municipality: parsed.municipality,
          description: parsed.description,
          updatedAt: now,
        })
        .where(eq(farmerProfiles.id, farmerProfile.id));

      await tx
        .update(users)
        .set({ name: parsed.displayName, updatedAt: now })
        .where(eq(users.id, user.id));
    });

    revalidatePath("/dashboard");
    revalidatePath("/farmers");
    revalidatePath("/products");

    return { ok: true, message: "Perfil de agricultor actualizado." };
  } catch (error) {
    return { ok: false, error: formatProfileError(error) };
  }
}

export async function updateBusinessProfileAction(input: {
  businessName: string;
  businessType: string;
  phone: string;
  municipality: string;
  description?: string;
}): Promise<ProfileActionResult> {
  try {
    const { user, businessProfile } = await requireBusinessContext();
    const parsed = updateBusinessProfileSchema.parse(input);
    const now = new Date();

    await db.transaction(async (tx) => {
      await tx
        .update(businessProfiles)
        .set({
          businessName: parsed.businessName,
          businessType: parsed.businessType,
          phone: parsed.phone,
          municipality: parsed.municipality,
          description: parsed.description,
          updatedAt: now,
        })
        .where(eq(businessProfiles.id, businessProfile.id));

      await tx
        .update(users)
        .set({ name: parsed.businessName, updatedAt: now })
        .where(eq(users.id, user.id));
    });

    revalidatePath("/dashboard");

    return { ok: true, message: "Perfil del negocio actualizado." };
  } catch (error) {
    return { ok: false, error: formatProfileError(error) };
  }
}
