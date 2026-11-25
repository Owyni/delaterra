import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, User } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatMxn } from "@/lib/orders/domain";
import type { PublicProductDTO } from "@/lib/services/catalog";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: PublicProductDTO;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const isOutOfStock = product.availableQuantity <= 0;
  const isLowStock = !isOutOfStock && product.availableQuantity <= 10;

  const badgeVariant = isOutOfStock || isLowStock ? "limited" : "available";
  const dotClass = isOutOfStock
    ? "bg-[#b84435]"
    : isLowStock
      ? "bg-[#c88a22]"
      : "bg-[#2e7d47]";
  const availabilityLabel = isOutOfStock
    ? "Sin existencias"
    : isLowStock
      ? `Quedan ${product.availableQuantity}`
      : `Disponible (${product.availableQuantity})`;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-[#e0e6d6] bg-white shadow-[0_8px_28px_-18px_rgba(24,59,43,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c3d0b5] hover:shadow-[0_22px_45px_-26px_rgba(24,59,43,0.32)]",
        className,
      )}
    >
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden border-b border-[#edf1e6]"
        style={{ backgroundColor: product.backdropColor }}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={300}
          unoptimized
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#244d36] shadow-2xs backdrop-blur-xs">
            {product.categoryName}
          </span>
        </div>
        <div className="absolute right-3.5 top-3.5">
          <Badge
            variant={badgeVariant}
            className="bg-white/92 backdrop-blur-xs"
          >
            <span
              className={cn("size-1.5 rounded-full", dotClass)}
              aria-hidden="true"
            />
            {availabilityLabel}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="text-lg font-semibold leading-snug tracking-tight text-[#183b2b]">
            <Link
              href={`/products/${product.id}`}
              className="transition-colors hover:text-[#244d36]"
            >
              {product.name}
            </Link>
          </h3>

          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-[#244d36]">
              {formatMxn(product.priceMxn).replace(" MXN", "")}
            </span>
            <span className="text-xs font-medium text-[#7b8677]">
              MXN / {product.unit}
            </span>
            {product.minOrderNote && (
              <span className="ml-auto truncate rounded-full bg-[#f6f5ed] px-2.5 py-0.5 text-[11px] font-medium text-[#647161]">
                {product.minOrderNote}
              </span>
            )}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-[#eff2e9] pt-3.5 text-xs text-[#697666]">
            <p className="flex items-center gap-1.5">
              <User className="size-3.5 shrink-0 text-[#71864f]" weight="bold" />
              <span className="truncate font-medium text-[#425243]">
                {product.farmerName}
                {product.farmName ? ` · ${product.farmName}` : ""}
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
