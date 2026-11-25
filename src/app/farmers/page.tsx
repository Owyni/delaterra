import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FarmersDirectory } from "@/components/farmers/farmers-directory";
import { loadPublicCatalogData } from "@/lib/services/public-loader";

export const metadata: Metadata = {
  title: "Directorio de agricultores",
  description:
    "Conoce a los productores agrícolas registrados en distintos municipios de Michoacán.",
};

async function FarmersDirectoryLoader() {
  await connection();
  const { farmers, products, municipalities } = await loadPublicCatalogData();

  return (
    <FarmersDirectory
      farmers={farmers}
      products={products}
      municipalities={municipalities}
    />
  );
}

export default function FarmersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71864f]">
            Comunidad regional
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b] sm:text-4xl">
            Agricultores de Michoacán
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#647364] sm:text-base">
            Explora productores por municipio o especialidad y consulta los
            productos disponibles que ofrecen en el marketplace.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="rounded-3xl border border-[#dce3d3] bg-white p-10 text-center text-sm text-[#6b7869]">
              Cargando directorio de agricultores...
            </div>
          }
        >
          <FarmersDirectoryLoader />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
