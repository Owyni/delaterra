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
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import type {
  PublicCategoryDTO,
  PublicProductDTO,
} from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

type SortOption = "relevancia" | "precio_asc" | "precio_desc" | "recientes";

interface ProductCatalogProps {
  products: PublicProductDTO[];
  categories: PublicCategoryDTO[];
  municipalities: string[];
}

export function ProductCatalog({
  products,
  categories,
  municipalities,
}: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const paramCategory = searchParams.get("categoria");
  const validInitialCategory = categories.some((c) => c.slug === paramCategory)
    ? (paramCategory as string)
    : "all";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(validInitialCategory);
  const [selectedMunicipality, setSelectedMunicipality] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("relevancia");

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.categorySlug === selectedCategory;
      const matchesMunicipality =
        selectedMunicipality === "all" ||
        product.municipality === selectedMunicipality;
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.categoryName.toLowerCase().includes(q) ||
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
      case "recientes":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      default:
        sorted.sort((a, b) => b.availableQuantity - a.availableQuantity);
        break;
    }

    return sorted;
  }, [products, searchQuery, selectedCategory, selectedMunicipality, sortBy]);

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
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
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
              {municipalities.map((municipality) => (
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
              Ordenar por
            </label>
            <Select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="relevancia">Mayor disponibilidad</option>
              <option value="recientes">Más recientes</option>
              <option value="precio_asc">Menor precio</option>
              <option value="precio_desc">Mayor precio</option>
            </Select>
          </div>
        </div>

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
          {categories.map((category) => (
            <button
              key={category.id}
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

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#617061]">
        <p>
          Mostrando{" "}
          <span className="font-semibold text-[#183b2b]">
            {filteredProducts.length}
          </span>{" "}
          de {products.length} productos activos
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#cdd7c3] bg-white/80 px-6 py-14 text-center">
          <p className="text-lg font-semibold text-[#183b2b]">
            {products.length === 0
              ? "Aún no hay productos publicados en el catálogo"
              : "No encontramos productos con esos filtros"}
          </p>
          <p className="mt-2 text-sm text-[#6d7a6b]">
            {products.length === 0
              ? "Los agricultores registrados y verificados pueden publicar sus cosechas desde su panel."
              : "Prueba ajustando el municipio, la categoría o limpiando la búsqueda."}
          </p>
          {hasActiveFilters && (
            <Button onClick={resetFilters} variant="secondary" className="mt-5">
              Mostrar todos los productos
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
