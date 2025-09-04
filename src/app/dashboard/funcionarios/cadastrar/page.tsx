"use client"

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner"; 
import { useRouter } from 'next/navigation';
import { IMaskInput } from 'react-imask';
import { cn } from '@/lib/utils';

export default function CadastrarFuncionarioPage() {
  const router = useRouter();
  const nomeInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const telefoneLimpo = telefone.replace(/\D/g, '');

    const supabase = createClient();

    const { data, error } = await supabase
      .from('funcionario') 
      .insert({
        fun_nome: nome,
        fun_email: email,
        fun_telefone: telefoneLimpo,
        fun_cargo: cargo,
      })
      .select();
      
    setLoading(false);

    if (error) {
      console.error('Erro ao cadastrar funcionário: ', error);
      toast.error("Erro ao cadastrar funcionário.", {
        description: error.message,
      });
    } else {
      toast.success('Funcionário cadastrado com sucesso!');

      setNome('');
      setEmail('');
      setTelefone('');
      setCargo('');

      nomeInputRef.current?.focus();
    }
  }

    const isFormInvalid = !nome || telefone.replace(/\D/g, '').length < 11 || !cargo;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cadastrar Novo Funcionário</h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para adicionar um novo membro à equipe.
          </p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Dados do Funcionário</h2>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input ref={nomeInputRef} id="name" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Ana de Souza" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Ex: ana.souza@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <IMaskInput
                      mask="(00) 00000-0000"
                      id="phone"
                      value={telefone}
                      onAccept={(value: any) => setTelefone(value)}
                      placeholder="Ex: (85) 98888-8888"
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Select onValueChange={setCargo} value={cargo} required>
                      <SelectTrigger id="cargo">
                        <SelectValue placeholder="Selecione o cargo do funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Técnico Dedetizador">Técnico Dedetizador</SelectItem>
                        <SelectItem value="Supervisor Técnico">Supervisor Técnico</SelectItem>
                        <SelectItem value="Atendimento">Atendimento</SelectItem>
                        <SelectItem value="Administrativo">Administrativo</SelectItem>
                        <SelectItem value="Gerente">Gerente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancelar</Button>
              <Button type="submit" disabled={isFormInvalid || loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar Funcionário'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}