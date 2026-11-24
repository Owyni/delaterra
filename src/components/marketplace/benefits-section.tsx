import Link from "next/link";
import {
  Compass,
  CurrencyDollarSimple,
  Handshake,
  MapPinArea,
  ArrowRight,
} from "@phosphor-icons/react/ssr";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    title: "Comercio directo",
    description:
      "Acorta la cadena entre la parcela y el punto de venta para construir acuerdos claros y duraderos.",
    icon: Handshake,
  },
  {
    title: "Productores locales",
    description:
      "Visibiliza el trabajo de huertas y ranchos en distintos municipios de Michoacán.",
    icon: MapPinArea,
  },
  {
    title: "Mayor visibilidad de precios",
    description:
      "Consulta precios por unidad y presentaciones mínimas desde el primer vistazo al catálogo.",
    icon: CurrencyDollarSimple,
  },
  {
    title: "Conexión geográfica",
    description:
      "Facilita descubrir cosechas cercanas para reducir traslados y mantener la frescura del campo.",
    icon: Compass,
  },
];

export function BenefitsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="grid items-center gap-10 rounded-[2.25rem] border border-[#d6dfd0] bg-[#244d36] p-7 text-white shadow-[0_26px_65px_-32px_rgba(24,59,43,0.5)] sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
        <div>
          <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#dce6d2]">
            Beneficios de la red
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl font-semibold leading-tight sm:text-4xl">
            Abasto agrícola más humano, cercano y transparente.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#dce6d2]/90 sm:text-base">
            Delaterra busca transformar la forma en que los negocios
            michoacanos encuentran materia prima fresca, impulsando la economía
            local.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "bg-white text-[#244d36] hover:bg-[#dce6d2]",
              )}
            >
              Crear cuenta demo
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "border border-white/25 text-white hover:bg-white/10",
              )}
            >
              Explorar catálogo
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xs"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#dce6d2] text-[#244d36]">
                  <Icon className="size-5" weight="duotone" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#dce6d2]/85">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
