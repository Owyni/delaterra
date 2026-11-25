"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  MagnifyingGlass,
  MapPin,
  Plant,
  User,
  X,
} from "@phosphor-icons/react";
import { FarmerCard } from "@/components/farmers/farmer-card";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import type { PublicFarmerDTO, PublicProductDTO } from "@/lib/services/catalog";

interface FarmersDirectoryProps {
  farmers: PublicFarmerDTO[];
  products: PublicProductDTO[];
  municipalities: string[];
}

export function FarmersDirectory({
  farmers,
  products,
  municipalities,
}: FarmersDirectoryProps) {
  const searchParams = useSearchParams();
  const initialFarmerId = searchParams.get("productor");
  const initialFarmer =
    farmers.find((f) => f.id === initialFarmerId) ?? null;

  const [query, setQuery] = useState("");
  const [municipality, setMunicipality] = useState("all");
  const [activeFarmer, setActiveFarmer] = useState<PublicFarmerDTO | null>(
    initialFarmer,
  );

  const filteredFarmers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return farmers.filter((farmer) => {
      const matchesMunicipality =
        municipality === "all" || farmer.municipality === municipality;
      const matchesQuery =
        !q ||
        farmer.displayName.toLowerCase().includes(q) ||
        (farmer.farmName ?? "").toLowerCase().includes(q) ||
        (farmer.specialty ?? "").toLowerCase().includes(q) ||
        farmer.municipality.toLowerCase().includes(q);
      return matchesMunicipality && matchesQuery;
    });
  }, [farmers, query, municipality]);

  const activeFarmerProducts = useMemo(() => {
    if (!activeFarmer) return [];
    return products.filter((product) => product.farmerId === activeFarmer.id);
  }, [activeFarmer, products]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-3xl border border-[#dce3d3] bg-white p-5 shadow-[0_10px_30px_-22px_rgba(24,59,43,0.2)] sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <label
            htmlFor="farmer-search"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#475b49]"
          >
            <MagnifyingGlass className="size-3.5 text-[#71864f]" />
            Buscar agricultor, huerta o cultivo
          </label>
          <Input
            id="farmer-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej. Aguacate, Zamora, Huerta Los Pinos..."
          />
        </div>

        <div>
          <label
            htmlFor="farmer-municipality"
            className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#475b49]"
          >
            <MapPin className="size-3.5 text-[#71864f]" />
            Filtrar por municipio
          </label>
          <Select
            id="farmer-municipality"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
          >
            <option value="all">Todos los municipios de Michoacán</option>
            {municipalities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {activeFarmer && (
        <section className="relative rounded-[2rem] border border-[#cad7be] bg-white p-6 shadow-[0_18px_45px_-28px_rgba(24,59,43,0.3)] sm:p-8">
          <button
            type="button"
            aria-label="Cerrar ficha de productor"
            onClick={() => setActiveFarmer(null)}
            className="absolute right-5 top-5 inline-flex size-9 items-center justify-center rounded-full border border-[#dde4d3] bg-[#f6f5ed] text-[#4c5e4b] transition hover:bg-[#dce6d2] cursor-pointer"
          >
            <X className="size-4" />
          </button>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl border border-[#e3e8da] bg-[#eef4ea] text-[#244d36]">
              <User className="size-10" weight="duotone" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {activeFarmer.farmName && (
                  <Badge variant="secondary">{activeFarmer.farmName}</Badge>
                )}
                <Badge variant="available">Productor registrado</Badge>
              </div>
              <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#183b2b]">
                {activeFarmer.displayName}
              </h2>
              <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#5d6c5d]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-4 text-[#71864f]" />
                  {activeFarmer.municipality}, {activeFarmer.state}
                </span>
                {activeFarmer.specialty && (
                  <span className="inline-flex items-center gap-1">
                    <Plant className="size-4 text-[#71864f]" />
                    {activeFarmer.specialty}
                  </span>
                )}
              </p>
              {activeFarmer.description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#647364]">
                  {activeFarmer.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-7 border-t border-[#ebf0e4] pt-6">
            <h3 className="text-base font-semibold text-[#183b2b]">
              Productos publicados por este productor (
              {activeFarmerProducts.length})
            </h3>
            {activeFarmerProducts.length > 0 ? (
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {activeFarmerProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#647364]">
                Este productor aún no tiene productos activos publicados.
              </p>
            )}
          </div>
        </section>
      )}

      {filteredFarmers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFarmers.map((farmer) => (
            <FarmerCard
              key={farmer.id}
              farmer={farmer}
              onSelectFarmer={(selected) => setActiveFarmer(selected)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#cdd7c3] bg-white/80 px-6 py-14 text-center">
          <p className="text-lg font-semibold text-[#183b2b]">
            {farmers.length === 0
              ? "Aún no hay agricultores registrados"
              : "No encontramos agricultores con esos filtros"}
          </p>
          <p className="mt-2 text-sm text-[#6d7a6b]">
            {farmers.length === 0
              ? "Cuando los productores verifiquen su cuenta aparecerán aquí."
              : "Intenta ajustar el municipio o la búsqueda."}
          </p>
        </div>
      )}
    </div>
  );
}
