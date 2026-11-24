import {
  pgTable,
  uuid,
  timestamp,
  geometry,
  index,
} from "drizzle-orm/pg-core";

import { farmerProfiles } from "./farmers";
import { businessProfiles } from "./businesses";

export const farmerLocations = pgTable(
  "farmer_locations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    farmerId: uuid("farmer_id")
      .notNull()
      .unique()
      .references(() => farmerProfiles.id, { onDelete: "cascade" }),

    coordinates: geometry("coordinates", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("farmer_locations_coordinates_idx").using("gist", table.coordinates),
  ],
);

export const businessLocations = pgTable(
  "business_locations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    businessId: uuid("business_id")
      .notNull()
      .unique()
      .references(() => businessProfiles.id, { onDelete: "cascade" }),

    coordinates: geometry("coordinates", {
      type: "point",
      mode: "xy",
      srid: 4326,
    }).notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("business_locations_coordinates_idx").using("gist", table.coordinates),
  ],
);
