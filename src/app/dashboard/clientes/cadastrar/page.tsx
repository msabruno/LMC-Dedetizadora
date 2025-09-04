"use client"
import { createClient } from '@/lib/supabase/client';
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { IMaskInput } from 'react-imask';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

import { cpf, cnpj } from 'cpf-cnpj-validator'; 

export default function CadastrarClientePage() {
  const router = useRouter();
  const nomeInputRef = useRef<HTMLInputElement>(null);
  const numeroInputRef = useRef<HTMLInputElement>(null);
  const [cepLoading, setCepLoading] = useState(false); 
  
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

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [identificacao, setIdentificacao] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  
  const [identificacaoError, setIdentificacaoError] = useState('');
  
  const [loading, setLoading] = useState(false);
  
const handleCepBlur = async () => {
    const cepLimpo = cep.replace(/\D/g, ''); 

    if (cepLimpo.length !== 8) {
      return;
    }

    setCepLoading(true); 
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado.");
        setLogradouro('');
        setBairro('');
        setCidade('');
        setEstado('');
        return;
      }

      setLogradouro(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setEstado(data.uf);
      
      numeroInputRef.current?.focus();

    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error("Não foi possível buscar o CEP. Verifique sua conexão.");
    } finally {
      setCepLoading(false); 
    }
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const isIdentificacaoValid = handleIdentificacaoBlur();
    if (!isIdentificacaoValid) {
        toast.error("Por favor, corrija os erros no formulário.");
        return;
    }

    setLoading(true);

    const telefoneLimpo = telefone.replace(/\D/g, '');
    const cepLimpo = cep.replace(/\D/g, '');
    const identificacaoLimpa = identificacao.replace(/\D/g, '');

    const supabase = createClient();

    const { data, error } = await supabase
        .from('cliente')
        .insert({
          cli_nome: nome,
          cli_cep: cepLimpo,
          cli_logradouro: logradouro,
          cli_numero: numero,
          cli_complemento: complemento,
          cli_bairro: bairro,
          cli_cidade: cidade,
          cli_estado: estado,
          cli_telefone: telefoneLimpo,
          cli_email: email,
          cli_identificacao: identificacaoLimpa
        })
        .select();

    setLoading(false);

    if (error) {
      toast.error("Erro ao cadastrar cliente", { description: error.message });
    } else {
      toast.success('Cliente cadastrado com sucesso!');
      
      setNome('');
      setEmail('');
      setTelefone('');
      setIdentificacao('');
      setCep('');
      setLogradouro('');
      setNumero('');
      setComplemento('');
      setBairro('');
      setCidade('');
      setEstado('');
      setIdentificacaoError('');
      
      nomeInputRef.current?.focus();
    }
  }

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

  const cpfCnpjMask = [
    { mask: '000.000.000-00', maxLength: 11 },
    { mask: '00.000.000/0000-00' }
  ];

  const isFormInvalid = !nome || !telefone || !identificacao || !!identificacaoError;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cadastrar Novo Cliente</h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para adicionar um novo cliente ao sistema.
          </p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-4">
              <div className="space-y-8">
                <div className="space-y-4">
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
                      <IMaskInput
                        mask="(00) 00000-0000"
                        id="phone"
                        value={telefone}
                        onAccept={(value: any) => setTelefone(value)}
                        placeholder="Ex: (85) 99999-9999"
                        className={cn(
                          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        )}
                        required
                      />
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

                <div className="space-y-4">
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
                          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                      required
                    />
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
                        <SelectTrigger id="estado">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosBrasileiros.map((estadoItem) => (
                            <SelectItem key={estadoItem.sigla} value={estadoItem.sigla}>
                              {estadoItem.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={loading || cepLoading}>
                {loading || cepLoading ? 'Aguarde...' : 'Cadastrar Cliente'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}