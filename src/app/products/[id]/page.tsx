import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductDetailView } from "@/components/products/product-detail-view";
import { FARMERS_BY_ID } from "@/data/farmers";
import { PRODUCTS } from "@/data/products";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((item) => item.id === id);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: `${product.name} — ${product.municipality}`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  const farmer = FARMERS_BY_ID[product.farmerId];
  const relatedProducts = PRODUCTS.filter(
    (item) => item.id !== product.id && item.category === product.category,
  ).slice(0, 4);

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : PRODUCTS.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="flex-1">
        <ProductDetailView
          product={product}
          farmer={farmer}
          relatedProducts={fallbackRelated}
        />
      </main>
      <Footer />
    </div>
  );
}
