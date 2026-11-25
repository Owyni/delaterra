import { and, asc, desc, eq, gt, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { categories, farmerProfiles, products, users } from "@/db/schema";
import { AuthorizationError } from "@/lib/auth-session";
import {
  createProductSchema,
  toggleProductActiveSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/lib/validators/catalog";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const DEFAULT_CATEGORY_DEFINITIONS = [
  {
    slug: "frutas",
    name: "Frutas",
    description:
      "Aguacate, cítricos, berries y fruta tropical cosechada en huertas michoacanas.",
    imageUrl: "/images/categories/frutas.svg",
    accentBg: "#EAF1E3",
  },
  {
    slug: "verduras",
    name: "Verduras",
    description:
      "Jitomate, pepino, calabacita y brócoli de corte reciente para cocinas y comercios.",
    imageUrl: "/images/categories/verduras.svg",
    accentBg: "#E6EFE2",
  },
  {
    slug: "hortalizas",
    name: "Hortalizas",
    description:
      "Cebolla blanca, chiles, zanahoria y lechuga de riego limpio y selección uniforme.",
    imageUrl: "/images/categories/hortalizas.svg",
    accentBg: "#EDF2E3",
  },
  {
    slug: "legumbres",
    name: "Legumbres",
    description:
      "Frijol, garbanzo y lenteja cribados de grano limpio listos para abasto por bulto.",
    imageUrl: "/images/categories/legumbres.svg",
    accentBg: "#F3EFE2",
  },
  {
    slug: "tuberculos",
    name: "Tubérculos",
    description:
      "Papa y camote de tierra fértil con buena conservación para distribución regional.",
    imageUrl: "/images/categories/tuberculos.svg",
    accentBg: "#F2ECE3",
  },
  {
    slug: "otros",
    name: "Otros productos agrícolas",
    description:
      "Granos regionales como maíz blanco criollo y cosechas complementarias de temporada.",
    imageUrl: "/images/categories/otros.svg",
    accentBg: "#EBEFE4",
  },
] as const;

export interface PublicProductDTO {
  id: string;
  name: string;
  description: string;
  priceMxn: number;
  unit: string;
  availableQuantity: number;
  imageUrl: string;
  backdropColor: string;
  minOrderNote: string | null;
  harvestSeason: string | null;
  packaging: string | null;
  qualityGrade: string | null;
  active: boolean;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  farmerId: string;
  farmerName: string;
  farmName: string | null;
  municipality: string;
  createdAt: Date;
}

export interface PublicCategoryDTO {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  accentBg: string | null;
  activeProductCount: number;
}

export interface PublicFarmerDTO {
  id: string;
  displayName: string;
  farmName: string | null;
  specialty: string | null;
  description: string | null;
  municipality: string;
  state: string;
  activeProductCount: number;
}

export async function getActiveCategories(): Promise<PublicCategoryDTO[]> {
  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      description: categories.description,
      imageUrl: categories.imageUrl,
      accentBg: categories.accentBg,
      activeProductCount: sql<number>`coalesce(count(${products.id}) filter (where ${products.active} = true), 0)::int`,
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .where(eq(categories.active, true))
    .groupBy(categories.id)
    .orderBy(asc(categories.name));

  return rows;
}

export interface ProductCatalogFilters {
  query?: string;
  categorySlug?: string;
  municipality?: string;
  farmerId?: string;
  sort?: "relevancia" | "precio_asc" | "precio_desc" | "recientes";
}

export async function getPublicProducts(
  filters: ProductCatalogFilters = {},
): Promise<PublicProductDTO[]> {
  const conditions = [
    eq(products.active, true),
    eq(categories.active, true),
    eq(users.active, true),
  ];

  if (filters.categorySlug && filters.categorySlug !== "all") {
    conditions.push(eq(categories.slug, filters.categorySlug));
  }

  if (filters.municipality && filters.municipality !== "all") {
    conditions.push(eq(farmerProfiles.municipality, filters.municipality));
  }

  if (filters.farmerId && UUID_REGEX.test(filters.farmerId)) {
    conditions.push(eq(farmerProfiles.id, filters.farmerId));
  }

  const trimmedQuery = filters.query?.trim();
  if (trimmedQuery) {
    const pattern = `%${trimmedQuery}%`;
    conditions.push(
      or(
        ilike(products.name, pattern),
        ilike(categories.name, pattern),
        ilike(farmerProfiles.municipality, pattern),
        ilike(farmerProfiles.displayName, pattern),
      )!,
    );
  }

  const orderByClause =
    filters.sort === "precio_asc"
      ? [asc(products.price), desc(products.createdAt)]
      : filters.sort === "precio_desc"
        ? [desc(products.price), desc(products.createdAt)]
        : [desc(gt(products.availableQuantity, 0)), desc(products.createdAt)];

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      unit: products.unit,
      availableQuantity: products.availableQuantity,
      imageUrl: products.imageUrl,
      backdropColor: products.backdropColor,
      minOrderNote: products.minOrderNote,
      harvestSeason: products.harvestSeason,
      packaging: products.packaging,
      qualityGrade: products.qualityGrade,
      active: products.active,
      categoryId: categories.id,
      categorySlug: categories.slug,
      categoryName: categories.name,
      farmerId: farmerProfiles.id,
      farmerName: farmerProfiles.displayName,
      farmName: farmerProfiles.farmName,
      municipality: farmerProfiles.municipality,
      createdAt: products.createdAt,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(farmerProfiles, eq(products.farmerId, farmerProfiles.id))
    .innerJoin(users, eq(farmerProfiles.userId, users.id))
    .where(and(...conditions))
    .orderBy(...orderByClause);

  return rows.map((row) => ({
    ...row,
    priceMxn: Number(row.price),
  }));
}

export async function getPublicProductById(
  id: string,
): Promise<(PublicProductDTO & { farmerDescription: string | null; farmerSpecialty: string | null }) | null> {
  if (!UUID_REGEX.test(id)) {
    return null;
  }

  const [row] = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      unit: products.unit,
      availableQuantity: products.availableQuantity,
      imageUrl: products.imageUrl,
      backdropColor: products.backdropColor,
      minOrderNote: products.minOrderNote,
      harvestSeason: products.harvestSeason,
      packaging: products.packaging,
      qualityGrade: products.qualityGrade,
      active: products.active,
      categoryId: categories.id,
      categorySlug: categories.slug,
      categoryName: categories.name,
      farmerId: farmerProfiles.id,
      farmerName: farmerProfiles.displayName,
      farmName: farmerProfiles.farmName,
      farmerDescription: farmerProfiles.description,
      farmerSpecialty: farmerProfiles.specialty,
      municipality: farmerProfiles.municipality,
      createdAt: products.createdAt,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(farmerProfiles, eq(products.farmerId, farmerProfiles.id))
    .innerJoin(users, eq(farmerProfiles.userId, users.id))
    .where(
      and(
        eq(products.id, id),
        eq(products.active, true),
        eq(categories.active, true),
        eq(users.active, true),
      ),
    )
    .limit(1);

  if (!row) return null;

  return {
    ...row,
    priceMxn: Number(row.price),
  };
}

export async function getPublicFarmers(filters: {
  query?: string;
  municipality?: string;
} = {}): Promise<PublicFarmerDTO[]> {
  const conditions = [eq(users.active, true)];

  if (filters.municipality && filters.municipality !== "all") {
    conditions.push(eq(farmerProfiles.municipality, filters.municipality));
  }

  const trimmed = filters.query?.trim();
  if (trimmed) {
    const pattern = `%${trimmed}%`;
    conditions.push(
      or(
        ilike(farmerProfiles.displayName, pattern),
        ilike(farmerProfiles.farmName, pattern),
        ilike(farmerProfiles.specialty, pattern),
        ilike(farmerProfiles.municipality, pattern),
      )!,
    );
  }

  return db
    .select({
      id: farmerProfiles.id,
      displayName: farmerProfiles.displayName,
      farmName: farmerProfiles.farmName,
      specialty: farmerProfiles.specialty,
      description: farmerProfiles.description,
      municipality: farmerProfiles.municipality,
      state: farmerProfiles.state,
      activeProductCount: sql<number>`coalesce(count(${products.id}) filter (where ${products.active} = true), 0)::int`,
    })
    .from(farmerProfiles)
    .innerJoin(users, eq(farmerProfiles.userId, users.id))
    .leftJoin(products, eq(products.farmerId, farmerProfiles.id))
    .where(and(...conditions))
    .groupBy(farmerProfiles.id)
    .orderBy(asc(farmerProfiles.displayName));
}

export async function getPublicMunicipalities(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ municipality: farmerProfiles.municipality })
    .from(farmerProfiles)
    .innerJoin(users, eq(farmerProfiles.userId, users.id))
    .where(eq(users.active, true))
    .orderBy(asc(farmerProfiles.municipality));

  return rows.map((r) => r.municipality);
}

