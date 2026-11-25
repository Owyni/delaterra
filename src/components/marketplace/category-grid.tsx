import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import type { PublicCategoryDTO } from "@/lib/services/catalog";

interface CategoryGridProps {
  categories: PublicCategoryDTO[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section
      id="categorias"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71864f]">
            Explora por tipo de cultivo
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b] sm:text-4xl">
            Categorías agrícolas
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#647364] sm:text-base">
            Desde huertas de fruta fresca hasta legumbres y granos regionales,
            organizados para facilitar el abasto de tu comercio.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#244d36] transition hover:text-[#71864f]"
        >
          Ver catálogo completo
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?categoria=${category.slug}`}
            className="group flex items-center gap-4 rounded-3xl border border-[#e0e6d6] bg-white p-4 shadow-[0_6px_24px_-16px_rgba(24,59,43,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b9c8ac] hover:shadow-[0_18px_36px_-22px_rgba(24,59,43,0.28)]"
          >
            <div
              className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border border-[#e7ece0]"
              style={{ backgroundColor: category.accentBg || "#EAF1E3" }}
            >
              <Image
                src={category.imageUrl || "/images/categories/otros.svg"}
                alt={category.name}
                width={320}
                height={220}
                unoptimized
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-[#183b2b] transition-colors group-hover:text-[#244d36]">
                  {category.name}
                </h3>
                <ArrowRight className="size-4 shrink-0 text-[#71864f] transition-transform duration-200 group-hover:translate-x-1" />
              </div>
              {category.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#6b7869]">
                  {category.description}
                </p>
              )}
              <p className="mt-2 inline-block rounded-full bg-[#f6f5ed] px-2.5 py-0.5 text-[11px] font-medium text-[#5c6e58]">
                {category.activeProductCount}{" "}
                {category.activeProductCount === 1 ? "producto" : "productos"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
