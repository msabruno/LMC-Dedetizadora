"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from 'next/navigation'; 

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DateInputPicker } from "@/components/ui/date-input-picker"; 
import { createClient } from "@/lib/supabase/client"; 
import { toast } from "sonner"; 


export default function CadastrarOSPage() {
  const router = useRouter();
  
  const [clienteId, setClienteId] = React.useState<string | undefined>();
  const [dataServico, setDataServico] = React.useState<Date | undefined>();
  const [status, setStatus] = React.useState<string>("1"); 
  const [areaTratada, setAreaTratada] = React.useState<string>("");
  const [areaNaoConstruida, setAreaNaoConstruida] = React.useState<string>("");
  const [periodicidade, setPeriodicidade] = React.useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!clienteId || !dataServico || !periodicidade) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      return;
    }

    const novaOrdemServico = {
      os_cli_id: parseInt(clienteId),
      os_data_servico: format(dataServico, "yyyy-MM-dd"),
      os_status: parseInt(status),
      os_area_tratada: parseFloat(areaTratada) || 0,
      os_area_nao_construida: parseFloat(areaNaoConstruida) || 0,
      os_periodicidade_caixa_esgoto: periodicidade,
    };

    const supabase = createClient();
    const { error } = await supabase
      .from("ordem_servico")
      .insert([novaOrdemServico]);

    if (error) {
      toast.error("Erro ao cadastrar a Ordem de Serviço.", {
        description: error.message,
      });
      console.error("Erro do Supabase:", error);
    } else {
      toast.success("Ordem de Serviço cadastrada com sucesso!");
      router.push('/dashboard/os'); 
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cadastrar Nova Ordem de Serviço</h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para adicionar uma nova OS no sistema.
          </p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Detalhes da Ordem de Serviço</h2>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                 <div className="space-y-2 md:col-span-2">
                    <Label>Cliente</Label>
                    <Popover onOpenChange={() => {}}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                          {clienteId ? clientes.find((c) => c.value === clienteId)?.label : "Selecione um cliente..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar cliente..." />
                          <CommandList>
                            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                            <CommandGroup>
                              {clientes.map((cliente) => (
                                <CommandItem key={cliente.value} value={cliente.label} onSelect={() => setClienteId(cliente.value)}>
                                  <Check className={cn("mr-2 h-4 w-4", clienteId === cliente.value ? "opacity-100" : "opacity-0")}/>
                                  {cliente.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Data do Serviço</Label>
                    <DateInputPicker value={dataServico} onChange={setDataServico} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Aberto</SelectItem>
                        <SelectItem value="2">Em Andamento</SelectItem>
                        <SelectItem value="3">Concluído</SelectItem>
                        <SelectItem value="4">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area_tratada">Área Tratada (m²)</Label>
                    <Input id="area_tratada" type="number" placeholder="Ex: 50" value={areaTratada} onChange={(e) => setAreaTratada(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area_nao_construida">Área Não Construída (m²)</Label>
                    <Input id="area_nao_construida" type="number" placeholder="Ex: 20" value={areaNaoConstruida} onChange={(e) => setAreaNaoConstruida(e.target.value)} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="periodicidade">Periodicidade</Label>
                    <Select value={periodicidade} onValueChange={setPeriodicidade}>
                      <SelectTrigger id="periodicidade"><SelectValue placeholder="Selecione a periodicidade" /></SelectTrigger>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Ordem de Serviço"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}