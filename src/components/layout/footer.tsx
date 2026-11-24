import Link from "next/link";
import {
  EnvelopeSimple,
  MapPin,
  Phone,
  Plant,
} from "@phosphor-icons/react/dist/ssr";
import { BrandLogo } from "@/components/layout/brand-logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#d8dfd0] bg-[#eef1e6] text-[#183b2b]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.1fr] lg:px-10">
        <div className="space-y-4">
          <BrandLogo />
          <p className="max-w-sm text-sm leading-relaxed text-[#5c6b5c]">
            Marketplace agrícola diseñado para acercar a productores locales de
            Michoacán con restaurantes, fruterías, comedores y comercios de la
            región.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ced8c3] bg-white/80 px-3.5 py-1.5 text-xs font-medium text-[#244d36]">
            <Plant className="size-4 text-[#71864f]" weight="duotone" />
            Prototipo visual con datos demostrativos
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-tight text-[#244d36]">
            Explorar
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[#5c6b5c]">
            <li>
              <Link href="/" className="transition hover:text-[#244d36]">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/products" className="transition hover:text-[#244d36]">
                Catálogo de productos
              </Link>
            </li>
            <li>
              <Link
                href="/#categorias"
                className="transition hover:text-[#244d36]"
              >
                Categorías agrícolas
              </Link>
            </li>
            <li>
              <Link href="/farmers" className="transition hover:text-[#244d36]">
                Directorio de agricultores
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-tight text-[#244d36]">
            Accesos de muestra
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-[#5c6b5c]">
            <li>
              <Link href="/login" className="transition hover:text-[#244d36]">
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link href="/register" className="transition hover:text-[#244d36]">
                Crear cuenta
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="transition hover:text-[#244d36]"
              >
                Panel administrativo (Demo)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-tight text-[#244d36]">
            Contacto ilustrativo
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-[#5c6b5c]">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#71864f]" />
              <span>Morelia, Michoacán, México (Sede académica demo)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <EnvelopeSimple className="size-4 shrink-0 text-[#71864f]" />
              <span>contacto@delaterra-demo.edu.mx</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-[#71864f]" />
              <span>+52 (443) 000 0199 (Ficticio)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#d8dfd0] bg-[#e6ebdc]/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-[#6e7b6b] sm:flex-row sm:px-6 lg:px-10">
          <p>
            Delaterra · Plataforma académica de comercialización agrícola directa.
          </p>
          <p>
            Precios, productores y disponibilidad mostrados son únicamente fines
            ilustrativos.
          </p>
        </div>
      </div>
    </footer>
  );
}
