"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#0b0b0f",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "20px",
          background: "#15151c",
          border: "1px solid #292936",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          CIEL IA STUDIO
        </h1>

        <p
          style={{
            color: "#a1a1aa",
            marginBottom: "28px",
          }}
        >
          Entre na sua conta para continuar.
        </p>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
            }}
          >
            E-mail
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "18px",
              borderRadius: "10px",
              border: "1px solid #363642",
              background: "#0f0f14",
              color: "#ffffff",
              outline: "none",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
            }}
          >
            Senha
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "20px",
              borderRadius: "10px",
              border: "1px solid #363642",
              background: "#0f0f14",
              color: "#ffffff",
              outline: "none",
            }}
          />

          {error && (
            <p
              style={{
                color: "#f87171",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: "#ffffff",
              color: "#000000",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            color: "#a1a1aa",
            fontSize: "14px",
          }}
        >
          Ainda não tem uma conta?{" "}
          <a
            href="/cadastro"
            style={{
              color: "#ffffff",
              textDecoration: "underline",
            }}
          >
            Criar conta
          </a>
        </p>
      </div>
    </main>
  );
}
