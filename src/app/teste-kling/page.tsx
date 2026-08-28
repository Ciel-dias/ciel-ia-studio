"use client";

import { useState } from "react";

export default function TesteKlingPage() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState("");

  async function testarKling() {
    setLoading(true);
    setResultado("");

    try {
      const response = await fetch("/api/kling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt:
            "A cinematic shot of a beautiful futuristic city at sunset, realistic lighting, slow camera movement, highly detailed.",
          duration: "5",
          aspect_ratio: "16:9",
        }),
      });

      const data = await response.json();

      setResultado(JSON.stringify(data, null, 2));
    } catch (error) {
      setResultado(
        error instanceof Error
          ? error.message
          : "Erro ao testar a Kling."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07111f",
        color: "#ffffff",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1>Teste da Kling AI</h1>

        <p style={{ color: "#aab7c7" }}>
          Teste interno da integração da API Kling.
        </p>

        <button
          onClick={testarKling}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "14px 24px",
            borderRadius: "10px",
            border: "none",
            background: "#159ddd",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Enviando para Kling..." : "Testar geração"}
        </button>

        {resultado && (
          <pre
            style={{
              marginTop: "30px",
              padding: "20px",
              borderRadius: "12px",
              background: "#111c2b",
              border: "1px solid #29445f",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowX: "auto",
            }}
          >
            {resultado}
          </pre>
        )}
      </div>
    </main>
  );
}
