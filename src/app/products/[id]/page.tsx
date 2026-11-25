import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductDetailView } from "@/components/products/product-detail-view";
import { getCurrentAuthContext } from "@/lib/auth-session";
import { getPublicProductById, getPublicProducts } from "@/lib/services/catalog";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getPublicProductById(id);
    if (!product) {
      return { title: "Producto no encontrado" };
    }

    return {
      title: `${product.name} — ${product.municipality}`,
      description: product.description,
    };
  } catch {
    return { title: "Detalle de producto" };
  }
}

async function ProductDetailContent({
  params,
}: ProductDetailPageProps) {
  // El acceso a params y los datos dinámicos queda dentro del límite Suspense.
  const { id } = await params;
  await connection();

  let product = null;

  try {
    product = await getPublicProductById(id);
  } catch {
    product = null;
  }

  if (!product) {
    notFound();
  }

  const [allActive, authContext] = await Promise.all([
    getPublicProducts({ categorySlug: product.categorySlug }).catch(() => []),
    getCurrentAuthContext().catch(() => null),
  ]);

  const relatedProducts = allActive
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      viewerRole={authContext?.user.role ?? null}
    />
  );
}

export default function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-14 text-center text-sm text-[#6b7869]">
              Cargando detalle del producto...
            </div>
          }
        >
          <ProductDetailContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
