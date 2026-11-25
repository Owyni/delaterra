import { Suspense } from "react";
import { connection } from "next/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/marketplace/hero-section";
import { CategoryGrid } from "@/components/marketplace/category-grid";
import { FeaturedProducts } from "@/components/marketplace/featured-products";
import { FeaturedFarmers } from "@/components/marketplace/featured-farmers";
import { HowItWorks } from "@/components/marketplace/how-it-works";
import { BenefitsSection } from "@/components/marketplace/benefits-section";
import { loadPublicCatalogData } from "@/lib/services/public-loader";

async function MarketplaceDynamicSections() {
  await connection();
  const { categories, products, farmers } = await loadPublicCatalogData();

  return (
    <>
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={products} categories={categories} />
      <FeaturedFarmers farmers={farmers} />
    </>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed] text-[#183b2b]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <Suspense
          fallback={
            <div className="mx-auto w-full max-w-7xl px-4 py-16 text-center text-sm text-[#647364]">
              Cargando catálogo agrícola de Michoacán...
            </div>
          }
        >
          <MarketplaceDynamicSections />
        </Suspense>
        <HowItWorks />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
