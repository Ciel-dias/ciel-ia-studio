
"use client";

import { useState } from "react";

export default function TesteOpenAIPage() {
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function testarOpenAI() {
    setLoading(true);
    setResposta("");
    setErro("");

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Responda apenas: CIEL IA STUDIO funcionando!",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Erro ao conectar com a OpenAI.");
      }

      setResposta(data.response || "A OpenAI respondeu, mas não retornou texto.");
    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao testar a OpenAI."
      );
    } finally {
      setLoading(false);
    }
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
          maxWidth: "600px",
          padding: "32px",
          borderRadius: "20px",
          background: "#15151c",
          border: "1px solid #292936",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          Teste da OpenAI
        </h1>

        <p
          style={{
            color: "#a1a1aa",
            marginBottom: "24px",
          }}
        >
          Teste interno da integração do CIEL IA STUDIO.
        </p>

        <button
          onClick={testarOpenAI}
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
          {loading ? "Testando..." : "Testar OpenAI"}
        </button>

        {resposta && (
          <div
            style={{
              marginTop: "24px",
              padding: "18px",
              borderRadius: "12px",
              background: "#0f0f14",
              border: "1px solid #292936",
            }}
          >
            <p
              style={{
                color: "#4ade80",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Resposta da OpenAI
            </p>

            <p>{resposta}</p>
          </div>
        )}

        {erro && (
          <div
            style={{
              marginTop: "24px",
              padding: "18px",
              borderRadius: "12px",
              background: "#0f0f14",
              border: "1px solid #7f1d1d",
            }}
          >
            <p
              style={{
                color: "#f87171",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              Erro
            </p>

            <p>{erro}</p>
          </div>
        )}
      </div>
    </main>
  );
}
