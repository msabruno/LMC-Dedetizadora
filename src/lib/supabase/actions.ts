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



export async function getOrdensDeServico(pagina = 1, porPagina = 10) {
  const supabase = createClient();
  
  const from = (pagina - 1) * porPagina;
  const to = from + porPagina - 1;

  const { data, error, count } = await supabase
    .from('ordem_servico')
    .select(`
      os_id,
      os_status,
      os_data_servico,
      os_area_tratada,
      cliente ( cli_nome ) 
    `, { count: 'exact' }) 
    .order('os_id', { ascending: false }) 
    .range(from, to); 

  if (error) {
    console.error("Erro ao buscar Ordens de Serviço:", error);
    return { ordens: [], totalOrdens: 0 };
  }

  return { ordens: data, totalOrdens: count ?? 0 };
}


export async function getTodosClientes(pagina = 1, porPagina = 10) {
  const supabase = createClient();
  
  const from = (pagina - 1) * porPagina;
  const to = from + porPagina - 1;

  const { data, error, count } = await supabase
    .from('cliente')
    .select('*', { count: 'exact' }) 
    .order('cli_id', { ascending: true })
    .range(from, to); 

  if (error) {
    console.error("Erro ao buscar a lista de clientes:", error);
    return { clientes: [], totalClientes: 0 };
  }

  return { clientes: data, totalClientes: count ?? 0 };
}