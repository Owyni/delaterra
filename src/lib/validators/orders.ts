import { z } from "zod";

export const ORDER_STATUS_VALUES = [
  "requested",
  "coordination",
  "received",
] as const;

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];

export const orderItemRequestSchema = z.object({
  productId: z.string().uuid("Identificador de producto inválido."),
  quantity: z.coerce
    .number({ message: "La cantidad debe ser un número válido." })
    .int("La cantidad debe ser un número entero.")
    .positive("La cantidad debe ser mayor a 0.")
    .max(100_000, "La cantidad excede el máximo por línea."),
});

export const createOrdersSchema = z.object({
  items: z
    .array(orderItemRequestSchema)
    .min(1, "Agrega al menos un producto para generar el pedido.")
    .max(50, "No puedes incluir más de 50 líneas en una sola solicitud."),
  notes: z
    .string()
    .trim()
    .max(500, "Las notas no pueden exceder 500 caracteres.")
    .optional()
    .transform((val) => (val && val.length > 0 ? val : null)),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid("Identificador de pedido inválido."),
  nextStatus: z.enum(ORDER_STATUS_VALUES),
});

export type OrderItemRequest = z.infer<typeof orderItemRequestSchema>;
export type CreateOrdersInput = z.infer<typeof createOrdersSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
