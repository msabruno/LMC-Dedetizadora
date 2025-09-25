"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getTodosClientes, deletarCliente } from "@/lib/supabase/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { formatTelefone } from "@/lib/utils";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";


export default function ListarClientesPage() {
  const searchParams = useSearchParams();
  const paginaAtual = Number(searchParams.get("page")) || 1;
  const clientesPorPagina = 10; // ✅ declare dentro da função

  const [clientes, setClientes] = useState<any[]>([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClientes() {
      setLoading(true);
      const { clientes, totalClientes } = await getTodosClientes(paginaAtual, clientesPorPagina);
      setClientes(clientes);
      setTotalClientes(totalClientes);
      setLoading(false);
    }
    fetchClientes();
  }, [paginaAtual]);

  const handleDelete = async (id: number) => {
    const sucesso = await deletarCliente(id);
    if (sucesso) {
      toast.success("Cliente excluído com sucesso!");
      setClientes(prev => prev.filter(c => c.cli_id !== id));
      setTotalClientes(prev => prev - 1);
    } else {
      toast.error("Erro ao excluir cliente.");
    }
  };

  const totalPaginas = Math.ceil(totalClientes / clientesPorPagina);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">Visualize e gerencie todos os clientes cadastrados no sistema.</p>
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
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {clientes.length > 0 ? (
                  clientes.map(cliente => (
                    <TableRow key={cliente.cli_id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-center font-medium">{String(cliente.cli_id).padStart(5, "0")}</TableCell>
                      <TableCell>{cliente.cli_nome}</TableCell>
                      <TableCell>{cliente.cli_email || "N/A"}</TableCell>
                      <TableCell>{formatTelefone(cliente.cli_telefone || "N/A")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/clientes/editar/${cliente.cli_id}`}>
                        <Button variant="outline" size="sm" className="cursor-pointer">
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger>
                              <Button variant="outline" size="sm" className="cursor-pointer" >
                                <Trash className="h-4 w-4 mr-1" />
                                Deletar
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o registro deste Cliente? Essa ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(cliente.cli_id)} className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"> Sim, excluir</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Nenhum cliente encontrado.
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
              <PaginationPrevious href={paginaAtual > 1 ? `/dashboard/clientes?page=${paginaAtual - 1}` : "#"} />
            </PaginationItem>

            {[...Array(totalPaginas)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href={`/dashboard/clientes?page=${i + 1}`} isActive={paginaAtual === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href={paginaAtual < totalPaginas ? `/dashboard/clientes?page=${paginaAtual + 1}` : "#"} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
