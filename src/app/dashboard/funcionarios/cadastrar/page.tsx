"use client"

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

type Funcionario = {
  fun_id?: number;
  fun_nome: string;
  fun_email?: string;
  fun_telefone: string;
  fun_cargo: string;
};

export default function CadastrarFuncionarioPage({ initialValues }: { initialValues?: Funcionario }) {
  const router = useRouter();
  const nomeInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");
  const [loading, setLoading] = useState(false);

  // Preenche os valores iniciais quando for edição
  useEffect(() => {
    if (initialValues) {
      setNome(initialValues.fun_nome || "");
      setEmail(initialValues.fun_email || "");
      setTelefone(initialValues.fun_telefone || "");
      setCargo(initialValues.fun_cargo || "");
    }
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const telefoneLimpo = telefone.replace(/\D/g, "");
    const supabase = createClient();

    let error, data;

    if (initialValues?.fun_id) {
      // EDITAR
      ({ data, error } = await supabase
        .from("funcionario")
        .update({
          fun_nome: nome,
          fun_email: email,
          fun_telefone: telefoneLimpo,
          fun_cargo: cargo,
        })
        .eq("fun_id", initialValues.fun_id)
        .select()
        .single());
    } else {
      // CADASTRAR
      ({ data, error } = await supabase
        .from("funcionario")
        .insert({
          fun_nome: nome,
          fun_email: email,
          fun_telefone: telefoneLimpo,
          fun_cargo: cargo,
        })
        .select()
        .single());
    }

    setLoading(false);

    if (error) {
      console.error("Erro ao salvar funcionário: ", error);
      toast.error("Erro ao salvar funcionário.", { description: error.message });
    } else {
      toast.success(
        `Funcionário ${initialValues ? "atualizado" : "cadastrado"} com sucesso!`
      );
      router.push("/dashboard/funcionarios");
    }
  };

  const isFormInvalid = !nome || telefone.replace(/\D/g, "").length < 11 || !cargo;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {initialValues ? "Editar Funcionário" : "Cadastrar Novo Funcionário"}
          </h1>
          <p className="text-muted-foreground">
            {initialValues
              ? "Atualize os dados do funcionário."
              : "Preencha os dados abaixo para adicionar um novo membro à equipe."}
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
                    <Input
                      ref={nomeInputRef}
                      id="name"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Ana de Souza"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Ex: ana.souza@email.com"
                    />
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
              <Button variant="outline" type="button" onClick={() => router.back()} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" disabled={isFormInvalid || loading} className="cursor-pointer">
                {loading
                  ? initialValues
                    ? "Atualizando..."
                    : "Cadastrando..."
                  : initialValues
                  ? "Atualizar Funcionário"
                  : "Cadastrar Funcionário"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
