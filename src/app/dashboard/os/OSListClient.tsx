// src/app/dashboard/os/OSListClient.tsx
"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Pencil, FileText, Trash } from "lucide-react";
import { deletarOS } from "@/lib/supabase/actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "sonner";
import { useState } from "react";
const statusMap: Record<number, { text: string; variant: "secondary" | "default" | "outline" | "destructive" }> = {
  1: { text: "Aberto", variant: "secondary" },
  2: { text: "Em Andamento", variant: "default" },
  3: { text: "Concluído", variant: "outline" },
  4: { text: "Cancelado", variant: "destructive" },
};



interface OSListClientProps {
  ordens: any[];
  paginaAtual: number;
  totalPaginas: number;
}


export default function OSListClient({ ordens, paginaAtual, totalPaginas }: OSListClientProps) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const sucesso = await deletarOS(id);
    
    if (sucesso) {
      toast.success("Ordem de Serviço excluída com sucesso!");
      router.refresh();
    } else {
      toast.error("Erro ao excluir Ordem de Serviço.");
    }
  };
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as Ordens de Serviço cadastradas no sistema.
        </p>
      </header>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px] text-center">N° OS</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data do Serviço</TableHead>
                <TableHead>Área Tratada</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {ordens.length > 0 ? ordens.map((ordem) => {
                const statusInfo = statusMap[Number(ordem.os_status)] || { text: "Desconhecido", variant: "secondary" };

                return (
                  <TableRow key={ordem.os_id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-center font-medium">{String(ordem.os_id).padStart(5, "0")}</TableCell>
                    <TableCell>{ordem.cliente?.cli_nome || "Cliente não encontrado"}</TableCell>
                    <TableCell>{statusMap[Number(ordem.os_status)]?.text || "Desconhecido"}</TableCell>
                    <TableCell>{format(new Date(ordem.os_data_servico), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell>{ordem.os_area_tratada} m²</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button variant="outline" className="cursor-pointer" size="sm"><FileText/> Gerar PDF</Button>
                      <Button variant="outline" className="cursor-pointer" size="sm" onClick={() => router.push(`/dashboard/os/editar/${ordem.os_id}`)}>
                        <Pencil /> Editar OS
                      </Button>
                      <Button variant="outline" className="cursor-pointer" size="sm" onClick={() => handleDelete(ordem.os_id)}>
                        <Trash /> Deletar OS
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">Nenhuma Ordem de Serviço encontrada.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPaginas > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={paginaAtual > 1 ? `/dashboard/os?page=${paginaAtual - 1}` : "#"} />
            </PaginationItem>

            {[...Array(totalPaginas)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href={`/dashboard/os?page=${i + 1}`} isActive={paginaAtual === i + 1}>{i + 1}</PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href={paginaAtual < totalPaginas ? `/dashboard/os?page=${paginaAtual + 1}` : "#"} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
function setOrdens(arg0: (prev: any) => any) {
  throw new Error("Function not implemented.");
}

