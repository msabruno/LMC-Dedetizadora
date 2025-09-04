// app/dashboard/funcionarios/page.tsx

import { getTodosFuncionarios } from "@/lib/supabase/actions";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MoreHorizontal } from "lucide-react";

export default async function ListarFuncionariosPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const paginaAtual = Number(searchParams?.page) || 1;
  const funcionariosPorPagina = 10;

  const { funcionarios, totalFuncionarios } = await getTodosFuncionarios(paginaAtual, funcionariosPorPagina);
  
  const totalPaginas = Math.ceil(totalFuncionarios / funcionariosPorPagina);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lista de Funcionários</h1>
        <p className="text-muted-foreground">
          Gerencie todos os membros da equipe cadastrados no sistema.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funcionarios.length > 0 ? (
                funcionarios.map((funcionario) => (
                  <TableRow key={funcionario.fun_id}>
                    <TableCell className="font-medium">
                      {String(funcionario.fun_id).padStart(5, '0')}
                    </TableCell>
                    <TableCell>{funcionario.fun_nome}</TableCell>
                    <TableCell>{funcionario.fun_cargo}</TableCell>
                    <TableCell>{funcionario.fun_email || 'N/A'}</TableCell>
                    <TableCell>{funcionario.fun_telefone || 'N/A'}</TableCell>
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
                  <TableCell colSpan={6} className="text-center h-24">
                    Nenhum funcionário encontrado.
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
            <PaginationPrevious href={paginaAtual > 1 ? `/dashboard/funcionarios?page=${paginaAtual - 1}` : '#'} />
          </PaginationItem>
          
          {[...Array(totalPaginas)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink 
                href={`/dashboard/funcionarios?page=${i + 1}`} 
                isActive={paginaAtual === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext href={paginaAtual < totalPaginas ? `/dashboard/funcionarios?page=${paginaAtual + 1}` : '#'} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}