import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core";

import { farmerProfiles } from "./farmers";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 255 }),
  accentBg: varchar("accent_bg", { length: 20 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    farmerId: uuid("farmer_id")
      .notNull()
      .references(() => farmerProfiles.id, { onDelete: "cascade" }),

    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),

    name: varchar("name", { length: 150 }).notNull(),
    description: text("description").notNull(),

    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    unit: varchar("unit", { length: 50 }).notNull(),
    availableQuantity: integer("available_quantity").default(0).notNull(),

    imageUrl: varchar("image_url", { length: 500 })
      .default("/images/products/aguacate-hass.svg")
      .notNull(),
    backdropColor: varchar("backdrop_color", { length: 20 })
      .default("#EBF2E4")
      .notNull(),

    minOrderNote: varchar("min_order_note", { length: 120 }),
    harvestSeason: varchar("harvest_season", { length: 120 }),
    packaging: varchar("packaging", { length: 150 }),
    qualityGrade: varchar("quality_grade", { length: 150 }),

    active: boolean("active").default(true).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("products_farmer_id_idx").on(table.farmerId),
    index("products_category_id_idx").on(table.categoryId),
    index("products_active_idx").on(table.active),
    check("products_price_positive", sql`${table.price} > 0`),
    check(
      "products_available_quantity_non_negative",
      sql`${table.availableQuantity} >= 0`,
    ),
  ],
);
