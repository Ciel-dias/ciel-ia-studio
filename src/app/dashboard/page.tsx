
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

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
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "48px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
            CIEL IA STUDIO
          </h1>

          <p style={{ color: "#a1a1aa", marginTop: "6px" }}>
            Seu estúdio de criação com inteligência artificial.
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #363642",
            background: "#15151c",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </header>

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            padding: "28px",
            borderRadius: "20px",
            background: "#15151c",
            border: "1px solid #292936",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#a1a1aa", marginBottom: "8px" }}>
            Usuário conectado
          </p>

          <h2 style={{ fontSize: "20px" }}>{email}</h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderRadius: "18px",
              background: "#15151c",
              border: "1px solid #292936",
            }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
              ✨ Criar
            </h3>

            <p style={{ color: "#a1a1aa" }}>
              Em breve você poderá criar conteúdos com IA.
            </p>
          </div>

          <div
            style={{
              padding: "24px",
              borderRadius: "18px",
              background: "#15151c",
              border: "1px solid #292936",
            }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
              🖼️ Imagens
            </h3>

            <p style={{ color: "#a1a1aa" }}>
              Seu espaço para criação de imagens.
            </p>
          </div>

          <div
            style={{
              padding: "24px",
              borderRadius: "18px",
              background: "#15151c",
              border: "1px solid #292936",
            }}
          >
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
              🎬 Vídeos
            </h3>

            <p style={{ color: "#a1a1aa" }}>
              Seu espaço para geração de vídeos com Kling.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
