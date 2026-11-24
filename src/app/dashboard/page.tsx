import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Panel administrativo (Demo)",
  description:
    "Vista previa visual del panel para agricultores en la plataforma Delaterra.",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ed]">
      <Navbar />
      <main className="flex-1">
        <DashboardShell />
      </main>
      <Footer />
    </div>
  );
}
