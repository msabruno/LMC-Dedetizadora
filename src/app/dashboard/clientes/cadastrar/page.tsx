"use client"
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Trykker } from 'next/font/google';
import { tree } from 'next/dist/build/templates/app-page';


export default function CadastrarClientePage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const supabase = createClient()

    const { data, error } = await supabase
        .from('cliente')
        .insert({
          cli_nome: nome,
          cli_cep: cep,
          cli_logradouro: logradouro,
          cli_numero: numero,
          cli_complemento: complemento,
          cli_bairro: bairro,
          cli_cidade: cidade,
          cli_estado: estado,
          cli_telefone: telefone
        })
        .select()
    setLoading(false)

    if (error) {
      console.error('Erro ao cadastrar cliente: ', error)
      console.log(telefone)
      setMessage(`Erro: ${error.message}`)
    } else {
      setMessage('Cliente cadastrado com sucesso!');
      console.log('Cliente cadastrado:', data);
    }
  }



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
                    <Input id="name" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Calebe Soares Sousa" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Ex: calebe.soares@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={telefone} onChange={(e) => setTelefone(e.target.value)} type="tel" placeholder="Ex: (85) 99999-9999" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Endereço</h2>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="Ex: 60000-000" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="logradouro">Logradouro</Label>
                    <Input id="logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} placeholder="Ex: Rua das Acácias" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Ex: 148" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)}  placeholder="Ex: Casa A, Apto 302" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Ex: Meireles" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Fortaleza" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select onValueChange={setEstado} value={estado}>
                      <SelectTrigger id="estado">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
              <Button variant="outline">Cancelar</Button>
              <Button type="submit" disabled={loading}> {loading ? 'Cadastrando...' : 'Cadastrar Cliente'}</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}