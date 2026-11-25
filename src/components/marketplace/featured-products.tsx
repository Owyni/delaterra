"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Basket } from "@phosphor-icons/react";
import { ProductCard } from "@/components/products/product-card";
import { buttonVariants } from "@/components/ui/button";
import type {
  PublicCategoryDTO,
  PublicProductDTO,
} from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

interface FeaturedProductsProps {
  products: PublicProductDTO[];
  categories: PublicCategoryDTO[];
}

export function FeaturedProducts({
  products,
  categories,
}: FeaturedProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const visibleProducts =
    selectedCategory === "all"
      ? products.slice(0, 8)
      : products
          .filter((product) => product.categorySlug === selectedCategory)
          .slice(0, 8);

  return (
    <section className="border-y border-[#e2e7d8] bg-[#fbfbf7]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dce6d2]/80 px-3.5 py-1 text-xs font-semibold text-[#244d36]">
              <Basket className="size-3.5 text-[#71864f]" weight="duotone" />
              Catálogo de temporada
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b] sm:text-4xl">
              Productos frescos del campo michoacano
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#647364] sm:text-base">
              Oferta publicada directamente por agricultores registrados en
              Michoacán. Selecciona cualquier producto para ver su ficha y
              solicitar un pedido.
            </p>
          </div>

          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "self-start border-[#c5d1bb] text-[#244d36] lg:self-auto",
            )}
          >
            Filtrar en catálogo completo
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div
          role="tablist"
          aria-label="Filtrar vitrina por categoría"
          className="mt-8 flex flex-wrap gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer sm:text-sm",
              selectedCategory === "all"
                ? "bg-[#244d36] text-white shadow-xs"
                : "border border-[#d9e0d0] bg-white text-[#465947] hover:bg-[#dce6d2]/50",
            )}
          >
            Todos ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.categorySlug === cat.slug,
            ).length;
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer sm:text-sm",
                  active
                    ? "bg-[#244d36] text-white shadow-xs"
                    : "border border-[#d9e0d0] bg-white text-[#465947] hover:bg-[#dce6d2]/50",
                )}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {visibleProducts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-[#cdd7c3] bg-white p-10 text-center">
            <p className="text-base font-semibold text-[#183b2b]">
              Aún no hay productos publicados en esta categoría
            </p>
            <p className="mt-1 text-sm text-[#647364]">
              ¿Eres productor de Michoacán? Regístrate como agricultor para
              publicar tu cosecha.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
