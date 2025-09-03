"use server";

// 1. Importe a função 'createClient' do arquivo de SERVIDOR
import { createClient } from "@/lib/supabase/server";

export async function getClientesParaCombobox() {
  // 2. Chame a função createClient()
  const supabase = createClient();
  
  // 3. Agora o supabase.from() vai funcionar!
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