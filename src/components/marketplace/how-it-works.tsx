import {
  Handshake,
  MapTrifold,
  Plant,
} from "@phosphor-icons/react/ssr";

const STEPS = [
  {
    number: "01",
    title: "Los agricultores publican sus productos",
    description:
      "Cada productor registra su cosecha disponible, unidad de venta, precio ilustrativo y municipio de origen.",
    icon: Plant,
  },
  {
    number: "02",
    title: "Los negocios descubren productores cercanos",
    description:
      "Tiendas, restaurantes y comercios exploran el catálogo por categoría, municipio o cercanía geográfica.",
    icon: MapTrifold,
  },
  {
    number: "03",
    title: "Compradores y agricultores acuerdan directamente",
    description:
      "Sin intermediarios largos: ambas partes coordinan volumen, compra y entrega de manera cercana y transparente.",
    icon: Handshake,
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-[#dde3d4] bg-[#eef2e6]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71864f]">
            Proceso sencillo
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b] sm:text-4xl">
            ¿Cómo funciona Delaterra?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#617061] sm:text-base">
            Tres pasos claros para acercar la producción agrícola local a los
            negocios compradores.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col rounded-3xl border border-[#d9e1d0] bg-white p-7 shadow-[0_10px_30px_-20px_rgba(24,59,43,0.18)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#dce6d2] text-[#244d36]">
                    <Icon className="size-6" weight="duotone" />
                  </span>
                  <span className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold text-[#cad6be]">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-snug text-[#183b2b]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#647364]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
