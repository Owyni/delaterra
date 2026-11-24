import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
}

export function BrandLogo({ className, compact = false }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-full",
        className,
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-2xl bg-[#244d36] text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 20V11M12 13C12 8.5 15.5 5 20 5C20 9.5 16.5 13 12 13ZM12 15C12 11.2 9.2 8 5 8C5 12.2 8 15 12 15Z"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-xl font-semibold tracking-tight text-[#183b2b]">
            dela<span className="text-[#71864f]">terra</span>
          </span>
          <span className="text-[10px] font-medium tracking-[0.16em] text-[#7b8677] uppercase">
            Michoacán
          </span>
        </span>
      )}
    </Link>
  );
}
