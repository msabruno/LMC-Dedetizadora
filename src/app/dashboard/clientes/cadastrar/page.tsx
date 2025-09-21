"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface ClienteFormProps {
  initialValues?: {
    cli_id?: number;
    cli_nome?: string;
    cli_email?: string;
    cli_telefone?: string;
  };
}

export default function CadastrarClientePage({ initialValues }: ClienteFormProps) {
  const router = useRouter();
  const nomeInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState(initialValues?.cli_nome || "");
  const [email, setEmail] = useState(initialValues?.cli_email || "");
  const [telefone, setTelefone] = useState(initialValues?.cli_telefone || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const telefoneLimpo = telefone.replace(/\D/g, "");

    let res;
    if (initialValues?.cli_id) {
      // edição
      res = await supabase
        .from("cliente")
        .update({
          cli_nome: nome,
          cli_email: email,
          cli_telefone: telefoneLimpo,
        })
        .eq("cli_id", initialValues.cli_id)
        .select();
    } else {
      // criação
      res = await supabase
        .from("cliente")
        .insert({
          cli_nome: nome,
          cli_email: email,
          cli_telefone: telefoneLimpo,
        })
        .select();
    }

    setLoading(false);

    if (res.error) {
      toast.error("Erro ao salvar cliente.", { description: res.error.message });
    } else {
      toast.success(`Cliente ${initialValues?.cli_id ? "atualizado" : "cadastrado"} com sucesso!`);
      if (!initialValues) {
        setNome("");
        setEmail("");
        setTelefone("");
        nomeInputRef.current?.focus();
      } else {
        router.push("/dashboard/clientes");
      }
    }
  };

  const isFormInvalid = !nome || telefone.replace(/\D/g, "").length < 10;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {initialValues?.cli_id ? "Editar Cliente" : "Cadastrar Novo Cliente"}
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para {initialValues?.cli_id ? "atualizar" : "adicionar"} um cliente.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Dados do Cliente</h2>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      ref={nomeInputRef}
                      id="name"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: João da Silva"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: joao@email.com"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
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
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 border-t px-6 py-4">
              <Button variant="outline" type="button" onClick={() => router.back()} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" disabled={isFormInvalid || loading} className="cursor-pointer">
                {loading ? "Salvando..." : initialValues?.cli_id ? "Atualizar Cliente" : "Cadastrar Cliente"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
