import { getClientesParaCombobox } from "@/lib/supabase/actions";
import FormularioCadastroOS from "./cadastrarOs"; 
export default async function CadastrarOSPage() {
  
  const clientes = await getClientesParaCombobox();

  return <FormularioCadastroOS clientes={clientes} />;
}