export async function getFarmerOwnProducts(farmerId: string) {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      unit: products.unit,
      availableQuantity: products.availableQuantity,
      imageUrl: products.imageUrl,
      backdropColor: products.backdropColor,
      minOrderNote: products.minOrderNote,
      harvestSeason: products.harvestSeason,
      packaging: products.packaging,
      qualityGrade: products.qualityGrade,
      active: products.active,
      categoryId: categories.id,
      categorySlug: categories.slug,
      categoryName: categories.name,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.farmerId, farmerId))
    .orderBy(desc(products.updatedAt));

  return rows.map((row) => ({
    ...row,
    priceMxn: Number(row.price),
  }));
}

export async function createFarmerProduct(
  farmerId: string,
  rawInput: CreateProductInput,
) {
  const parsed = createProductSchema.parse(rawInput);

  const [category] = await db
    .select({ id: categories.id, active: categories.active })
    .from(categories)
    .where(eq(categories.id, parsed.categoryId))
    .limit(1);

  if (!category || !category.active) {
    throw new Error("La categoría seleccionada no existe o no está activa.");
  }

  const [created] = await db
    .insert(products)
    .values({
      farmerId,
      categoryId: parsed.categoryId,
      name: parsed.name,
      description: parsed.description,
      price: parsed.price.toFixed(2),
      unit: parsed.unit,
      availableQuantity: parsed.availableQuantity,
      imageUrl: parsed.imageUrl,
      backdropColor: parsed.backdropColor,
      minOrderNote: parsed.minOrderNote,
      harvestSeason: parsed.harvestSeason,
      packaging: parsed.packaging,
      qualityGrade: parsed.qualityGrade,
      active: parsed.active,
    })
    .returning();

  return created;
}

