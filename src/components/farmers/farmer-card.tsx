import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Plant } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Farmer } from "@/types";

interface FarmerCardProps {
  farmer: Farmer;
  productCount?: number;
  onSelectFarmer?: (farmer: Farmer) => void;
  className?: string;
}

export function FarmerCard({
  farmer,
  productCount,
  onSelectFarmer,
  className,
}: FarmerCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-[#e0e6d6] bg-white p-5 shadow-[0_8px_28px_-18px_rgba(24,59,43,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c3d0b5] hover:shadow-[0_20px_42px_-24px_rgba(24,59,43,0.28)]",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-[#e3e8da] bg-[#f6f5ed]">
          <Image
            src={farmer.image}
            alt={`Ilustración representativa de ${farmer.name}`}
            width={160}
            height={160}
            unoptimized
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-[11px]">
              {farmer.farmName}
            </Badge>
          </div>
          <h3 className="mt-2 truncate text-lg font-semibold text-[#183b2b]">
            {farmer.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#6c7969]">
            <MapPin
              className="size-3.5 shrink-0 text-[#71864f]"
              weight="duotone"
            />
            {farmer.municipality}, Michoacán
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#f6f5ed] p-3.5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#71864f]">
          <Plant className="size-3.5" weight="duotone" />
          Especialidad agrícola
        </p>
        <p className="mt-1 text-sm font-medium text-[#183b2b]">
          {farmer.specialty}
        </p>
      </div>

      <p className="mt-3.5 line-clamp-2 text-xs leading-relaxed text-[#677465]">
        {farmer.bio}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {farmer.badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-[#dde4d3] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#4c5e4b]"
          >
            {badge}
          </span>
        ))}
        {typeof productCount === "number" && (
          <span className="rounded-full bg-[#dce6d2]/60 px-2.5 py-0.5 text-[11px] font-medium text-[#244d36]">
            {productCount} productos demo
          </span>
        )}
      </div>

      <div className="mt-auto pt-5">
        {onSelectFarmer ? (
          <button
            type="button"
            onClick={() => onSelectFarmer(farmer)}
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full justify-between rounded-2xl border-[#c7d3bc] text-[#244d36] hover:bg-[#244d36] hover:text-white",
            )}
          >
            <span>Ver productor</span>
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <Link
            href={`/farmers?productor=${farmer.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "w-full justify-between rounded-2xl border-[#c7d3bc] text-[#244d36] hover:bg-[#244d36] hover:text-white",
            )}
          >
            <span>Ver productor</span>
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
    </article>
  );
}
