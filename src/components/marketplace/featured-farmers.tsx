import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { FARMERS } from "@/data/farmers";
import { PRODUCTS } from "@/data/products";
import { FarmerCard } from "@/components/farmers/farmer-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeaturedFarmers() {
  const highlightedFarmers = FARMERS.slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71864f]">
            Comunidad productora (Demo)
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b] sm:text-4xl">
            Agricultores destacados de Michoacán
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#647364] sm:text-base">
            Conoce perfiles ilustrativos de productores locales, sus municipios
            de origen y los cultivos en los que se especializan.
          </p>
        </div>

        <Link
          href="/farmers"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "self-start border-[#c5d1bb] text-[#244d36] sm:self-auto",
          )}
        >
          Ver directorio completo
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {highlightedFarmers.map((farmer) => {
          const count = PRODUCTS.filter((p) => p.farmerId === farmer.id).length;
          return (
            <FarmerCard key={farmer.id} farmer={farmer} productCount={count} />
          );
        })}
      </div>
    </section>
  );
}
