"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";
import { cpf, cnpj } from 'cpf-cnpj-validator';

const estadosBrasileiros = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

interface ClienteFormProps {
  initialValues?: {
    cli_id?: number;
    cli_nome?: string;
    cli_email?: string;
    cli_telefone?: string;
    cli_identificacao?: string;
    cli_cep?: string;
    cli_logradouro?: string;
    cli_numero?: string;
    cli_complemento?: string;
    cli_bairro?: string;
    cli_cidade?: string;
    cli_estado?: string;
  };
}

export default function CadastrarClientePage({ initialValues }: ClienteFormProps) {
  const router = useRouter();
  const nomeInputRef = useRef<HTMLInputElement>(null);
  const numeroInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("pessoais");
  const [nome, setNome] = useState(initialValues?.cli_nome || "");
  const [email, setEmail] = useState(initialValues?.cli_email || "");
  const [telefone, setTelefone] = useState(initialValues?.cli_telefone || "");
  const [identificacao, setIdentificacao] = useState(initialValues?.cli_identificacao || "");
  const [cep, setCep] = useState(initialValues?.cli_cep || "");
  const [logradouro, setLogradouro] = useState(initialValues?.cli_logradouro || "");
  const [numero, setNumero] = useState(initialValues?.cli_numero || "");
  const [complemento, setComplemento] = useState(initialValues?.cli_complemento || "");
  const [bairro, setBairro] = useState(initialValues?.cli_bairro || "");
  const [cidade, setCidade] = useState(initialValues?.cli_cidade || "");
  const [estado, setEstado] = useState(initialValues?.cli_estado || "");
  const [cepError, setCepError] = useState('');

  const [identificacaoError, setIdentificacaoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

const handleCepBlur = async () => {
    const cepLimpo = cep.replace(/\D/g, '');

    // Valida o formato antes de buscar
    if (cepLimpo.length > 0 && cepLimpo.length !== 8) {
      setCepError("O CEP deve conter 8 dígitos.");
      return; // Para a execução se o formato for inválido
    }
    
    setCepError('');
    if (cepLimpo.length !== 8) return; // Sai se o campo estiver vazio, sem erro

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado.");
        setCepError("CEP não encontrado."); // Informa o erro no campo
        return;
      }

      setLogradouro(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setEstado(data.uf);
      numeroInputRef.current?.focus();
    } catch (error) {
      toast.error("Não foi possível buscar o CEP.");
    } finally {
      setCepLoading(false);
    }
  };
 const handleIdentificacaoBlur = () => {
    const identificacaoLimpa = identificacao.replace(/\D/g, '');
    let isValid = false;

    if (identificacaoLimpa.length === 0) {
        setIdentificacaoError('');
        return true; 
    }

    if (identificacaoLimpa.length === 11) {
      if (cpf.isValid(identificacaoLimpa)) {
        setIdentificacaoError('');
        isValid = true;
      } else {
        setIdentificacaoError('CPF inválido.');
        isValid = false;
      }
    } else if (identificacaoLimpa.length === 14) {
      if (cnpj.isValid(identificacaoLimpa)) {
        setIdentificacaoError('');
        isValid = true;
      } else {
        setIdentificacaoError('CNPJ inválido.');
        isValid = false;
      }
    } else {
      setIdentificacaoError('CPF ou CNPJ incompleto.');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async () => {
    if (!isDadosPessoaisValid || !isEnderecoValid) {
        toast.error("Por favor, preencha os campos obrigatórios em todas as abas.");
        return;
    }
    
    setLoading(true);

    const dadosLimpos = {
      cli_nome: nome,
      cli_email: email,
      cli_telefone: telefone.replace(/\D/g, ""),
      cli_identificacao: identificacao.replace(/\D/g, ""),
      cli_cep: cep.replace(/\D/g, ""),
      cli_logradouro: logradouro,
      cli_numero: numero,
      cli_complemento: complemento,
      cli_bairro: bairro,
      cli_cidade: cidade,
      cli_estado: estado,
    };

    const supabase = createClient();
    let res;

    if (initialValues?.cli_id) {
      res = await supabase.from("cliente").update(dadosLimpos).eq("cli_id", initialValues.cli_id);
    } else {
      res = await supabase.from("cliente").insert(dadosLimpos);
    }

    setLoading(false);

    if (res.error) {
      toast.error(`Erro ao ${initialValues ? "atualizar" : "salvar"} cliente.`, { description: res.error.message });
    } else {
      toast.success(`Cliente ${initialValues ? "atualizado" : "cadastrado"} com sucesso!`);
      
      router.push("/dashboard/clientes");
    }
  };

  const isDadosPessoaisValid = 
    !!nome && 
    telefone.replace(/\D/g, '').length >= 10 && 
    identificacao.replace(/\D/g, '').length >= 11 && 
    !identificacaoError;

  const isEnderecoValid = 
    cep.replace(/\D/g, '').length === 8 &&
    !!logradouro &&
    !!numero &&
    !!bairro &&
    !!cidade &&
    !!estado &&
    !cepError;

  const handleNextTab = () => {
    if (activeTab === "pessoais") {
      setActiveTab("endereco");
    } else if (activeTab === "endereco") {
      setActiveTab("confirmar");
    }
  };

  let isNextButtonDisabled = true;
  if (activeTab === "pessoais") {
    isNextButtonDisabled = !isDadosPessoaisValid;
  } else if (activeTab === "endereco") {
    isNextButtonDisabled = !isEnderecoValid;
  }


  const isFormInvalid = !nome || telefone.replace(/\D/g, "").length < 10 || !identificacao || !cep || !logradouro || !numero || !bairro || !cidade || !estado || !!identificacaoError;
  const cpfCnpjMask = [{ mask: '000.000.000-00', maxLength: 11 }, { mask: '00.000.000/0000-00' }];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {initialValues?.cli_id ? "Editar Cliente" : "Cadastrar Novo Cliente"}
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para {initialValues?.cli_id ? "atualizar" : "adicionar"} um cliente.
          </p>
        </div>

        <Card>
        <form /* onSubmit={handleSubmit} */ >
            <CardContent className="pt-4">

              <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="pessoais">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="endereco">Endereço</TabsTrigger>
                  <TabsTrigger value="confirmar">Confirmar</TabsTrigger>

                </TabsList>

              <TabsContent value="pessoais">

                <div className="space-y-8 ">
                  <div className="space-y-2 ">
                    <h2 className="text-xl font-semibold">Dados Pessoais</h2>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input ref={nomeInputRef} id="name" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: José da Silva" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Ex: jose.silva@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <IMaskInput mask="(00) 00000-0000" id="phone" value={telefone} onAccept={(value: any) => setTelefone(value)} placeholder="Ex: (85) 99999-9999" className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm")} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="identificacao">CPF/CNPJ</Label>
                        <IMaskInput
                          mask={cpfCnpjMask}
                          id="identificacao"
                          value={identificacao}
                          onAccept={(value: any) => setIdentificacao(value)}
                          onBlur={handleIdentificacaoBlur}
                          placeholder="Digite o CPF ou CNPJ"
                          className={cn(
                            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            identificacaoError && "border-destructive focus-visible:ring-destructive"
                          )}
                          required
                        />
                        {identificacaoError && <p className="text-sm text-destructive mt-1">{identificacaoError}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                </TabsContent>

                <TabsContent value="endereco">

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Endereço</h2>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="space-y-2 md:col-span-1">
                        <Label htmlFor="cep">CEP</Label>
                        <IMaskInput
                          mask="00000-000"
                          id="cep"
                          value={cep}
                          onAccept={(value: any) => setCep(value)}
                          onBlur={handleCepBlur}
                          placeholder="Ex: 60000-000"
                          className={cn(
                            "flex h- w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            cepError && "border-destructive focus-visible:ring-destructive" 
                          )}
                          required
                        />
                        {cepError && <p className="text-sm text-destructive mt-1">{cepError}</p>}
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="logradouro">Logradouro</Label>
                        <Input id="logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} placeholder="Ex: Rua das Acácias" required/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input ref={numeroInputRef} id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Ex: 148" required/>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)}  placeholder="Ex: Casa A, Apto 302" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Ex: Meireles" required/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Fortaleza" required/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select onValueChange={setEstado} value={estado}>
                          <SelectTrigger id="estado"><SelectValue placeholder="Selecione o estado" /></SelectTrigger>
                          <SelectContent>{estadosBrasileiros.map((item) => (<SelectItem key={item.sigla} value={item.sigla}>{item.nome}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  </TabsContent>

                  <TabsContent value="confirmar">
                    <div className="space-y-4 pt-4">
                        <h2 className="text-xl font-semibold">Revise os Dados</h2>
                        <Separator />
                        <p className="text-sm text-muted-foreground">
                            Confira todas as informações antes de salvar o cliente.
                        </p>
                        <div className="space-y-2 rounded-md border p-4">
                            <h3 className="font-semibold">Dados Pessoais</h3>
                            <p className="text-sm"><strong>Nome:</strong> {nome}</p>
                            <p className="text-sm"><strong>CPF/CNPJ:</strong> {identificacao}</p>
                            <p className="text-sm"><strong>Telefone:</strong> {telefone}</p>
                            <p className="text-sm"><strong>Email:</strong> {email || "Não informado"}</p>
                            <Separator className="my-2" />
                            <h3 className="font-semibold">Endereço</h3>
                            <p className="text-sm">{logradouro}, {numero} {complemento && `- ${complemento}`}</p>
                            <p className="text-sm">{bairro}, {cidade} - {estado}</p>
                            <p className="text-sm"><strong>CEP:</strong> {cep}</p>
                        </div>
                    </div>
                </TabsContent>

              </Tabs>

            </CardContent>
            <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
              
              {activeTab !== 'confirmar' ? (
                <Button type="button" onClick={handleNextTab} disabled={isNextButtonDisabled}>
                  Avançar
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={!isDadosPessoaisValid || !isEnderecoValid || loading || cepLoading}
                >
                  {loading ? "Salvando..." : initialValues?.cli_id ? "Atualizar Cliente" : "Salvar Cliente"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}