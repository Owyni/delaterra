import { AsyncLocalStorage } from "node:async_hooks";
import { betterAuth, APIError } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import * as schema from "@/db/schema";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/lib/email";

export type RegistrationContext = {
  role: "farmer" | "business";
};

export const registrationContextStorage =
  new AsyncLocalStorage<RegistrationContext>();

function resolveBaseUrl(): string | undefined {
  return (
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    undefined
  );
}

export const auth = betterAuth({
  appName: "Delaterra",
  baseURL: resolveBaseUrl(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    transaction: true,
  }),
  user: {
    modelName: "users",
    additionalFields: {
      role: {
        type: ["farmer", "business", "admin"],
        required: true,
        defaultValue: "business",
        input: false,
      },
      active: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: false,
      },
    },
  },
  session: {
    modelName: "sessions",
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        url,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: user.email,
        name: user.name,
        url,
      });
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ctx = registrationContextStorage.getStore();
          if (!ctx) {
            throw new APIError("BAD_REQUEST", {
              message:
                "Utiliza el registro de Delaterra para seleccionar tu tipo de cuenta (agricultor o negocio).",
            });
          }

          return {
            data: {
              ...user,
              role: ctx.role,
              active: true,
            },
          };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const found = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, session.userId),
            columns: { active: true, emailVerified: true },
          });

          if (!found || !found.active) {
            throw new APIError("FORBIDDEN", {
              message: "Tu cuenta está desactivada. Contacta al soporte.",
            });
          }

          if (!found.emailVerified) {
            throw new APIError("FORBIDDEN", {
              message:
                "Debes verificar tu correo electrónico antes de iniciar sesión.",
            });
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
});
