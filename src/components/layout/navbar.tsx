"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X, Storefront } from "@phosphor-icons/react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Explorar productos" },
  { href: "/#categorias", label: "Categorías" },
  { href: "/farmers", label: "Agricultores" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[#dde3d3] bg-[#f6f5ed]/92 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-10">
        <BrandLogo />

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href !== "/#categorias" && pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#dce6d2] text-[#244d36]"
                    : "text-[#395143] hover:bg-[#eaece1] hover:text-[#183b2b]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-[#5d6c5e] transition-colors hover:bg-[#eaece1] hover:text-[#244d36]"
          >
            <Storefront className="size-4" weight="duotone" />
            Panel demo
          </Link>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-9.5 px-4 text-sm font-medium",
            )}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "h-9.5 px-5 text-sm font-medium",
            )}
          >
            Registrarse
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          className="inline-flex size-10 items-center justify-center rounded-full border border-[#d6ddd0] bg-white text-[#244d36] transition hover:bg-[#dce6d2]/50 lg:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <List className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#dde3d3] bg-[#f6f5ed] px-4 pb-5 pt-3 lg:hidden">
          <nav
            aria-label="Menú móvil"
            className="flex flex-col gap-1"
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl px-4 py-2.5 text-sm font-medium text-[#183b2b] transition hover:bg-[#dce6d2]/60"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="rounded-2xl px-4 py-2.5 text-sm font-medium text-[#5d6c5e] transition hover:bg-[#dce6d2]/60"
            >
              Panel demo (Vista administrativa)
            </Link>
          </nav>

          <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-[#dde3d3] pt-4">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-center",
              )}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full justify-center",
              )}
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
