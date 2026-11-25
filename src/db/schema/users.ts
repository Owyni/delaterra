import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "farmer",
  "business",
  "admin",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 150 }).default("").notNull(),

  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),

  emailVerified: boolean("email_verified").default(false).notNull(),

  image: text("image"),

  // Conservada como nullable por compatibilidad no destructiva con el esquema inicial;
  // las credenciales activas de contraseña se gestionan en `accounts.password` vía Better Auth.
  passwordHash: varchar("password_hash", { length: 255 }),

  role: userRoleEnum("role").default("business").notNull(),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow().notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow().notNull(),
});
