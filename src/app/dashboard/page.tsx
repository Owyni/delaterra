import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FarmerDashboard } from "@/components/dashboard/farmer-dashboard";
import { BusinessDashboard } from "@/components/dashboard/business-dashboard";
import { requirePageAuth } from "@/lib/auth-session";
import {
  getActiveCategories,
  getFarmerOwnProducts,
} from "@/lib/services/catalog";
import {
  getOrdersForBusiness,
  getOrdersForFarmer,
} from "@/lib/services/orders";

export const metadata: Metadata = {
  title: "Panel de gestión",
  description:
    "Administra tus productos publicados, pedidos y perfil en Delaterra.",
};

interface DashboardPageProps {
  searchParams: Promise<{ tab?: string }>;
}

async function DashboardLoader({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await connection();
  const [{ tab }, context] = await Promise.all([
    searchParams,
    requirePageAuth("/dashboard"),
  ]);

  if (context.user.role === "farmer" && context.farmerProfile) {
    const [products, orders, categories] = await Promise.all([
      getFarmerOwnProducts(context.farmerProfile.id),
      getOrdersForFarmer(context.farmerProfile.id),
      getActiveCategories(),
    ]);

    return (
      <FarmerDashboard
        profile={context.farmerProfile}
        email={context.user.email}
        products={products}
        orders={orders}
        categories={categories}
      />
    );
  }

  if (context.user.role === "business" && context.businessProfile) {
    const orders = await getOrdersForBusiness(context.businessProfile.id);

    return (
      <BusinessDashboard
        profile={context.businessProfile}
        email={context.user.email}
        orders={orders}
        initialTab={tab}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 text-center">
      <div className="rounded-3xl border border-[#dce3d3] bg-white p-8">
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#183b2b]">
          Perfil incompleto
        </h1>
        <p className="mt-2 text-sm text-[#647364]">
          Tu cuenta ({context.user.email}) no tiene un perfil de agricultor o
          negocio asociado.
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-14 text-center text-sm text-[#6b7869]">
              Cargando tu panel...
            </div>
          }
        >
          <DashboardLoader searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
