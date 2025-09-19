// src/app/dashboard/os/page.tsx
import { getOrdensDeServico } from "@/lib/supabase/actions";
import OSListClient from "./OSListClient";

interface ListarOSPageProps {
  searchParams?: { page?: string };
}

export default async function ListarOSPage({ searchParams }: ListarOSPageProps) {
  const paginaAtual = Number(searchParams?.page) || 1;
  const osPorPagina = 10;

  // Buscar dados no servidor
  const { ordens, totalOrdens } = await getOrdensDeServico(paginaAtual, osPorPagina);
  const totalPaginas = Math.ceil(totalOrdens / osPorPagina);

  // Passa tudo como props para o Client Component
  return (
    <OSListClient
      ordens={ordens}
      paginaAtual={paginaAtual}
      totalPaginas={totalPaginas}
    />
  );
}
