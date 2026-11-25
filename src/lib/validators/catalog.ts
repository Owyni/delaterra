import { z } from "zod";

export const PRODUCT_UNITS = [
  "kg",
  "caja",
  "pieza",
  "tonelada",
  "arpilla",
  "bulto",
  "charola",
  "reja",
] as const;

export const PRODUCT_IMAGE_PRESETS = [
  { label: "Aguacate Hass", url: "/images/products/aguacate-hass.svg", color: "#EBF2E4" },
  { label: "Brócoli", url: "/images/products/brocoli.svg", color: "#E6EFE2" },
  { label: "Calabacita", url: "/images/products/calabacita.svg", color: "#E9F1E1" },
  { label: "Camote", url: "/images/products/camote.svg", color: "#F5EAE1" },
  { label: "Cebolla blanca", url: "/images/products/cebolla-blanca.svg", color: "#F3F2EA" },
  { label: "Chile serrano", url: "/images/products/chile-serrano.svg", color: "#E7F0DF" },
  { label: "Fresa", url: "/images/products/fresa.svg", color: "#FBE9E8" },
  { label: "Frijol", url: "/images/products/frijol.svg", color: "#F2ECE3" },
  { label: "Garbanzo", url: "/images/products/garbanzo.svg", color: "#F5EFE1" },
  { label: "Guayaba", url: "/images/products/guayaba.svg", color: "#FBF1DF" },
  { label: "Jitomate", url: "/images/products/jitomate.svg", color: "#FBEAE6" },
  { label: "Lechuga", url: "/images/products/lechuga.svg", color: "#E8F2E2" },
  { label: "Lenteja", url: "/images/products/lenteja.svg", color: "#EFEAE0" },
  { label: "Limón", url: "/images/products/limon.svg", color: "#EEF4DF" },
  { label: "Maíz", url: "/images/products/maiz.svg", color: "#F7F1DD" },
  { label: "Mango", url: "/images/products/mango.svg", color: "#FCEFD8" },
  { label: "Naranja", url: "/images/products/naranja.svg", color: "#FDF1DF" },
  { label: "Papa", url: "/images/products/papa.svg", color: "#F3EDE2" },
  { label: "Papaya", url: "/images/products/papaya.svg", color: "#FCECE1" },
  { label: "Pepino", url: "/images/products/pepino.svg", color: "#E8F1E3" },
  { label: "Plátano", url: "/images/products/platano.svg", color: "#FAF3DA" },
  { label: "Zanahoria", url: "/images/products/zanahoria.svg", color: "#FCECE0" },
] as const;

const safeImageUrlSchema = z
  .string()
  .trim()
  .max(500, "La URL de la imagen es demasiado larga.")
  .refine(
    (val) =>
      val === "" ||
      val.startsWith("/images/") ||
      val.startsWith("https://"),
    "La imagen debe ser una ruta local (/images/...) o una URL segura https://.",
  )
  .transform((val) =>
    val === "" ? "/images/products/aguacate-hass.svg" : val,
  );

const optionalShortText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((val) => (val && val.length > 0 ? val : null));

export const createProductSchema = z.object({
  categoryId: z.string().uuid("Selecciona una categoría válida."),
  name: z
    .string()
    .trim()
    .min(2, "El nombre del producto debe tener al menos 2 caracteres.")
    .max(150, "El nombre no puede exceder 150 caracteres."),
  description: z
    .string()
    .trim()
    .min(10, "Describe el producto con al menos 10 caracteres.")
    .max(2000, "La descripción no puede exceder 2000 caracteres."),
  price: z.coerce
    .number({ message: "Ingresa un precio numérico válido." })
    .finite("El precio debe ser un número válido.")
    .positive("El precio debe ser mayor a $0 MXN.")
    .max(1_000_000, "El precio excede el límite permitido."),
  unit: z
    .string()
    .trim()
    .min(1, "Especifica la unidad de venta (ej. kg, caja, pieza).")
    .max(50, "La unidad de venta no puede exceder 50 caracteres."),
  availableQuantity: z.coerce
    .number({ message: "Ingresa una cantidad numérica válida." })
    .int("La cantidad disponible debe ser un número entero.")
    .min(0, "La cantidad disponible no puede ser negativa.")
    .max(1_000_000, "La cantidad excede el límite permitido."),
  imageUrl: safeImageUrlSchema.default("/images/products/aguacate-hass.svg"),
  backdropColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color de fondo inválido.")
    .default("#EBF2E4"),
  minOrderNote: optionalShortText(120),
  harvestSeason: optionalShortText(120),
  packaging: optionalShortText(150),
  qualityGrade: optionalShortText(150),
  active: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.extend({
  id: z.string().uuid("Identificador de producto inválido."),
});

export const toggleProductActiveSchema = z.object({
  id: z.string().uuid("Identificador de producto inválido."),
  active: z.boolean(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
