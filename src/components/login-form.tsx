
"use client";
import { useRouter } from 'next/navigation';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { signIn } from '@/lib/supabase/actions';
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const resultado = await signIn(formData);

    if (resultado.success) {
      console.log("Login bem-sucedido!", resultado.user);
      router.push("/dashboard");
    } else {
      console.log("Erro no login:", resultado.error);
      setError('Usuário e/ou senha incorretos.')
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem vindo</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para acessar seu ambiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name='email'
                    type="email"
                    placeholder="usuario@exemplo.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha</Label>
                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <Input id="password" type="password" name='password'required placeholder='Digite sua senha' onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <Button type="submit" className="w-full cursor-pointer">
                  Entrar
                </Button>
               {error && (
                  <Alert variant="destructive" className="mt-2">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="text-center text-sm">
                Não possui uma conta?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Cadastrar-se
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}