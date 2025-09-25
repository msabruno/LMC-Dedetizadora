"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
  initialValues?: OrdemDeServico & { os_tratamento?: any };
}

const SERVICOS_REALIZADOS = ["DESINSETIZAÇÃO", "DESRATIZAÇÃO", "DESCUPINIZAÇÃO", "EXPURGO", "OUTROS"];
const OPCOES_DESRATIZACAO = {
  venenos: ["Brodifacoum (Granulado)", "Brodifacoum (Parafinado)", "Brodifacoum (Pó)"],
  metodos: ["Iscagem Formulada", "Iscagem Granulada", "Iscagem Parafinada", "Pó de Contato"],
};
const OPCOES_DESINSETIZACAO = {
  venenos: ["Lambda cyhalothryn (Líquido)", "Deltamethym (Líquido)", "Hidramethylnon (Gel)"],
  metodos: ["Pulverização", "Aatomização", "Termonebulização", "Pó", "Gel"],
};
const OPCOES_DESCUPINIZACAO = {
  venenos: ["Fipronil (Líquido)", "Permetrina (Líquido)"],
  metodos: ["Injetável", "Pincelamento", "Pulverização Simples"],
};

export default function FormularioOS({ clientes = [], initialValues }: FormularioOSProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState("dados");
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

  const [servicosSelecionados, setServicosSelecionados] = React.useState<string[]>(initialValues?.os_tratamento?.servicos || []);
  const [opcoesDetalhadas, setOpcoesDetalhadas] = React.useState(
    initialValues?.os_tratamento || {
      desratizacao: { venenos: [], metodos:[] },
      desinsetizacao: { venenos: [], metodos: [] },
      descupinizacao: { venenos: [], metodos: [] },
    }
  );

  const isDadosTabValid = !!clienteId && !!dataServico && !!horaInicio && !!horaTermino && !!periodicidade;
  const isAreaTabValid = !!areaTratada && !!areaNaoConstruida;
  const isTratamentoTabValid = servicosSelecionados.length > 0; // Exige que pelo menos um serviço seja selecionado

  const handleServicoChange = (servico: string, checked: boolean) => {
    setServicosSelecionados(prev => checked ? [...prev, servico] : prev.filter(s => s !== servico));
  };

  const handleOpcaoChange = (servico: keyof typeof opcoesDetalhadas, tipo: 'venenos' | 'metodos', opcao: string, checked: boolean) => {
    setOpcoesDetalhadas(prev => ({
      ...prev,
      [servico]: { ...prev[servico], [tipo]: checked ? [...prev[servico][tipo], opcao] : prev[servico][tipo].filter(v => v !== opcao) },
    }));
  };

const handleNextTab = () => {
    if (activeTab === "dados") setActiveTab("area");
    if (activeTab === "area") setActiveTab("tratamento");
    if (activeTab === "tratamento") setActiveTab("confirmar");
  };

  let isNextButtonDisabled = true;
    if (activeTab === "dados") isNextButtonDisabled = !isDadosTabValid;
    else if (activeTab === "area") isNextButtonDisabled = !isAreaTabValid;
    else if (activeTab === "tratamento") isNextButtonDisabled = !isTratamentoTabValid;

const handleSubmit = async () => {
    if (!isDadosTabValid || !isAreaTabValid || !isTratamentoTabValid) {
      toast.error("Preencha todos os campos obrigatórios de todas as abas.");
      return;
    }
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const dadosOS = {
        os_cli_id: parseInt(clienteId!, 10),
        os_data_servico: format(dataServico!, "yyyy-MM-dd"),
        os_status: parseInt(status, 10),
        os_area_tratada: parseFloat(areaTratada) || 0,
        os_area_nao_construida: parseFloat(areaNaoConstruida) || 0,
        os_periodicidade_caixa_esgoto: periodicidade!,
        os_hora_inicio: horaInicio,
        os_hora_termino: horaTermino,
        os_tratamento: opcoesDetalhadas,
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
          <form>
            <CardContent className="pt-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="dados">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="dados">Dados Gerais</TabsTrigger>
                  <TabsTrigger value="area">Área</TabsTrigger>
                  <TabsTrigger value="tratamento">Tratamento</TabsTrigger>
                  <TabsTrigger value="confirmar">Confirmar</TabsTrigger>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Periodicidade</Label>
                      <Select value={periodicidade} onValueChange={setPeriodicidade}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
                      <Select value={tipo} onValueChange={setTipo}> 
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Contrato</SelectItem>
                          <SelectItem value="2">Serviço</SelectItem>
                          <SelectItem value="3">Manutenção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    </div>
                    </div>

                    <div className="grid md:grid-cols-3  gap-y-2 space-y-2">
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

                </TabsContent>

                {/* Página 2 - Área */}
                <TabsContent value="area" className="space-y-4 pt-4">
                  <h2 className="text-xl font-semibold">Área</h2>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Área Tratada Construída (m²)</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 50"
                        value={areaTratada}
                        onChange={(e) => setAreaTratada(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Área Tratada Não Construída (m²)</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 20"
                        value={areaNaoConstruida}
                        onChange={(e) => setAreaNaoConstruida(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value='tratamento' className='space-y-4 pt-4'>
                  <h2 className="text-xl font-semibold">Tratamento Realizado</h2>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label className="font-semibold">Serviços Realizados</Label>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border p-4">
                      {SERVICOS_REALIZADOS.map(servico => (
                        <div key={servico} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`servico-${servico.toLowerCase()}`}
                            checked={servicosSelecionados.includes(servico)}
                            onCheckedChange={(checked) => handleServicoChange(servico, !!checked)}
                          />
                          <Label htmlFor={`servico-${servico.toLowerCase()}`} className="font-normal cursor-pointer">{servico}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servicosSelecionados.includes("DESRATIZAÇÃO") && (
                      <div className="space-y-4 rounded-md border p-4 animate-in fade-in-50">
                        <h3 className="font-semibold">DESRATIZAÇÃO</h3>
                        <div className="space-y-2">{OPCOES_DESRATIZACAO.venenos.map(v => (<div key={v} className="flex items-center space-x-2"><Checkbox id={`desratizacao-${v}`} onCheckedChange={c => handleOpcaoChange('desratizacao', 'venenos', v, !!c)} /><Label htmlFor={`desratizacao-${v}`} className="font-normal text-sm cursor-pointer">{v}</Label></div>))}</div>
                        <Separator />
                        <h4 className="font-medium text-sm">MÉTODO</h4>
                        <div className="space-y-2">{OPCOES_DESRATIZACAO.metodos.map(m => (<div key={m} className="flex items-center space-x-2"><Checkbox id={`desratizacao-${m}`} onCheckedChange={c => handleOpcaoChange('desratizacao', 'metodos', m, !!c)} /><Label htmlFor={`desratizacao-${m}`} className="font-normal text-sm cursor-pointer">{m}</Label></div>))}</div>
                      </div>
                    )}
                    {servicosSelecionados.includes("DESINSETIZAÇÃO") && (
                      <div className="space-y-4 rounded-md border p-4 animate-in fade-in-50">
                        <h3 className="font-semibold">DESINSETIZAÇÃO</h3>
                         <div className="space-y-2">{OPCOES_DESINSETIZACAO.venenos.map(v => (<div key={v} className="flex items-center space-x-2"><Checkbox id={`desinsetizacao-${v}`} onCheckedChange={c => handleOpcaoChange('desinsetizacao', 'venenos', v, !!c)} /><Label htmlFor={`desinsetizacao-${v}`} className="font-normal text-sm cursor-pointer">{v}</Label></div>))}</div>
                        <Separator />
                        <h4 className="font-medium text-sm">MÉTODO</h4>
                        <div className="space-y-2">{OPCOES_DESINSETIZACAO.metodos.map(m => (<div key={m} className="flex items-center space-x-2"><Checkbox id={`desinsetizacao-${m}`} onCheckedChange={c => handleOpcaoChange('desinsetizacao', 'metodos', m, !!c)} /><Label htmlFor={`desinsetizacao-${m}`} className="font-normal text-sm cursor-pointer">{m}</Label></div>))}</div>
                      </div>
                    )}
                    {servicosSelecionados.includes("DESCUPINIZAÇÃO") && (
                       <div className="space-y-4 rounded-md border p-4 animate-in fade-in-50">
                        <h3 className="font-semibold">DESCUPINIZAÇÃO (B.QUÍMICA)</h3>
                         <div className="space-y-2">{OPCOES_DESCUPINIZACAO.venenos.map(v => (<div key={v} className="flex items-center space-x-2"><Checkbox id={`descupinizacao-${v}`} onCheckedChange={c => handleOpcaoChange('descupinizacao', 'venenos', v, !!c)} /><Label htmlFor={`descupinizacao-${v}`} className="font-normal text-sm cursor-pointer">{v}</Label></div>))}</div>
                        <Separator />
                        <h4 className="font-medium text-sm">MÉTODO</h4>
                        <div className="space-y-2">{OPCOES_DESCUPINIZACAO.metodos.map(m => (<div key={m} className="flex items-center space-x-2"><Checkbox id={`descupinizacao-${m}`} onCheckedChange={c => handleOpcaoChange('descupinizacao', 'metodos', m, !!c)} /><Label htmlFor={`descupinizacao-${m}`} className="font-normal text-sm cursor-pointer">{m}</Label></div>))}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="confirmar" className="space-y-4 pt-4">
                  <h2 className="text-xl font-semibold">Confirmação</h2>
                  <Separator />
                  <p className="text-sm text-muted-foreground">
                    Revise todos os dados inseridos nas abas anteriores. Se tudo estiver correto, clique em "Salvar OS" para finalizar.
                  </p>
                  <div className="space-y-4 rounded-md border p-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold">Dados Gerais</h3>
                      <p className="text-sm">
                        <strong>Cliente:</strong> {clientes.find(c => c.value === clienteId)?.label || "Não selecionado"}
                      </p>
                      <p className="text-sm">
                        <strong>Data do Serviço:</strong> {dataServico ? format(dataServico, "dd/MM/yyyy") : "Não selecionada"}
                      </p>
                      <p className="text-sm">
                        <strong>Horário:</strong> {horaInicio || "--:--"} às {horaTermino || "--:--"}
                      </p>
                      <p className="text-sm">
                        <strong>Periodicidade:</strong> <span className="capitalize">{periodicidade || "Não selecionada"}</span>
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <h3 className="font-semibold">Área</h3>
                      <p className="text-sm">
                        <strong>Área Tratada:</strong> {areaTratada ? `${areaTratada} m²` : "Não informado"}
                      </p>
                      <p className="text-sm">
                        <strong>Área Não Construída:</strong> {areaNaoConstruida ? `${areaNaoConstruida} m²` : "Não informado"}
                      </p>
                    </div>

                    <Separator />
                    <div className="space-y-1">
                      <h3 className="font-semibold">Detalhes do Serviço</h3>
                      <p className="text-sm">
                        <strong>Status:</strong> {status === "1" ? "Aberto" : status === "2" ? "Em Andamento" : status === "3" ? "Concluído" : "Cancelado"}
                      </p>
                      <p className="text-sm">
                        <strong>Tipo:</strong> {tipo === "1" ? "Contrato" : tipo === "2" ? "Serviço" : "Manutenção"}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
              {activeTab !== "confirmar" ? (
                <Button type="button" onClick={handleNextTab} disabled={isNextButtonDisabled}>
                  Avançar
                </Button>

              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit} 
                  disabled={!isDadosTabValid || !isAreaTabValid || isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : "Salvar OS"}
                </Button>
              )}

            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
