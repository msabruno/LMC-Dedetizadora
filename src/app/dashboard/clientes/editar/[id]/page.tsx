"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CadastrarClientePage from "../../cadastrar/page";


export default function EditarFuncionario({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [cliData, setCliData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const cliId = parseInt(params.id, 10);

      const { data: funcionario, error } = await supabase
        .from("cliente")
        .select("*")
        .eq("cli_id", cliId)
        .single();

      if (error) {
        console.error(error.message);
        alert("Erro ao carregar funcionário.");
        router.push("/dashboard/clientes");
        return;
      }

      setCliData(funcionario);
      setLoading(false);
    }

    fetchData();
  }, [params.id, router]);

  if (loading) return <div>Carregando...</div>;

  return <CadastrarClientePage initialValues={cliData} />;
}
