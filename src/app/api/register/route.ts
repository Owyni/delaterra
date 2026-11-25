import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { APIError } from "better-auth";

import { db } from "@/db";
import { businessProfiles, farmerProfiles, users } from "@/db/schema";
import { auth, registrationContextStorage } from "@/lib/auth";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no es un JSON válido." },
      { status: 400 },
    );
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: firstIssue?.message ?? "Revisa los campos del formulario.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const displayOrBusinessName =
    data.accountType === "farmer" ? data.displayName : data.businessName;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Ya existe una cuenta registrada con este correo electrónico." },
      { status: 409 },
    );
  }

  let createdUserId: string | null = null;

  try {
    const result = await registrationContextStorage.run(
      { role: data.accountType },
      async () =>
        auth.api.signUpEmail({
          body: {
            email: data.email,
            password: data.password,
            name: displayOrBusinessName,
            callbackURL: "/verify-email?verified=1",
          },
          headers: request.headers,
        }),
    );

    createdUserId = result.user.id;

    if (data.accountType === "farmer") {
      await db.insert(farmerProfiles).values({
        userId: result.user.id,
        displayName: data.displayName,
        farmName: data.farmName ?? null,
        specialty: data.specialty ?? null,
        phone: data.phone,
        whatsapp: data.whatsapp,
        municipality: data.municipality,
        description: data.description ?? null,
      });
    } else {
      await db.insert(businessProfiles).values({
        userId: result.user.id,
        businessName: data.businessName,
        businessType: data.businessType,
        phone: data.phone,
        municipality: data.municipality,
        description: data.description ?? null,
      });
    }

    return NextResponse.json(
      {
        ok: true,
        email: result.user.email,
        accountType: data.accountType,
        message:
          "Cuenta creada. Te enviamos un correo electrónico con el enlace para verificar tu dirección.",
      },
      { status: 201 },
    );
  } catch (error) {
    // Limpieza compensatoria si se creó el usuario pero falló el perfil o el envío del correo
    if (createdUserId) {
      await db
        .delete(users)
        .where(eq(users.id, createdUserId))
        .catch(() => undefined);
    } else {
      const [orphan] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1)
        .catch(() => []);
      if (orphan) {
        await db
          .delete(users)
          .where(eq(users.id, orphan.id))
          .catch(() => undefined);
      }
    }

    if (error instanceof APIError) {
      return NextResponse.json(
        { error: error.message || "No fue posible completar el registro." },
        { status: error.statusCode || 400 },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado al registrar la cuenta.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
