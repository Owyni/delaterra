"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Leaf,
  MagnifyingGlass,
  MapPin,
} from "@phosphor-icons/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUICK_SEARCH_TAGS = ["Aguacate Hass", "Fresa", "Jitomate", "Limón", "Frijol"];

export function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed
        ? `/products?q=${encodeURIComponent(trimmed)}`
        : "/products",
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-[#e3e8d9] bg-gradient-to-b from-[#f6f5ed] via-[#f6f5ed] to-[#eef2e6]">
      {/* Elementos gráficos orgánicos de fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-12 size-80 rounded-full bg-[#dce6d2]/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-[28rem] rounded-full bg-[#dce6d2]/80 blur-3xl"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-28 w-full text-[#e8eee0]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,64 C240,120 480,12 720,56 C960,100 1200,24 1440,68 L1440,120 L0,120 Z" />
      </svg>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:px-10 lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c9d6be] bg-white/85 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#244d36] uppercase shadow-2xs">
            <Leaf className="size-4 text-[#71864f]" weight="duotone" />
            Marketplace agrícola · Michoacán
          </div>

          <h1 className="mt-6 font-[family-name:var(--font-fraunces)] text-4xl font-semibold leading-[1.06] tracking-tight text-[#183b2b] sm:text-5xl lg:text-6xl">
            Del campo a{" "}
            <span className="text-[#244d36] underline decoration-[#dce6d2] decoration-8 underline-offset-4">
              tu negocio.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#576758] sm:text-lg sm:leading-8">
            Descubre productos frescos directamente de agricultores de
            Michoacán. Compara cosechas locales, origen municipal y precios
            ilustrativos en un escaparate pensado para el comercio cercano.
          </p>

          {/* Barra de búsqueda destacada */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-2.5 rounded-3xl border border-[#d6dfd0] bg-white p-2 shadow-[0_14px_38px_-20px_rgba(24,59,43,0.28)] sm:flex-row sm:items-center sm:rounded-full"
          >
            <label htmlFor="hero-search" className="sr-only">
              Buscar frutas, verduras o municipios de Michoacán
            </label>
            <div className="flex flex-1 items-center gap-3 pl-3.5 pr-2">
              <MagnifyingGlass
                className="size-5 shrink-0 text-[#71864f]"
                weight="bold"
              />
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca aguacate, jitomate, fresa o municipio..."
                className="h-10 w-full bg-transparent text-sm text-[#183b2b] placeholder:text-[#7b8677] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-11 rounded-full px-6 text-sm font-semibold",
              )}
            >
              Buscar cosecha
            </button>
          </form>

          {/* Sugerencias rápidas */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#6e7b6c]">
            <span className="font-medium">Populares:</span>
            {QUICK_SEARCH_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/products?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-[#d9e1d0] bg-white/80 px-3 py-1 font-medium text-[#244d36] transition hover:border-[#71864f] hover:bg-[#dce6d2]/60"
              >
                {tag}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-12 px-7 text-sm font-semibold shadow-sm",
              )}
            >
              Explorar productos
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/farmers"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 border-[#c5d1bb] px-7 text-sm font-semibold text-[#244d36]",
              )}
            >
              Conocer agricultores
            </Link>
          </div>
        </div>

        {/* Composición visual de frutas y verduras frescas */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-white bg-[#e4ecdb] p-3 shadow-[0_28px_70px_-32px_rgba(24,59,43,0.34)]">
            <Image
              src="/images/hero-harvest.svg"
              alt="Ilustración de canasta con frutas y verduras frescas de Michoacán"
              width={640}
              height={520}
              priority
              unoptimized
              className="h-auto w-full rounded-[1.75rem]"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-0">
            <div className="rounded-2xl border border-[#e0e6d6] bg-white/95 p-3.5 shadow-md backdrop-blur-xs sm:absolute sm:-bottom-5 sm:-left-6 sm:w-56">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#71864f]">
                <MapPin className="size-3.5" weight="duotone" />
                Origen regional
              </p>
              <p className="mt-1 text-sm font-semibold text-[#183b2b]">
                6 regiones de Michoacán
              </p>
              <p className="text-xs text-[#7b8677]">
                Uruapan, Zamora, Morelia y más
              </p>
            </div>

            <div className="rounded-2xl border border-[#e0e6d6] bg-white/95 p-3.5 shadow-md backdrop-blur-xs sm:absolute sm:-right-4 sm:top-8 sm:w-52">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#71864f]">
                Vitrina demostrativa
              </p>
              <p className="mt-1 text-sm font-semibold text-[#183b2b]">
                22 productos locales
              </p>
              <p className="text-xs text-[#7b8677]">
                Trato directo sin intermediarios
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