export async function updateFarmerProduct(
  farmerId: string,
  rawInput: UpdateProductInput,
) {
  const parsed = updateProductSchema.parse(rawInput);

  const [existing] = await db
    .select({ id: products.id, farmerId: products.farmerId })
    .from(products)
    .where(eq(products.id, parsed.id))
    .limit(1);

  if (!existing) {
    throw new AuthorizationError("El producto no existe.", 404);
  }

  if (existing.farmerId !== farmerId) {
    throw new AuthorizationError(
      "No tienes permiso para modificar productos de otro agricultor.",
      403,
    );
  }

  const [category] = await db
    .select({ id: categories.id, active: categories.active })
    .from(categories)
    .where(eq(categories.id, parsed.categoryId))
    .limit(1);

  if (!category || !category.active) {
    throw new Error("La categoría seleccionada no existe o no está activa.");
  }

  const [updated] = await db
    .update(products)
    .set({
      categoryId: parsed.categoryId,
      name: parsed.name,
      description: parsed.description,
      price: parsed.price.toFixed(2),
      unit: parsed.unit,
      availableQuantity: parsed.availableQuantity,
      imageUrl: parsed.imageUrl,
      backdropColor: parsed.backdropColor,
      minOrderNote: parsed.minOrderNote,
      harvestSeason: parsed.harvestSeason,
      packaging: parsed.packaging,
      qualityGrade: parsed.qualityGrade,
      active: parsed.active,
      updatedAt: new Date(),
    })
    .where(and(eq(products.id, parsed.id), eq(products.farmerId, farmerId)))
    .returning();

  return updated;
}

export async function toggleFarmerProductActive(
  farmerId: string,
  rawInput: { id: string; active: boolean },
) {
  const parsed = toggleProductActiveSchema.parse(rawInput);

  const [existing] = await db
    .select({ id: products.id, farmerId: products.farmerId })
    .from(products)
    .where(eq(products.id, parsed.id))
    .limit(1);

  if (!existing) {
    throw new AuthorizationError("El producto no existe.", 404);
  }

  if (existing.farmerId !== farmerId) {
    throw new AuthorizationError(
      "No tienes permiso para modificar productos de otro agricultor.",
      403,
    );
  }

  const [updated] = await db
    .update(products)
    .set({
      active: parsed.active,
      updatedAt: new Date(),
    })
    .where(and(eq(products.id, parsed.id), eq(products.farmerId, farmerId)))
    .returning();

  return updated;
}
