import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  businessProfiles,
  categories,
  farmerProfiles,
  orderItems,
  orders,
  products,
  users,
} from "@/db/schema";
import {
  assertValidOrderStatusTransition,
  buildWhatsAppOrderLink,
  generateOrderReference,
  groupAndCalculateOrdersByFarmer,
  mergeOrderItemRequests,
  OrderBusinessError,
} from "@/lib/orders/domain";
import {
  createOrdersSchema,
  updateOrderStatusSchema,
  type CreateOrdersInput,
  type OrderStatus,
} from "@/lib/validators/orders";

export interface CreatedOrderSummary {
  id: string;
  reference: string;
  status: OrderStatus;
  total: string;
  notes: string | null;
  createdAt: Date;
  farmer: {
    id: string;
    displayName: string;
    farmName: string | null;
    municipality: string;
    whatsapp: string | null;
    phone: string | null;
  };
  whatsappUrl: string | null;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    unitPrice: string;
    unit: string;
    quantity: number;
    subtotal: string;
  }>;
}

export async function createOrdersForBusiness(params: {
  businessId: string;
  businessName: string;
  businessMunicipality: string;
  input: CreateOrdersInput;
}): Promise<CreatedOrderSummary[]> {
  const parsed = createOrdersSchema.parse(params.input);
  const consolidatedRequests = mergeOrderItemRequests(parsed.items);
  const productIds = consolidatedRequests.map((item) => item.productId);
  const quantityByProductId = new Map(
    consolidatedRequests.map((item) => [item.productId, item.quantity]),
  );

  return db.transaction(async (tx) => {
    const productRows = await tx
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        unit: products.unit,
        availableQuantity: products.availableQuantity,
        active: products.active,
        categoryActive: categories.active,
        farmerId: farmerProfiles.id,
        farmerName: farmerProfiles.displayName,
        farmName: farmerProfiles.farmName,
        farmerMunicipality: farmerProfiles.municipality,
        farmerWhatsapp: farmerProfiles.whatsapp,
        farmerPhone: farmerProfiles.phone,
        farmerUserActive: users.active,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(farmerProfiles, eq(products.farmerId, farmerProfiles.id))
      .innerJoin(users, eq(farmerProfiles.userId, users.id))
      .where(inArray(products.id, productIds))
      .for("update", { of: products });

    if (productRows.length !== productIds.length) {
      throw new OrderBusinessError(
        "Alguno de los productos seleccionados ya no existe en el catálogo.",
        404,
      );
    }

    const farmerMetaById = new Map<
      string,
      {
        id: string;
        displayName: string;
        farmName: string | null;
        municipality: string;
        whatsapp: string | null;
        phone: string | null;
      }
    >();

    const candidates = productRows.map((row) => {
      const requestedQty = quantityByProductId.get(row.id) ?? 0;

      if (!row.active || !row.categoryActive || !row.farmerUserActive) {
        throw new OrderBusinessError(
          `El producto "${row.name}" no se encuentra disponible para compra.`,
          400,
        );
      }

      if (row.availableQuantity < requestedQty) {
        throw new OrderBusinessError(
          `Stock insuficiente para "${row.name}": solicitaste ${requestedQty} ${row.unit}, pero solo hay ${row.availableQuantity} disponibles.`,
          409,
        );
      }

      farmerMetaById.set(row.farmerId, {
        id: row.farmerId,
        displayName: row.farmerName,
        farmName: row.farmName,
        municipality: row.farmerMunicipality,
        whatsapp: row.farmerWhatsapp,
        phone: row.farmerPhone,
      });

      return {
        productId: row.id,
        farmerId: row.farmerId,
        productName: row.name,
        unitPrice: row.price,
        unit: row.unit,
        quantity: requestedQty,
      };
    });

    // Agrupamos estrictamente por agricultor y calculamos totales en servidor
    const orderPlans = groupAndCalculateOrdersByFarmer(candidates);

    // Descontamos existencias atómicamente por producto validando condición >= qty
    for (const reqItem of consolidatedRequests) {
      const updated = await tx
        .update(products)
        .set({
          availableQuantity: sql`${products.availableQuantity} - ${reqItem.quantity}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(products.id, reqItem.productId),
            eq(products.active, true),
            gte(products.availableQuantity, reqItem.quantity),
          ),
        )
        .returning({ id: products.id });

      if (updated.length === 0) {
        throw new OrderBusinessError(
          "El inventario cambió mientras se procesaba tu pedido. Intenta nuevamente.",
          409,
        );
      }
    }

    const createdSummaries: CreatedOrderSummary[] = [];

    for (const plan of orderPlans) {
      const reference = generateOrderReference();
      const [insertedOrder] = await tx
        .insert(orders)
        .values({
          reference,
          businessId: params.businessId,
          farmerId: plan.farmerId,
          status: "requested",
          total: plan.totalDecimal,
          notes: parsed.notes,
        })
        .returning();

      const insertedItems = await tx
        .insert(orderItems)
        .values(
          plan.items.map((item) => ({
            orderId: insertedOrder.id,
            productId: item.productId,
            productName: item.productName,
            unitPrice: item.unitPriceDecimal,
            unit: item.unit,
            quantity: item.quantity,
            subtotal: item.subtotalDecimal,
          })),
        )
        .returning();

      const farmer = farmerMetaById.get(plan.farmerId)!;
      const whatsappUrl = buildWhatsAppOrderLink({
        farmerWhatsapp: farmer.whatsapp,
        farmerName: farmer.displayName,
        orderReference: insertedOrder.reference,
        businessName: params.businessName,
        businessMunicipality: params.businessMunicipality,
        items: insertedItems.map((it) => ({
          productName: it.productName,
          quantity: it.quantity,
          unit: it.unit,
          subtotal: it.subtotal,
        })),
        total: insertedOrder.total,
        notes: insertedOrder.notes,
      });

      createdSummaries.push({
        id: insertedOrder.id,
        reference: insertedOrder.reference,
        status: insertedOrder.status,
        total: insertedOrder.total,
        notes: insertedOrder.notes,
        createdAt: insertedOrder.createdAt,
        farmer,
        whatsappUrl,
        items: insertedItems.map((it) => ({
          id: it.id,
          productId: it.productId,
          productName: it.productName,
          unitPrice: it.unitPrice,
          unit: it.unit,
          quantity: it.quantity,
          subtotal: it.subtotal,
        })),
      });
    }

    return createdSummaries;
  });
}

export async function getOrdersForBusiness(businessId: string) {
  const orderRows = await db
    .select({
      id: orders.id,
      reference: orders.reference,
      status: orders.status,
      total: orders.total,
      notes: orders.notes,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      receivedAt: orders.receivedAt,
      businessName: businessProfiles.businessName,
      businessMunicipality: businessProfiles.municipality,
      farmerId: farmerProfiles.id,
      farmerName: farmerProfiles.displayName,
      farmName: farmerProfiles.farmName,
      farmerMunicipality: farmerProfiles.municipality,
      farmerWhatsapp: farmerProfiles.whatsapp,
      farmerPhone: farmerProfiles.phone,
    })
    .from(orders)
    .innerJoin(businessProfiles, eq(orders.businessId, businessProfiles.id))
    .innerJoin(farmerProfiles, eq(orders.farmerId, farmerProfiles.id))
    .where(eq(orders.businessId, businessId))
    .orderBy(desc(orders.createdAt));

  if (orderRows.length === 0) return [];

  const orderIds = orderRows.map((o) => o.id);
  const itemRows = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  const itemsByOrderId = new Map<string, typeof itemRows>();
  for (const item of itemRows) {
    const list = itemsByOrderId.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrderId.set(item.orderId, list);
  }

  return orderRows.map((order) => {
    const items = itemsByOrderId.get(order.id) ?? [];
    const whatsappUrl = buildWhatsAppOrderLink({
      farmerWhatsapp: order.farmerWhatsapp,
      farmerName: order.farmerName,
      orderReference: order.reference,
      businessName: order.businessName,
      businessMunicipality: order.businessMunicipality,
      items: items.map((it) => ({
        productName: it.productName,
        quantity: it.quantity,
        unit: it.unit,
        subtotal: it.subtotal,
      })),
      total: order.total,
      notes: order.notes,
    });

    return {
      ...order,
      items,
      whatsappUrl,
    };
  });
}

export async function getOrdersForFarmer(farmerId: string) {
  const orderRows = await db
    .select({
      id: orders.id,
      reference: orders.reference,
      status: orders.status,
      total: orders.total,
      notes: orders.notes,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      receivedAt: orders.receivedAt,
      businessId: businessProfiles.id,
      businessName: businessProfiles.businessName,
      businessType: businessProfiles.businessType,
      businessMunicipality: businessProfiles.municipality,
      businessPhone: businessProfiles.phone,
    })
    .from(orders)
    .innerJoin(businessProfiles, eq(orders.businessId, businessProfiles.id))
    .where(eq(orders.farmerId, farmerId))
    .orderBy(desc(orders.createdAt));

  if (orderRows.length === 0) return [];

  const orderIds = orderRows.map((o) => o.id);
  const itemRows = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  const itemsByOrderId = new Map<string, typeof itemRows>();
  for (const item of itemRows) {
    const list = itemsByOrderId.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrderId.set(item.orderId, list);
  }

  return orderRows.map((order) => ({
    ...order,
    items: itemsByOrderId.get(order.id) ?? [],
  }));
}

export async function transitionOrderStatus(params: {
  orderId: string;
  nextStatus: OrderStatus;
  actorFarmerId: string | null;
  actorBusinessId: string | null;
}) {
  const parsed = updateOrderStatusSchema.parse({
    orderId: params.orderId,
    nextStatus: params.nextStatus,
  });

  const [existing] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, parsed.orderId))
    .limit(1);

  if (!existing) {
    throw new OrderBusinessError("El pedido no existe.", 404);
  }

  const isOrderBusinessOwner =
    params.actorBusinessId !== null &&
    existing.businessId === params.actorBusinessId;
  const isOrderFarmerOwner =
    params.actorFarmerId !== null &&
    existing.farmerId === params.actorFarmerId;

  assertValidOrderStatusTransition({
    currentStatus: existing.status,
    nextStatus: parsed.nextStatus,
    isOrderBusinessOwner,
    isOrderFarmerOwner,
  });

  const now = new Date();
  const [updated] = await db
    .update(orders)
    .set({
      status: parsed.nextStatus,
      updatedAt: now,
      receivedAt: parsed.nextStatus === "received" ? now : existing.receivedAt,
    })
    .where(
      and(
        eq(orders.id, parsed.orderId),
        eq(orders.status, existing.status),
      ),
    )
    .returning();

  if (!updated) {
    throw new OrderBusinessError(
      "El estado del pedido cambió simultáneamente. Recarga e intenta de nuevo.",
      409,
    );
  }

  return updated;
}
