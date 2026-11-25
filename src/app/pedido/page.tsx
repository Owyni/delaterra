import { Suspense } from "react";
import { connection } from "next/server";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { OrderCheckoutView } from "@/components/orders/order-checkout-view";
import { getCurrentAuthContext } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Confirmar pedido",
  description:
    "Revisa tus productos agrupados por agricultor y genera tus pedidos en Delaterra.",
};

async function PedidoContent() {
  await connection();
  const authContext = await getCurrentAuthContext();

  return (
    <OrderCheckoutView
      viewerRole={authContext?.user.role ?? null}
      businessName={authContext?.businessProfile?.businessName ?? null}
    />
  );
}

export default function PedidoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71864f]">
            Comercio directo · Sin pagos en línea
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight text-[#183b2b] sm:text-4xl">
            Resumen y confirmación de pedido
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#647364] sm:text-base">
            Cada pedido se asigna a un único agricultor para que coordines pago
            y entrega directamente por WhatsApp.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="rounded-3xl border border-[#dce3d3] bg-white p-10 text-center text-sm text-[#6b7869]">
              Cargando resumen de pedido...
            </div>
          }
        >
          <PedidoContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
