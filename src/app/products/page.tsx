import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductCatalog } from "@/components/products/product-catalog";

export const metadata: Metadata = {
  title: "Catálogo de productos",
  description:
    "Explora frutas, verduras, hortalizas, legumbres y tubérculos ilustrativos de Michoacán.",
};

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71864f]">
            Marketplace Michoacán · Demostración visual
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b] sm:text-4xl">
            Catálogo agrícola completo
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#647364] sm:text-base">
            Filtra por categoría, municipio de origen o precio ilustrativo para
            descubrir cosechas locales disponibles en la vitrina.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="rounded-3xl border border-[#dce3d3] bg-white p-10 text-center text-sm text-[#6b7869]">
              Cargando catálogo agrícola...
            </div>
          }
        >
          <ProductCatalog />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
