import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Page() {
  return (

    <Table>
        <TableCaption></TableCaption>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">N° OS</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data do Serviço</TableHead>
            <TableHead>Área não construída</TableHead>

            <TableHead className="text-right">Área tratada</TableHead>
            <TableHead className="text-right">PDF</TableHead>

            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
            <TableCell className="font-medium">000001</TableCell>
            <TableCell>Completo</TableCell>
            <TableCell>01/08/2025</TableCell>
            <TableCell>10m²</TableCell>
            <TableCell className="text-right">10m²</TableCell>
            <TableCell className="text-right">Download</TableCell>

            </TableRow>

            <TableRow>
            <TableCell className="font-medium">000002</TableCell>
            <TableCell>Completo</TableCell>
            <TableCell>01/08/2025</TableCell>
            <TableCell>10m²</TableCell>
            <TableCell className="text-right">10m²</TableCell>
            <TableCell className="text-right">Download</TableCell>

            </TableRow>
        </TableBody>
        </Table>
   );
}
