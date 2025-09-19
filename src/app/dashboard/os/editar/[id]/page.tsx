"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import FormularioOS from "../../cadastrar/formulario";


export default function EditarOSPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [osData, setOsData] = useState<any>();
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const osId = parseInt(params.id, 10);

      // Busca OS
      const { data: os, error: osError } = await supabase
        .from("ordem_servico")
        .select("*")
        .eq("os_id", osId)
        .single();

      if (osError) return alert(osError.message);
      setOsData(os);

      // Busca clientes
      const { data: cli } = await supabase
        .from("cliente")
        .select("cli_id, cli_nome");
      setClientes(cli ?? []);
    }

    fetchData();
  }, [params.id]);

  if (!osData) return <div>Carregando...</div>;

  const clientesFormatados = clientes.map(c => ({
    value: String(c.cli_id),
    label: c.cli_nome,
  }));
  console.log("CLIENTES", clientesFormatados)
  return <FormularioOS clientes={clientesFormatados} initialValues={osData} />;
}
