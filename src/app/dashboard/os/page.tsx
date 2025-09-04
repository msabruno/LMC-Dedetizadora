import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrdensDeServico } from "@/lib/supabase/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const statusMap = {
  1: { text: "Aberto", variant: "secondary" as const },
  2: { text: "Em Andamento", variant: "default" as const },
  3: { text: "Concluído", variant: "outline" as const },
  4: { text: "Cancelado", variant: "destructive" as const },
};

export default async function ListarOSPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const paginaAtual = Number(searchParams?.page) || 1;
  const osPorPagina = 10;

  const { ordens, totalOrdens } = await getOrdensDeServico(paginaAtual, osPorPagina);

  const totalPaginas = Math.ceil(totalOrdens / osPorPagina);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ordens de Serviço</h1>
        <p className="text-muted-foreground">
          Visualize e gerencie todas as O.S. cadastradas no sistema.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">N° OS</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data do Serviço</TableHead>
                <TableHead className="text-right">Área Tratada</TableHead>
                <TableHead className="text-right">PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordens.length > 0 ? (
                ordens.map((ordem) => {
                  const statusInfo = statusMap[ordem.os_status as keyof typeof statusMap] || { text: 'Desconhecido', variant: 'secondary' };
                  return (
                    <TableRow key={ordem.os_id}>
                      <TableCell className="font-medium">
                        {String(ordem.os_id).padStart(5, '0')}
                      </TableCell>
                      <TableCell>{ordem.cliente?.cli_nome || 'Cliente não encontrado'}</TableCell>                      
                      <TableCell>
                        <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(ordem.os_data_servico), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">{ordem.os_area_tratada}m²</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">Download</Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Nenhuma Ordem de Serviço encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={paginaAtual > 1 ? `/dashboard/os?page=${paginaAtual - 1}` : '#'} />
          </PaginationItem>
          
          {[...Array(totalPaginas)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink 
                href={`/dashboard/os?page=${i + 1}`} 
                isActive={paginaAtual === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext href={paginaAtual < totalPaginas ? `/dashboard/os?page=${paginaAtual + 1}` : '#'} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}