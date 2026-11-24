"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  MagnifyingGlass,
  MapPin,
  Plant,
  X,
} from "@phosphor-icons/react";
import { FARMERS, MUNICIPALITIES } from "@/data/farmers";
import { PRODUCTS } from "@/data/products";
import { FarmerCard } from "@/components/farmers/farmer-card";
import { ProductCard } from "@/components/products/product-card";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import type { Farmer } from "@/types";

export function FarmersDirectory() {
  const searchParams = useSearchParams();
  const initialFarmerId = searchParams.get("productor");
  const initialFarmer =
    FARMERS.find((f) => f.id === initialFarmerId) ?? null;

  const [query, setQuery] = useState("");
  const [municipality, setMunicipality] = useState("all");
  const [activeFarmer, setActiveFarmer] = useState<Farmer | null>(
    initialFarmer,
  );

  const filteredFarmers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FARMERS.filter((farmer) => {
      const matchesMunicipality =
        municipality === "all" || farmer.municipality === municipality;
      const matchesQuery =
        !q ||
        farmer.name.toLowerCase().includes(q) ||
        farmer.farmName.toLowerCase().includes(q) ||
        farmer.specialty.toLowerCase().includes(q) ||
        farmer.municipality.toLowerCase().includes(q);
      return matchesMunicipality && matchesQuery;
    });
  }, [query, municipality]);

  const activeFarmerProducts = useMemo(() => {
    if (!activeFarmer) return [];
    return PRODUCTS.filter((product) => product.farmerId === activeFarmer.id);
  }, [activeFarmer]);

  return (
    <div className="space-y-8">
      {/* Filtros */}
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
            {MUNICIPALITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Vista detallada del productor seleccionado */}
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
            <Image
              src={activeFarmer.image}
              alt={activeFarmer.name}
              width={160}
              height={160}
              unoptimized
              className="size-28 rounded-3xl border border-[#e3e8da] object-cover"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{activeFarmer.farmName}</Badge>
                <Badge variant="outline">{activeFarmer.region}</Badge>
                <Badge variant="available">Perfil ilustrativo demo</Badge>
              </div>
              <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#183b2b]">
                {activeFarmer.name}
              </h2>
              <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#5d6c5d]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-4 text-[#71864f]" />
                  {activeFarmer.municipality}, Michoacán
                </span>
                <span className="inline-flex items-center gap-1">
                  <Plant className="size-4 text-[#71864f]" />
                  {activeFarmer.specialty}
                </span>
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#647364]">
                {activeFarmer.bio}
              </p>
            </div>
          </div>

          <div className="mt-7 border-t border-[#ebf0e4] pt-6">
            <h3 className="text-base font-semibold text-[#183b2b]">
              Productos publicados por este productor ({activeFarmerProducts.length})
            </h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeFarmerProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cuadrícula de productores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFarmers.map((farmer) => {
          const count = PRODUCTS.filter((p) => p.farmerId === farmer.id).length;
          return (
            <FarmerCard
              key={farmer.id}
              farmer={farmer}
              productCount={count}
              onSelectFarmer={(selected) => setActiveFarmer(selected)}
            />
          );
        })}
      </div>
    </div>
  );
}
