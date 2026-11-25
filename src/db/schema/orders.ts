import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core";

import { businessProfiles } from "./businesses";
import { farmerProfiles } from "./farmers";
import { products } from "./catalog";

export const orderStatusEnum = pgEnum("order_status", [
  "requested",
  "coordination",
  "received",
]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reference: varchar("reference", { length: 32 }).notNull().unique(),

    businessId: uuid("business_id")
      .notNull()
      .references(() => businessProfiles.id, { onDelete: "restrict" }),

    farmerId: uuid("farmer_id")
      .notNull()
      .references(() => farmerProfiles.id, { onDelete: "restrict" }),

    status: orderStatusEnum("status").default("requested").notNull(),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    receivedAt: timestamp("received_at", { withTimezone: true }),
  },
  (table) => [
    index("orders_business_id_idx").on(table.businessId),
    index("orders_farmer_id_idx").on(table.farmerId),
    index("orders_status_idx").on(table.status),
    check("orders_total_positive", sql`${table.total} > 0`),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),

    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),

    productName: varchar("product_name", { length: 150 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    unit: varchar("unit", { length: 50 }).notNull(),
    quantity: integer("quantity").notNull(),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
    check("order_items_quantity_positive", sql`${table.quantity} > 0`),
    check("order_items_unit_price_positive", sql`${table.unitPrice} > 0`),
    check("order_items_subtotal_positive", sql`${table.subtotal} > 0`),
  ],
);
