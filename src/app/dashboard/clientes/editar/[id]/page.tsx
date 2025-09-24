"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

import FormularioCliente from "../../cadastrar/page";

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams(); 

  const [clienteData, setClienteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCliente() {
      const clienteId = parseInt(params.id as string, 10);

      if (isNaN(clienteId)) {
        toast.error("ID de cliente inválido.");
        router.push("/dashboard/clientes");
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("cliente")
        .select("*")
        .eq("cli_id", clienteId)
        .single();

      if (error || !data) {
        console.error("Erro ao carregar dados do cliente:", error?.message);
        toast.error("Erro ao carregar os dados do cliente.");
        router.push("/dashboard/clientes");
        return;
      }

      setClienteData(data);
      setLoading(false);
    }

    if (params.id) {
      fetchCliente();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        Carregando dados do cliente...
      </div>
    );
  }

  return <FormularioCliente initialValues={clienteData} />;
}