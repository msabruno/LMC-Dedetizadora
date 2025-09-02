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

// Defina a sua lista de navegação aqui
const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "Home",
  },
  {
    title: "Produtos",
    url: "/products",
    icon: "ShoppingCart",
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: "Settings",
    items: [
      {
        title: "Perfil",
        url: "/settings/profile",
      },
      {
        title: "Ajustes",
        url: "/settings/account",
      },
    ],
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
          <div className="w-64">
            
          </div>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}