import { Pool } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";

import * as schema from "./schema";

type DelaterraDb = NeonDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __delaterraPool?: Pool;
  __delaterraDb?: DelaterraDb;
};

export function getDb(): DelaterraDb {
  if (globalForDb.__delaterraDb) {
    return globalForDb.__delaterraDb;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no está definida");
  }

  const pool = new Pool({ connectionString });
  const instance = drizzle({ client: pool, schema });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__delaterraPool = pool;
    globalForDb.__delaterraDb = instance;
  }

  return instance;
}

export const db: DelaterraDb = new Proxy({} as DelaterraDb, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export type Database = DelaterraDb;
