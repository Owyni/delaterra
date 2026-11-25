import {
  DEFAULT_CATEGORY_DEFINITIONS,
  getActiveCategories,
  getPublicFarmers,
  getPublicMunicipalities,
  getPublicProducts,
  type PublicCategoryDTO,
  type PublicFarmerDTO,
  type PublicProductDTO,
} from "@/lib/services/catalog";

function buildFallbackCategories(): PublicCategoryDTO[] {
  return DEFAULT_CATEGORY_DEFINITIONS.map((cat) => ({
    id: cat.slug,
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    imageUrl: cat.imageUrl,
    accentBg: cat.accentBg,
    activeProductCount: 0,
  }));
}

export async function loadPublicCatalogData(): Promise<{
  categories: PublicCategoryDTO[];
  products: PublicProductDTO[];
  farmers: PublicFarmerDTO[];
  municipalities: string[];
  dbReady: boolean;
}> {
  try {
    const [categories, products, farmers, municipalities] = await Promise.all([
      getActiveCategories(),
      getPublicProducts(),
      getPublicFarmers(),
      getPublicMunicipalities(),
    ]);

    return {
      categories: categories.length > 0 ? categories : buildFallbackCategories(),
      products,
      farmers,
      municipalities,
      dbReady: true,
    };
  } catch (error) {
    console.warn(
      "[Delaterra] Catálogo pendiente de migración o conexión DB:",
      error instanceof Error ? error.message : error,
    );
    return {
      categories: buildFallbackCategories(),
      products: [],
      farmers: [],
      municipalities: [],
      dbReady: false,
    };
  }
}
