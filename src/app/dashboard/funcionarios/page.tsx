"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { deletarFuncionario, getTodosFuncionarios } from "@/lib/supabase/actions";
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
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatTelefone } from "@/lib/utils";

export default function ListarFuncionariosPage() {
  const searchParams = useSearchParams();
  const paginaAtual = Number(searchParams.get("page")) || 1;
  const funcionariosPorPagina = 10;

  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [totalFuncionarios, setTotalFuncionarios] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFuncionarios() {
      setLoading(true);
      const { funcionarios, totalFuncionarios } = await getTodosFuncionarios(
        paginaAtual,
        funcionariosPorPagina
      );
      setFuncionarios(funcionarios);
      setTotalFuncionarios(totalFuncionarios);
      setLoading(false);
    }
    fetchFuncionarios();
  }, [paginaAtual]);

  // Deletar funcionário
  const handleDelete = async (id: number) => {
    const sucesso = await deletarFuncionario(id);
    if (sucesso) {
      toast.success("Funcionário excluído com sucesso!");
      setFuncionarios((prev) => prev.filter((f) => f.fun_id !== id));
      setTotalFuncionarios((prev) => prev - 1);
    } else {
      toast.error("Erro ao excluir funcionário.");
    }
  };

  const totalPaginas = Math.ceil(totalFuncionarios / funcionariosPorPagina);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
        <p className="text-muted-foreground">
          Gerencie todos os membros da equipe cadastrados no sistema.
        </p>
      </header>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px] text-center">ID</TableHead>
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
                    <TableRow
                      key={funcionario.fun_id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="text-center font-medium">
                        {String(funcionario.fun_id).padStart(5, "0")}
                      </TableCell>
                      <TableCell>{funcionario.fun_nome}</TableCell>
                      <TableCell>{funcionario.fun_cargo}</TableCell>
                      <TableCell>{funcionario.fun_email || "N/A"}</TableCell>
                      <TableCell>
                        {formatTelefone(funcionario.fun_telefone || "N/A")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/funcionarios/editar/${funcionario.fun_id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(funcionario.fun_id)}
                            className="cursor-pointer"
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Deletar
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
          )}
        </CardContent>
      </Card>

      {totalPaginas > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  paginaAtual > 1
                    ? `/dashboard/funcionarios?page=${paginaAtual - 1}`
                    : "#"
                }
              />
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
              <PaginationNext
                href={
                  paginaAtual < totalPaginas
                    ? `/dashboard/funcionarios?page=${paginaAtual + 1}`
                    : "#"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
