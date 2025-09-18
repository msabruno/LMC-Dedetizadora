"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMaskInput } from "react-imask";
import { postUsuario } from "@/lib/supabase/actions";

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  // States para cada campo
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargo, setCargo] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");

  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem(null);
    setErro(null);
    setCarregando(true);

    // Cria FormData e adiciona todos os campos
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("telefone", telefone);
    formData.append("cargo", cargo);
    formData.append("password", senha);
    formData.append("password-confirm", senhaConfirm);

    const resultado = await postUsuario(formData);

    if (resultado.success) {
      setMensagem("Usuário registrado com sucesso!");
      // Reseta os campos
      setNome("");
      setEmail("");
      setTelefone("");
      setCargo("");
      setSenha("");
      setSenhaConfirm("");
    } else {
      setErro(resultado.error || "Erro ao registrar usuário.");
    }

    setCarregando(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os campos para criar uma conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            
            {/* Campos do formulário */}
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Digite seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="telefone">Telefone</Label>
                <IMaskInput
                  name="telefone"
                  mask="(00) 00000-0000"
                  placeholder="(99) 99999-9999"
                  value={telefone}
                  onAccept={(value: string) => setTelefone(value)}
                  className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                  )}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  name="cargo"
                  type="text"
                  placeholder="Digite seu cargo"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={senha}
                  placeholder="Crie sua senha"
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password-confirm">Confirme sua Senha</Label>
                <Input
                  id="password-confirm"
                  name="password-confirm"
                  type="password"
                  placeholder="Confirme sua senha"
                  value={senhaConfirm}
                  onChange={(e) => setSenhaConfirm(e.target.value)}
                  required
                />
              </div>

              {/* Botão submit */}
              <Button type="submit" className="w-full cursor-pointer" disabled={carregando}>
                {carregando ? "Cadastrando..." : "Cadastrar-se"}
              </Button>

              {/* Mensagens */}
              {mensagem && <p className="text-green-600 text-center">{mensagem}</p>}
              {erro && <p className="text-red-600 text-center">{erro}</p>}
            </div>

            {/* Link de login */}
            <div className="text-center text-sm mt-4">
              Já possui uma conta?{" "}
              <a href="/" className="underline underline-offset-4">Entrar</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
