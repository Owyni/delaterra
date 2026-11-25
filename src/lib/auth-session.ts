import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { businessProfiles, farmerProfiles, users } from "@/db/schema";
import { auth } from "@/lib/auth";

export class AuthorizationError extends Error {
  readonly status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.name = "AuthorizationError";
    this.status = status;
  }
}

export type FarmerProfileRecord = typeof farmerProfiles.$inferSelect;
export type BusinessProfileRecord = typeof businessProfiles.$inferSelect;

export interface AuthenticatedContext {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: "farmer" | "business" | "admin";
    active: boolean;
  };
  farmerProfile: FarmerProfileRecord | null;
  businessProfile: BusinessProfileRecord | null;
}

export async function getCurrentAuthContext(): Promise<AuthenticatedContext | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const [userRow] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
      role: users.role,
      active: users.active,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!userRow || !userRow.active) {
    return null;
  }

  let farmerProfile: FarmerProfileRecord | null = null;
  let businessProfile: BusinessProfileRecord | null = null;

  if (userRow.role === "farmer") {
    const [fp] = await db
      .select()
      .from(farmerProfiles)
      .where(eq(farmerProfiles.userId, userRow.id))
      .limit(1);
    farmerProfile = fp ?? null;
  } else if (userRow.role === "business") {
    const [bp] = await db
      .select()
      .from(businessProfiles)
      .where(eq(businessProfiles.userId, userRow.id))
      .limit(1);
    businessProfile = bp ?? null;
  }

  return {
    user: userRow,
    farmerProfile,
    businessProfile,
  };
}

export async function requirePageAuth(
  nextPath = "/dashboard",
): Promise<AuthenticatedContext> {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  if (!context.user.emailVerified) {
    redirect(`/verify-email?email=${encodeURIComponent(context.user.email)}`);
  }
  return context;
}

export async function requireVerifiedUser(): Promise<AuthenticatedContext> {
  const context = await getCurrentAuthContext();
  if (!context) {
    throw new AuthorizationError("Debes iniciar sesión para continuar.", 401);
  }
  if (!context.user.emailVerified) {
    throw new AuthorizationError(
      "Debes verificar tu correo electrónico para realizar esta acción.",
      403,
    );
  }
  return context;
}

export async function requireFarmerContext(): Promise<
  AuthenticatedContext & { farmerProfile: FarmerProfileRecord }
> {
  const context = await requireVerifiedUser();
  if (context.user.role !== "farmer" || !context.farmerProfile) {
    throw new AuthorizationError(
      "Esta acción está disponible únicamente para agricultores verificados.",
      403,
    );
  }
  return {
    ...context,
    farmerProfile: context.farmerProfile,
  };
}

export async function requireBusinessContext(): Promise<
  AuthenticatedContext & { businessProfile: BusinessProfileRecord }
> {
  const context = await requireVerifiedUser();
  if (context.user.role !== "business" || !context.businessProfile) {
    throw new AuthorizationError(
      "Esta acción está disponible únicamente para negocios compradores verificados.",
      403,
    );
  }
  return {
    ...context,
    businessProfile: context.businessProfile,
  };
}
