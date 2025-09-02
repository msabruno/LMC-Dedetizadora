
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); 

    const loginValido = true;

    if (loginValido) {
      console.log("Login bem-sucedido! Redirecionando para /dashboard...");
      router.push('/dashboard');
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem vindo</CardTitle>
          <CardDescription>
            Faça Login com sua conta Apple ou Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" type="button">
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="..." fill="currentColor" /></svg>
                  Login com Apple
                </Button>
                <Button variant="outline" className="w-full" type="button">
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="..." fill="currentColor" /></svg>
                  Login com Google
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Ou continue com
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@exemplo.com"
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
                  <Input id="password" type="password" required />
                </div>
                <Link rel="stylesheet" href="/dashboard">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </Link>
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