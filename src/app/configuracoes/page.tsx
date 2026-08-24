
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setEmail(user.email ?? "");
      setNome(user.user_metadata?.nome ?? "");

      setLoading(false);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0f",
          color: "#ffffff",
        }}
      >
        Carregando...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0f",
        color: "#ffffff",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          Configurações
        </h1>

        <p
          style={{
            color: "#a1a1aa",
            marginBottom: "32px",
          }}
        >
          Gerencie as informações da sua conta.
        </p>

        <section
          style={{
            background: "#15151c",
            border: "1px solid #292936",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "20px",
            }}
          >
            Sua conta
          </h2>

          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <p
              style={{
                color: "#a1a1aa",
                fontSize: "13px",
                marginBottom: "6px",
              }}
            >
              Nome
            </p>

            <p
              style={{
                fontSize: "16px",
                wordBreak: "break-word",
              }}
            >
              {nome || "Não informado"}
            </p>
          </div>

          <div>
            <p
              style={{
                color: "#a1a1aa",
                fontSize: "13px",
                marginBottom: "6px",
              }}
            >
              E-mail
            </p>

            <p
              style={{
                fontSize: "16px",
                wordBreak: "break-word",
              }}
            >
              {email}
            </p>
          </div>
        </section>

        <section
          style={{
            background: "#15151c",
            border: "1px solid #292936",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "8px",
            }}
          >
            Segurança
          </h2>

          <p
            style={{
              color: "#a1a1aa",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            Em breve você poderá alterar sua senha e gerenciar outras opções
            de segurança.
          </p>
        </section>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #363642",
            background: "transparent",
            color: "#ffffff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sair da conta
        </button>

        <a
          href="/dashboard"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "20px",
            color: "#a1a1aa",
            textDecoration: "underline",
            fontSize: "14px",
          }}
        >
          Voltar para o dashboard
        </a>
      </div>
    </main>
  );
}
