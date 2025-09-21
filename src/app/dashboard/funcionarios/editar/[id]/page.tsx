"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CadastrarFuncionarioPage from "../../cadastrar/page";

export default function EditarFuncionario({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [funData, setFunData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const funId = parseInt(params.id, 10);

      const { data: funcionario, error } = await supabase
        .from("funcionario")
        .select("*")
        .eq("fun_id", funId)
        .single();

      if (error) {
        console.error(error.message);
        alert("Erro ao carregar funcionário.");
        router.push("/dashboard/funcionarios");
        return;
      }

      setFunData(funcionario);
      setLoading(false);
    }

    fetchData();
  }, [params.id, router]);

  if (loading) return <div>Carregando...</div>;

  return <CadastrarFuncionarioPage initialValues={funData} />;
}
