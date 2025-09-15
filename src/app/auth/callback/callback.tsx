"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        // Usuário confirmado e logado
        router.push("/dashboard");
      } else {
        setError("Não foi possível confirmar o e-mail.");
        setLoading(false);
      }
    };

    handleSession();
  }, [router]);

  if (loading) return <p>Verificando sua conta...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return null;
}
