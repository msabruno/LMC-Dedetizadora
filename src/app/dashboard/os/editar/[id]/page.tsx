"use client";

import { useEffect, useState } from "react";
// 1. IMPORTAMOS O 'useParams'
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Supondo que seu formulário reutilizável se chame 'FormularioOS'
import FormularioOS from "../../cadastrar/cadastrarOs";

// 2. REMOVEMOS 'params' DAS PROPRIEDADES DA FUNÇÃO
export default function EditarOSPage() {
  const router = useRouter();
  // 3. USAMOS O HOOK PARA PEGAR OS PARÂMETROS DA URL
  const params = useParams();

  const [osData, setOsData] = useState<any>();
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // O 'params.id' agora vem do hook useParams
      const osId = parseInt(params.id as string, 10);

      if (isNaN(osId)) {
        toast.error("ID da Ordem de Serviço inválido.");
        router.push("/dashboard/os");
        return;
      }
      
      const supabase = createClient();

      // Busca OS
      const { data: os, error: osError } = await supabase
        .from("ordem_servico")
        .select("*")
        .eq("os_id", osId)
        .single();

      if (osError || !os) {
        console.error("Erro ao carregar dados da OS:", osError?.message);
        toast.error("Erro ao carregar os dados da Ordem de Serviço.");
        router.push("/dashboard/os");
        return;
      }
      setOsData(os);

      // Busca clientes
      const { data: cli, error: cliError } = await supabase
        .from("cliente")
        .select("cli_id, cli_nome");
      
      if (cliError) {
        console.error("Erro ao carregar clientes:", cliError.message);
        toast.error("Erro ao carregar a lista de clientes.");
      } else {
        setClientes(cli ?? []);
      }

      setLoading(false);
    }

    if (params.id) {
        fetchData();
    }
  }, [params.id, router]);

  if (loading) {
    return (
        <div className="flex h-full w-full items-center justify-center p-8">
            Carregando dados da Ordem de Serviço...
        </div>
    );
  }

  const clientesFormatados = clientes.map(c => ({
    value: String(c.cli_id),
    label: c.cli_nome,
  }));
  
  return <FormularioOS clientes={clientesFormatados} initialValues={osData} />;
}