import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { OrderCartProvider } from "@/components/orders/order-cart-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Delaterra | Marketplace agrícola de Michoacán",
    template: "%s | Delaterra",
  },
  description:
    "Plataforma académica que conecta agricultores de Michoacán con negocios compradores mediante comercialización agrícola directa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-[#dce6d2] selection:text-[#183b2b]">
        <OrderCartProvider>{children}</OrderCartProvider>
      </body>
    </html>
  );
}
