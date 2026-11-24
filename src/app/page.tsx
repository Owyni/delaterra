import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/marketplace/hero-section";
import { CategoryGrid } from "@/components/marketplace/category-grid";
import { FeaturedProducts } from "@/components/marketplace/featured-products";
import { FeaturedFarmers } from "@/components/marketplace/featured-farmers";
import { HowItWorks } from "@/components/marketplace/how-it-works";
import { BenefitsSection } from "@/components/marketplace/benefits-section";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed] text-[#183b2b]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
        <FeaturedFarmers />
        <HowItWorks />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
