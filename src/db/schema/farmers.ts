import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const farmerProfiles = pgTable("farmer_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  displayName: varchar("display_name", { length: 150 }).notNull(),
  farmName: varchar("farm_name", { length: 150 }),
  specialty: varchar("specialty", { length: 200 }),
  description: text("description"),
  phone: varchar("phone", { length: 20 }),
  // Número de WhatsApp en formato internacional normalizado (ej. +524431234567)
  whatsapp: varchar("whatsapp", { length: 20 }),
  municipality: varchar("municipality", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).default("Michoacán").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
