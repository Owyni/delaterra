import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, User } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AvailabilityStatus, Product } from "@/types";

const AVAILABILITY_STYLES: Record<
  AvailabilityStatus,
  { variant: "available" | "limited" | "seasonal"; dotClass: string }
> = {
  disponible: {
    variant: "available",
    dotClass: "bg-[#2e7d47]",
  },
  pocas_unidades: {
    variant: "limited",
    dotClass: "bg-[#c88a22]",
  },
  bajo_pedido: {
    variant: "seasonal",
    dotClass: "bg-[#6e5a96]",
  },
};

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const statusStyle = AVAILABILITY_STYLES[product.availability];

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-[#e0e6d6] bg-white shadow-[0_8px_28px_-18px_rgba(24,59,43,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c3d0b5] hover:shadow-[0_22px_45px_-26px_rgba(24,59,43,0.32)]",
        className,
      )}
    >
      {/* Mitad superior: imagen/ilustración sobre fondo claro */}
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden border-b border-[#edf1e6]"
        style={{ backgroundColor: product.backdropColor }}
      >
        <Image
          src={product.image}
          alt={`${product.name} — ilustración agrícola`}
          width={400}
          height={300}
          unoptimized
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#244d36] shadow-2xs backdrop-blur-xs">
            {product.categoryLabel}
          </span>
        </div>
        <div className="absolute right-3.5 top-3.5">
          <Badge
            variant={statusStyle.variant}
            className="bg-white/92 backdrop-blur-xs"
          >
            <span
              className={cn("size-1.5 rounded-full", statusStyle.dotClass)}
              aria-hidden="true"
            />
            {product.availabilityLabel}
          </Badge>
        </div>
      </Link>

      {/* Mitad inferior: jerarquía de precio, origen y acción */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-snug tracking-tight text-[#183b2b]">
              <Link
                href={`/products/${product.id}`}
                className="transition-colors hover:text-[#244d36]"
              >
                {product.name}
              </Link>
            </h3>
          </div>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#244d36]">
              ${product.priceMxn}
            </span>
            <span className="text-xs font-medium text-[#7b8677]">
              MXN / {product.unit}
            </span>
            <span className="ml-auto rounded-full bg-[#f6f5ed] px-2.5 py-0.5 text-[11px] font-medium text-[#647161]">
              Mín. {product.minOrder}
            </span>
          </div>

          <div className="mt-4 space-y-1.5 border-t border-[#eff2e9] pt-3.5 text-xs text-[#697666]">
            <p className="flex items-center gap-1.5">
              <User className="size-3.5 shrink-0 text-[#71864f]" weight="bold" />
              <span className="truncate font-medium text-[#425243]">
                {product.farmerName}
              </span>
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin
                className="size-3.5 shrink-0 text-[#71864f]"
                weight="duotone"
              />
              <span>{product.municipality}, Michoacán</span>
            </p>
          </div>
        </div>

        <Link
          href={`/products/${product.id}`}
          className={cn(
            buttonVariants({ variant: "default", size: "default" }),
            "mt-5 w-full justify-between rounded-2xl px-4 text-sm font-semibold",
          )}
        >
          <span>Ver producto</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
