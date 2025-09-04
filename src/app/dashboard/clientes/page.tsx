// app/dashboard/clientes/page.tsx

import { getTodosClientes } from "@/lib/supabase/actions";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// 1. IMPORTS RESTAURADOS
import { Button } from "@/components/ui/button";
import { Mail, Phone, MoreHorizontal } from "lucide-react";

// A página agora recebe 'searchParams' para saber a página atual
export default async function ListarClientesPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const paginaAtual = Number(searchParams?.page) || 1;
  const clientesPorPagina = 10;

  // Buscamos os dados passando a página atual
  const { clientes, totalClientes } = await getTodosClientes(paginaAtual, clientesPorPagina);
  
  const totalPaginas = Math.ceil(totalClientes / clientesPorPagina);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lista de Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie todos os clientes cadastrados no sistema.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                {/* 2. CABEÇALHO DA COLUNA RESTAURADO */}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <TableRow key={cliente.cli_id}>
                    <TableCell className="font-medium">
                      {String(cliente.cli_id).padStart(4, '0')}
                    </TableCell>
                    <TableCell>{cliente.cli_nome}</TableCell>
                    <TableCell>{cliente.cli_email || 'N/A'}</TableCell>
                    <TableCell>{cliente.cli_telefone || 'N/A'}</TableCell>
                    {/* 3. CÉLULA COM OS BOTÕES RESTAURADA */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                          <span className="sr-only">Ligar</span>
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Enviar Email</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mais opções</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {/* 4. COLSPAN CORRIGIDO PARA 5 COLUNAS */}
                  <TableCell colSpan={5} className="text-center h-24">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Componente de Paginação */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={paginaAtual > 1 ? `/dashboard/clientes?page=${paginaAtual - 1}` : '#'} />
          </PaginationItem>
          
          {[...Array(totalPaginas)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink 
                href={`/dashboard/clientes?page=${i + 1}`} 
                isActive={paginaAtual === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext href={paginaAtual < totalPaginas ? `/dashboard/clientes?page=${paginaAtual + 1}` : '#'} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}