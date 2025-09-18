"use server";

import { createClient } from "./server";

// Buscar clientes para combobox
export async function getClientesParaCombobox() {
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from("cliente")
    .select("cli_id, cli_nome")
    .order("cli_nome", { ascending: true });

  if (error) {
    console.error("Erro ao buscar clientes:", error.message);
    return [];
  }

  return data.map((cliente: { cli_id: any; cli_nome: any; }) => ({
    value: String(cliente.cli_id),
    label: cliente.cli_nome,
  }));
}

// Paginação de ordens de serviço
export async function getOrdensDeServico(pagina = 1, porPagina = 10) {
  const supabase = await createClient();

  const from = (pagina - 1) * porPagina;
  const to = from + porPagina - 1;

  const { data, error, count } = await supabase
    .from("ordem_servico")
    .select(
      `
      os_id,
      os_status,
      os_data_servico,
      os_area_tratada,
      cliente ( cli_nome )
    `,
      { count: "exact" }
    )
    .order("os_id", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Erro ao buscar ordens:", error.message);
    return { ordens: [], totalOrdens: 0 };
  }

  return { ordens: data ?? [], totalOrdens: count ?? 0 };
}

// Lista de clientes com paginação
export async function getTodosClientes(pagina = 1, porPagina = 10) {
  const supabase = await createClient();

  const from = (pagina - 1) * porPagina;
  const to = from + porPagina - 1;

  const { data, error, count } = await supabase
    .from("cliente")
    .select("*", { count: "exact" })
    .order("cli_id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Erro ao buscar clientes:", error.message);
    return { clientes: [], totalClientes: 0 };
  }

  return { clientes: data ?? [], totalClientes: count ?? 0 };
}

// Lista de funcionários com paginação
export async function getTodosFuncionarios(pagina = 1, porPagina = 10) {
  const supabase = await createClient();

  const from = (pagina - 1) * porPagina;
  const to = from + porPagina - 1;

  const { data, error, count } = await supabase
    .from("funcionario")
    .select("*", { count: "exact" })
    .order("fun_id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Erro ao buscar funcionários:", error.message);
    return { funcionarios: [], totalFuncionarios: 0 };
  }

  return { funcionarios: data ?? [], totalFuncionarios: count ?? 0 };
}

export async function postUsuario(formData: FormData) {
  const nome = (formData.get("nome") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const telefone = (formData.get("telefone") as string)?.trim();
  const cargo = (formData.get("cargo") as string)?.trim();
  const senha = (formData.get("password") as string)?.trim();
  const senhaConfirm = (formData.get("password-confirm") as string)?.trim();

  if (senha !== senhaConfirm) {
    return { success: false, error: "As senhas não conferem" };
  }

  if (senha.length < 6 || senha.length > 128) {
    return { success: false, error: "A senha deve ter no mínimo 6 caracteres" };
  }

  const supabase = await createClient();


  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: senha,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`, // <-- URL de callback
    },
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  if (!authData.user) {
    return { success: false, error: "Erro desconhecido ao criar usuário" };
  }


  const { data, error } = await supabase
    .from("funcionario")
    .insert({
      fun_nome: nome,
      fun_cargo: cargo,
      fun_telefone: telefone,
      fun_email: email,
    })
    .select()
    .single();

  if (error) {
    // remove usuário do Auth se falhar a inserção
    await supabase.auth.admin.deleteUser(authData.user.id);
    return { success: false, error: error.message };
  }

  return { success: true, funcionario: data };
}



// services/auth.ts
export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const senha = (formData.get("password") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    user: data.user,
    session: data.session,
  };
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await (await supabase).auth.getUser();

  if (error || !data.user) return null;

  return data.user;
}
