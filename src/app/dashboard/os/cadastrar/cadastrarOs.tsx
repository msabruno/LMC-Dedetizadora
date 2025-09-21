"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateInputPicker } from "@/components/ui/date-input-picker";
import { createClient } from "@/lib/supabase/client";

type Cliente = { value: string; label: string };

interface OrdemDeServico {
  os_id: number;
  os_cli_id: number | string;
  os_data_servico: string;
  os_status: number | string;
  os_area_tratada: string;
  os_area_nao_construida: string;
  os_periodicidade_caixa_esgoto: string;
  os_hora_inicio: string;
  os_hora_termino: string
}

interface FormularioOSProps {
  clientes?: Cliente[];
  initialValues?: OrdemDeServico;
}

export default function FormularioOS({ clientes = [], initialValues }: FormularioOSProps) {
  const router = useRouter();

  const [clienteId, setClienteId] = React.useState<string | undefined>(
    initialValues?.os_cli_id !== undefined ? String(initialValues.os_cli_id) : undefined
  );
  const [dataServico, setDataServico] = React.useState<Date | undefined>(
    initialValues?.os_data_servico ? new Date(initialValues.os_data_servico) : undefined
  );
  const [horaInicio, setHoraInicio] = React.useState<string>(
    initialValues?.os_hora_inicio ?? ""
  );
  const [horaTermino, setHoraTermino] = React.useState<string>(
    initialValues?.os_hora_termino ?? ""
  );
  const [status, setStatus] = React.useState<string>(
    initialValues?.os_status !== undefined ? String(initialValues.os_status) : "1"
  );
  const [tipo, setTipo] = React.useState<string>(
    initialValues?.os_status !== undefined ? String(initialValues.os_status) : "1"
  );
  const [areaTratada, setAreaTratada] = React.useState<string>(initialValues?.os_area_tratada ?? "");
  const [areaNaoConstruida, setAreaNaoConstruida] = React.useState<string>(initialValues?.os_area_nao_construida ?? "");
  const [periodicidade, setPeriodicidade] = React.useState<string | undefined>(
    initialValues?.os_periodicidade_caixa_esgoto ?? undefined
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [clienteOpen, setClienteOpen] = React.useState(false);

  const isFormInvalid = !clienteId || !dataServico || !periodicidade;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isFormInvalid) {
      toast.error("Preencha todos os campos obrigatórios.");
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
        const { error: insertError } = await supabase.from("ordem_servico").insert([dadosOS]);
        error = insertError;
      }

      if (error) {
        toast.error("Erro ao salvar OS", { description: error.message });
      } else {
        toast.success(`OS ${initialValues ? "atualizada" : "cadastrada"} com sucesso!`);
        router.push("/dashboard/os");
      }
    } catch (err: any) {
      toast.error("Erro inesperado", { description: err?.message ?? String(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            {initialValues ? "Editar Ordem de Serviço" : "Cadastrar Nova Ordem de Serviço"}
          </h1>
          <p className="text-muted-foreground">
            {initialValues ? "Atualize os dados da OS." : "Preencha os dados abaixo."}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-8">
              <Tabs defaultValue="dados">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="dados" className="cursor-pointer">Dados Gerais</TabsTrigger>
                  <TabsTrigger value="area" className="cursor-pointer">Área</TabsTrigger>
                  <TabsTrigger value="periodicidade" className="cursor-pointer">Periodicidade</TabsTrigger>
                  <TabsTrigger value="confirmar" className="cursor-pointer">Confirmar</TabsTrigger>
                </TabsList>

                {/* Página 1 - Dados Gerais */}
                <TabsContent value="dados" className="space-y-4 pt-4">
                  <h2 className="text-xl font-semibold">Dados Gerais</h2>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Cliente</Label>
                      <Popover open={clienteOpen} onOpenChange={setClienteOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                            {clienteId
                              ? clientes.find((c) => c.value === clienteId)?.label ?? "—"
                              : "Selecione um cliente..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar cliente..." />
                            <CommandList>
                              <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                              <CommandGroup>
                                {clientes.map((c) => (
                                  <CommandItem
                                    key={c.value}
                                    value={c.value}
                                    onSelect={() => {
                                      setClienteId(c.value);
                                      setClienteOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn("mr-2 h-4 w-4", clienteId === c.value ? "opacity-100" : "opacity-0")}
                                    />
                                    {c.label}
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
                    <div className="grid md:grid-cols-3">
                      <div className="space-y-2">
                          <Label>Peridiocidade</Label>
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
                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select value={tipo} onValueChange={setStatus}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Contrato</SelectItem>
                            <SelectItem value="2">Serviço</SelectItem>
                            <SelectItem value="3">Manutenção</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
                      <div className="space-y-1">
                        <Label>Hora início</Label>
                        <Input
                          type="time"
                          value={horaInicio}
                          onChange={(e) => setHoraInicio(e.target.value)}
                          className="w-auto"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label>Hora término</Label>
                        <Input
                          type="time"
                          value={horaTermino}
                          onChange={(e) => setHoraTermino(e.target.value)}
                          className="w-auto"
                        />
                      </div>
                    </div>

                  </div>
                  
                </TabsContent>

                {/* Página 2 - Área */}
                <TabsContent value="area" className="space-y-4 pt-4">
                  <h2 className="text-xl font-semibold">Área</h2>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Área Tratada (m²)</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 50"
                        value={areaTratada}
                        onChange={(e) => setAreaTratada(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Área Não Construída (m²)</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 20"
                        value={areaNaoConstruida}
                        onChange={(e) => setAreaNaoConstruida(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Página 3 - Periodicidade */}
                <TabsContent value="periodicidade" className="space-y-4 pt-4">
                  <h2 className="text-xl font-semibold">Periodicidade</h2>
                  <Separator />
                  
                </TabsContent>

                {/* Página 4 - Confirmar */}
                <TabsContent value="confirmar" className="space-y-4 pt-4">
                  <h2 className="text-xl font-semibold">Confirmação</h2>
                  <Separator />
                  <p>Revise os dados antes de salvar.</p>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isFormInvalid || isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar OS"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
