import "dotenv/config";
import { db } from "./index";
import { categories } from "./schema";
import { DEFAULT_CATEGORY_DEFINITIONS } from "../lib/services/catalog";

async function seedCategories() {
  for (const cat of DEFAULT_CATEGORY_DEFINITIONS) {
    await db
      .insert(categories)
      .values({
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
        accentBg: cat.accentBg,
        active: true,
      })
      .onConflictDoNothing({ target: categories.slug });
  }
  console.log("Categorías iniciales verificadas/insertadas correctamente.");
}

seedCategories()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error al sembrar categorías:", err);
    process.exit(1);
  });
