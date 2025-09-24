"use client";

import { useEffect, useState } from "react";
// 1. IMPORTAMOS O 'useParams'
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Supondo que seu formulário reutilizável se chame 'FormularioFuncionario'
import FormularioFuncionario from "../../cadastrar/page";

// 2. REMOVEMOS 'params' DAS PROPRIEDADES DA FUNÇÃO
export default function EditarFuncionarioPage() {
  const router = useRouter();
  // 3. USAMOS O HOOK PARA PEGAR OS PARÂMETROS DA URL
  const params = useParams(); 

  const [funcionarioData, setFuncionarioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFuncionario() {
      // O 'params.id' agora vem do hook useParams
      const funcionarioId = parseInt(params.id as string, 10);

      if (isNaN(funcionarioId)) {
        toast.error("ID de funcionário inválido.");
        router.push("/dashboard/funcionarios");
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("funcionario")
        .select("*")
        .eq("fun_id", funcionarioId)
        .single();

      if (error || !data) {
        console.error("Erro ao carregar dados do funcionário:", error?.message);
        toast.error("Erro ao carregar os dados do funcionário.");
        router.push("/dashboard/funcionarios");
        return;
      }

      setFuncionarioData(data);
      setLoading(false);
    }

    if (params.id) {
      fetchFuncionario();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        Carregando dados do funcionário...
      </div>
    );
  }

  return <FormularioFuncionario initialValues={funcionarioData} />;
}