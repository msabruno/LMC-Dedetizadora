"use client";

import * as React from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DateInputPicker } from "@/components/ui/date-input-picker";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { read } from "fs";

type Cliente = { value: string; label: string };

interface OrdemDeServico {
  os_id: number;
  os_cli_id: number | string;
  os_data_servico: string;
  os_status: number | string;
  os_area_tratada: string;
  os_area_nao_construida: string;
  os_periodicidade_caixa_esgoto: string;
}

interface FormularioOSProps {
  clientes?: Cliente[]; 
  initialValues?: OrdemDeServico;
}

export default function FormularioOS({ clientes = [], initialValues }: FormularioOSProps) {
  const router = useRouter();

  // Estados (convertendo valores vindos do server para string quando necessário)
  const [clienteId, setClienteId] = React.useState<string | undefined>(
    initialValues?.os_cli_id !== undefined ? String(initialValues.os_cli_id) : undefined
  );
  const [dataServico, setDataServico] = React.useState<Date | undefined>(
    initialValues?.os_data_servico ? new Date(initialValues.os_data_servico) : undefined
  );
  const [status, setStatus] = React.useState<string>(
    initialValues?.os_status !== undefined ? String(initialValues.os_status) : "1"
  );
  const [areaTratada, setAreaTratada] = React.useState<string>(initialValues?.os_area_tratada ?? "");
  const [areaNaoConstruida, setAreaNaoConstruida] = React.useState<string>(initialValues?.os_area_nao_construida ?? "");
  const [periodicidade, setPeriodicidade] = React.useState<string | undefined>(
    initialValues?.os_periodicidade_caixa_esgoto ?? undefined
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [clienteOpen, setClienteOpen] = React.useState(false);
  console.log("clienteId:", clienteId);
  console.log("clientes:", clientes);
  console.log("label encontrado:", clientes.find(c => c.value === clienteId)?.label);

  // Sempre que initialValues ou clientes mudarem (p.ex. vindo da página servidor),
  // atualizamos os estados. Isso garante que, em edição, os campos apareçam preenchidos.
  React.useEffect(() => {
    if (initialValues) {
      setClienteId(initialValues.os_cli_id !== undefined ? String(initialValues.os_cli_id) : undefined);
      setDataServico(initialValues.os_data_servico ? new Date(initialValues.os_data_servico) : undefined);
      setStatus(initialValues.os_status !== undefined ? String(initialValues.os_status) : "1");
      setAreaTratada(initialValues.os_area_tratada ?? "");
      setAreaNaoConstruida(initialValues.os_area_nao_construida ?? "");
      setPeriodicidade(initialValues.os_periodicidade_caixa_esgoto ?? undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]); // não incluir clientes aqui para evitar resete ao carregar lista

  const isFormInvalid = !clienteId || !dataServico || !periodicidade;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (isFormInvalid) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const dadosOS = {
        
        os_cli_id: parseInt(clienteId!, 10),
        os_data_servico: format(dataServico!, "yyyy-MM-dd"),
        os_status: parseInt(status, 10),
        os_area_tratada: parseFloat(areaTratada) || 0,
        os_area_nao_construida: parseFloat(areaNaoConstruida) || 0,
        os_periodicidade_caixa_esgoto: periodicidade!,
      };

      let error: any;
      if (initialValues) {
        
        const { error: updateError } = await supabase
          .from("ordem_servico")
          .update(dadosOS)
          .eq("os_id", initialValues.os_id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("ordem_servico")
          .insert([dadosOS]);
        error = insertError;
      }

      if (error) {
        toast.error("Erro ao salvar a Ordem de Serviço.", { description: error.message });
      } else {
        toast.success(`Ordem de Serviço ${initialValues ? "atualizada" : "cadastrada"} com sucesso!`);
        router.push("/dashboard/os");
      }
      console.log("DADASO OS", dadosOS)
    } catch (err: any) {
      toast.error("Erro inesperado.", { description: err?.message ?? String(err) });
    } finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {initialValues ? "Editar Ordem de Serviço" : "Cadastrar Nova Ordem de Serviço"}
          </h1>
          <p className="text-muted-foreground">
            {initialValues ? "Atualize os dados da OS." : "Preencha os dados abaixo para adicionar uma nova OS no sistema."}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Detalhes da Ordem de Serviço</h2>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

                  {/* Cliente */}
                  <div className="space-y-2 md:col-span-2">
                    <Label>Cliente</Label>
                    <Popover open={clienteOpen} onOpenChange={setClienteOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                          {clienteId ? clientes.find(c => c.value === clienteId)?.label ?? "—" : "Selecione um cliente..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar cliente..." />
                          <CommandList>
                            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                            <CommandGroup>
                              {clientes.map(cliente => (
                                <CommandItem
                                  key={cliente.value}
                                  value={cliente.value} // mantenha ID como value (string)
                                  onSelect={() => {
                                    setClienteId(cliente.value);
                                    setClienteOpen(false);
                                  }}
                                >
                                  <Check className={cn("mr-2 h-4 w-4", clienteId === cliente.value ? "opacity-100" : "opacity-0")} />
                                  {cliente.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Data do Serviço */}
                  <div className="space-y-2">
                    <Label>Data do Serviço</Label>
                    <DateInputPicker value={dataServico} onChange={setDataServico} />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Aberto</SelectItem>
                        <SelectItem value="2">Em Andamento</SelectItem>
                        <SelectItem value="3">Concluído</SelectItem>
                        <SelectItem value="4">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Área Tratada */}
                  <div className="space-y-2">
                    <Label>Área Tratada (m²)</Label>
                    <Input type="number" placeholder="Ex: 50" value={areaTratada} onChange={e => setAreaTratada(e.target.value)} />
                  </div>

                  {/* Área Não Construída */}
                  <div className="space-y-2">
                    <Label>Área Não Construída (m²)</Label>
                    <Input type="number" placeholder="Ex: 20" value={areaNaoConstruida} onChange={e => setAreaNaoConstruida(e.target.value)} />
                  </div>

                  {/* Periodicidade */}
                  <div className="space-y-2 md:col-span-2">
                    <Label>Periodicidade</Label>
                    <Select value={periodicidade} onValueChange={setPeriodicidade}>
                      <SelectTrigger><SelectValue placeholder="Selecione a periodicidade" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unica">Aplicação Única</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="bimestral">Bimestral</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={isFormInvalid || isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Ordem de Serviço"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
