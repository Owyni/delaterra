import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { FarmerCard } from "@/components/farmers/farmer-card";
import { buttonVariants } from "@/components/ui/button";
import type { PublicFarmerDTO } from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

interface FeaturedFarmersProps {
  farmers: PublicFarmerDTO[];
}

export function FeaturedFarmers({ farmers }: FeaturedFarmersProps) {
  const highlightedFarmers = farmers.slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71864f]">
            Comunidad productora
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b] sm:text-4xl">
            Agricultores de Michoacán
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#647364] sm:text-base">
            Conoce a los productores locales registrados, sus municipios de
            origen y los cultivos disponibles.
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

      {highlightedFarmers.length > 0 ? (
        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {highlightedFarmers.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
      ) : (
        <div className="mt-9 rounded-3xl border border-dashed border-[#cdd7c3] bg-white p-10 text-center">
          <p className="text-base font-semibold text-[#183b2b]">
            Sé de los primeros productores en unirte a Delaterra
          </p>
          <p className="mt-1 text-sm text-[#647364]">
            Registra tu huerta o parcela y empieza a recibir solicitudes
            directas por WhatsApp.
          </p>
        </div>
      )}
    </section>
  );
}
