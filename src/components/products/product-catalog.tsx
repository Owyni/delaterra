"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Funnel,
  MagnifyingGlass,
  MapPin,
  SortAscending,
  X,
} from "@phosphor-icons/react";
import { CATEGORIES } from "@/data/categories";
import { MUNICIPALITIES } from "@/data/farmers";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/types";

type SortOption = "relevancia" | "precio_asc" | "precio_desc" | "proximidad";

export function ProductCatalog() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const paramCategory = searchParams.get("categoria");
  const validInitialCategory: CategorySlug | "all" = CATEGORIES.some(
    (c) => c.slug === paramCategory,
  )
    ? (paramCategory as CategorySlug)
    : "all";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<
    CategorySlug | "all"
  >(validInitialCategory);
  const [selectedMunicipality, setSelectedMunicipality] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevancia");

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesMunicipality =
        selectedMunicipality === "all" ||
        product.municipality === selectedMunicipality;
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q) ||
        product.municipality.toLowerCase().includes(q) ||
        product.farmerName.toLowerCase().includes(q);

      return matchesCategory && matchesMunicipality && matchesQuery;
    });

    const sorted = [...list];
    switch (sortBy) {
      case "precio_asc":
        sorted.sort((a, b) => a.priceMxn - b.priceMxn);
        break;
      case "precio_desc":
        sorted.sort((a, b) => b.priceMxn - a.priceMxn);
        break;
      case "proximidad":
        sorted.sort((a, b) => a.distanceKmMock - b.distanceKmMock);
        break;
      default:
        sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategory, selectedMunicipality, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedMunicipality !== "all" ||
    sortBy !== "relevancia";

  function resetFilters() {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedMunicipality("all");
    setSortBy("relevancia");
  }

  return (
    <div className="space-y-8">
      {/* Barra de filtros */}
      <div className="rounded-3xl border border-[#dce3d3] bg-white p-5 shadow-[0_10px_30px_-22px_rgba(24,59,43,0.2)] sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <label
              htmlFor="catalog-search"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#475b49]"
            >
              <MagnifyingGlass className="size-3.5 text-[#71864f]" />
              Buscar producto o productor
            </label>
            <Input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ej. Aguacate, jitomate, Uruapan..."
            />
          </div>

          <div>
            <label
              htmlFor="catalog-category"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#475b49]"
            >
              <Funnel className="size-3.5 text-[#71864f]" />
              Categoría
            </label>
            <Select
              id="catalog-category"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as CategorySlug | "all")
              }
            >
              <option value="all">Todas las categorías</option>
              {CATEGORIES.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label
              htmlFor="catalog-municipality"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#475b49]"
            >
              <MapPin className="size-3.5 text-[#71864f]" />
              Municipio de origen
            </label>
            <Select
              id="catalog-municipality"
              value={selectedMunicipality}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
            >
              <option value="all">Todos los municipios</option>
              {MUNICIPALITIES.map((municipality) => (
                <option key={municipality} value={municipality}>
                  {municipality}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label
              htmlFor="catalog-sort"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#475b49]"
            >
              <SortAscending className="size-3.5 text-[#71864f]" />
              Ordenar (visual)
            </label>
            <Select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="relevancia">Destacados primero</option>
              <option value="precio_asc">Menor precio ilustrativo</option>
              <option value="precio_desc">Mayor precio ilustrativo</option>
              <option value="proximidad">Proximidad simulada (km)</option>
            </Select>
          </div>
        </div>

        {/* Chips rápidos de categoría */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#eef2e8] pt-4">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
              selectedCategory === "all"
                ? "bg-[#244d36] text-white"
                : "bg-[#f6f5ed] text-[#495c4a] hover:bg-[#dce6d2]",
            )}
          >
            Todas
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setSelectedCategory(category.slug)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer",
                selectedCategory === category.slug
                  ? "bg-[#244d36] text-white"
                  : "bg-[#f6f5ed] text-[#495c4a] hover:bg-[#dce6d2]",
              )}
            >
              {category.name}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-[#d6ddd0] px-3 py-1.5 text-xs font-medium text-[#5e6d5d] transition hover:bg-[#f6f5ed] hover:text-[#183b2b] cursor-pointer"
            >
              <X className="size-3.5" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Resumen de resultados */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#617061]">
        <p>
          Mostrando{" "}
          <span className="font-semibold text-[#183b2b]">
            {filteredProducts.length}
          </span>{" "}
          de {PRODUCTS.length} productos ilustrativos
        </p>
        <p className="text-xs text-[#7b8677]">
          Ordenamiento por proximidad basado en distancias de muestra
        </p>
      </div>

      {/* Cuadrícula de productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#cdd7c3] bg-white/80 px-6 py-14 text-center">
          <p className="text-lg font-semibold text-[#183b2b]">
            No encontramos productos con esos filtros
          </p>
          <p className="mt-2 text-sm text-[#6d7a6b]">
            Prueba ajustando el municipio, la categoría o limpiando la búsqueda.
          </p>
          <Button onClick={resetFilters} variant="secondary" className="mt-5">
            Mostrar todos los productos
          </Button>
        </div>
      )}
    </div>
  );
}
