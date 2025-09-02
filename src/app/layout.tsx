// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Importe o seu componente de navegação
import { NavMain } from "@/components/nav-main";
// Importe os ícones que você quer usar
import { Home, ShoppingCart, Settings } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestão - OS",
  description: "Site de Domínio LMC - Dedetizadora Eireli",

};

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "Home",
    isActive: true
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex">
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}