import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatTelefone(telefone: string | null): string {
  if (!telefone) return "N/A";

  // remove tudo que não for número
  const cleaned = telefone.replace(/\D/g, "");

  // aplica a máscara
  if (cleaned.length === 11) {
    // celular: (00) 00000-0000
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    // fixo: (00) 0000-0000
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return telefone; // se não bater com 10 ou 11 dígitos, retorna como está
}
