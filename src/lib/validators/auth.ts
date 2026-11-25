import { z } from "zod";
import { normalizeMexicanWhatsApp, normalizePhone } from "@/lib/phone";

export const MICHOACAN_MUNICIPALITIES = [
  "Apatzingán",
  "Ario",
  "Ciudad Hidalgo",
  "Cotija",
  "Huetamo",
  "Jacona",
  "Jiquilpan",
  "La Piedad",
  "Lázaro Cárdenas",
  "Los Reyes",
  "Maravatío",
  "Morelia",
  "Múgica",
  "Paracho",
  "Pátzcuaro",
  "Puruándiro",
  "Quiroga",
  "Sahuayo",
  "Salvador Escalante",
  "Tacámbaro",
  "Tangancícuaro",
  "Tarímbaro",
  "Tuxpan",
  "Uruapan",
  "Zacapu",
  "Zamora",
  "Zinapécuaro",
  "Zitácuaro",
] as const;

export const BUSINESS_TYPES = [
  "Restaurante",
  "Frutería / Verdulería",
  "Abarrotes / Tienda",
  "Comedor / Cafetería",
  "Mercado / Central de abasto",
  "Distribuidora",
  "Otro",
] as const;

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(128, "La contraseña no puede exceder 128 caracteres.");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Ingresa un correo electrónico válido.")
  .max(255, "El correo es demasiado largo.");

const phoneSchema = z
  .string()
  .trim()
  .min(10, "Ingresa un número de teléfono válido de al menos 10 dígitos.")
  .max(20, "El número de teléfono es demasiado largo.")
  .transform((val, ctx) => {
    const normalized = normalizePhone(val);
    if (!normalized) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ingresa un teléfono válido (ej. 4431234567 o +524431234567).",
      });
      return z.NEVER;
    }
    return normalized;
  });

export const whatsappSchema = z
  .string()
  .trim()
  .min(10, "Ingresa un número de WhatsApp mexicano de 10 dígitos.")
  .max(20, "El número de WhatsApp es demasiado largo.")
  .transform((val, ctx) => {
    const normalized = normalizeMexicanWhatsApp(val);
    if (!normalized) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Ingresa un WhatsApp mexicano válido de 10 dígitos (ej. +524431234567 o 4431234567).",
      });
      return z.NEVER;
    }
    return normalized;
  });

const municipalitySchema = z
  .string()
  .trim()
  .min(2, "Selecciona o ingresa un municipio de Michoacán.")
  .max(100, "El municipio no puede exceder 100 caracteres.");

const optionalDescriptionSchema = z
  .string()
  .trim()
  .max(1000, "La descripción no puede exceder 1000 caracteres.")
  .optional()
  .transform((val) => (val && val.length > 0 ? val : undefined));

export const registerFarmerSchema = z.object({
  accountType: z.literal("farmer"),
  displayName: z
    .string()
    .trim()
    .min(2, "Ingresa tu nombre público (mínimo 2 caracteres).")
    .max(150, "El nombre público no puede exceder 150 caracteres."),
  farmName: z
    .string()
    .trim()
    .max(150, "El nombre de la huerta no puede exceder 150 caracteres.")
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  specialty: z
    .string()
    .trim()
    .max(200, "La especialidad no puede exceder 200 caracteres.")
    .optional()
    .transform((val) => (val && val.length > 0 ? val : undefined)),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  whatsapp: whatsappSchema,
  municipality: municipalitySchema,
  description: optionalDescriptionSchema,
});

export const registerBusinessSchema = z.object({
  accountType: z.literal("business"),
  businessName: z
    .string()
    .trim()
    .min(2, "Ingresa el nombre del negocio (mínimo 2 caracteres).")
    .max(150, "El nombre del negocio no puede exceder 150 caracteres."),
  businessType: z
    .string()
    .trim()
    .min(2, "Selecciona o especifica el tipo de negocio.")
    .max(80, "El tipo de negocio no puede exceder 80 caracteres."),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  municipality: municipalitySchema,
  description: optionalDescriptionSchema,
});

export const registerSchema = z.discriminatedUnion("accountType", [
  registerFarmerSchema,
  registerBusinessSchema,
]);

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export const resendVerificationSchema = z.object({
  email: emailSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "El token de recuperación es requerido."),
  newPassword: passwordSchema,
});

export const updateFarmerProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "El nombre público debe tener al menos 2 caracteres.")
    .max(150),
  farmName: z
    .string()
    .trim()
    .max(150)
    .optional()
    .transform((val) => (val && val.length > 0 ? val : null)),
  specialty: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((val) => (val && val.length > 0 ? val : null)),
  phone: phoneSchema,
  whatsapp: whatsappSchema,
  municipality: municipalitySchema,
  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((val) => (val && val.length > 0 ? val : null)),
});

export const updateBusinessProfileSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "El nombre del negocio debe tener al menos 2 caracteres.")
    .max(150),
  businessType: z.string().trim().min(2).max(80),
  phone: phoneSchema,
  municipality: municipalitySchema,
  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((val) => (val && val.length > 0 ? val : null)),
});
