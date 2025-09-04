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
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <TableRow key={cliente.cli_id}>
                    <TableCell className="font-medium">
                      {String(cliente.cli_id).padStart(5, '0')}
                    </TableCell>
                    <TableCell>{cliente.cli_nome}</TableCell>
                    <TableCell>{cliente.cli_email || 'N/A'}</TableCell>
                    <TableCell>{cliente.cli_telefone || 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    Nenhum cliente encontrado.
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