"use server";

import { createClient } from "@/lib/supabase/server";

export async function getClientesParaCombobox() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('cliente')
    .select('cli_id, cli_nome')
    .order('cli_nome', { ascending: true });

  if (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }

  return data.map(cliente => ({
    value: String(cliente.cli_id),
    label: cliente.cli_nome,
  }));
}


export async function getOrdensDeServico() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('ordem_servico')
    .select(`
      os_id,
      os_status,
      os_data_servico,
      os_area_nao_construida,
      os_area_tratada,
      cliente ( cli_nome ) 
    `)
    .order('os_data_servico', { ascending: false }); 

  if (error) {
    console.error("Erro ao buscar Ordens de Serviço:", error);
    return [];
  }

  return data;
}