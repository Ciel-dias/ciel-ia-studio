
"use client";

import { useState } from "react";

export default function CriarPrompts() {
  const [ideia, setIdeia] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function gerarPrompt() {
    if (!ideia) return;

    setLoading(true);
    setPrompt("");

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Transforme essa ideia em um prompt profissional para criação de imagem ou vídeo com IA:

${ideia}`,
        }),
      });

      const data = await response.json();

      setPrompt(data.result || data.message || "Não foi possível gerar o prompt.");
    } catch (error) {
      setPrompt("Erro ao conectar com a OpenAI.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-6">
          ✨ Criar Prompts
        </h1>

        <p className="text-gray-400 mb-6">
          Transforme suas ideias em prompts profissionais usando IA.
        </p>

        <textarea
          className="w-full h-40 p-4 rounded-xl bg-gray-900 border border-gray-700"
          placeholder="Digite sua ideia..."
          value={ideia}
          onChange={(e) => setIdeia(e.target.value)}
        />

        <button
          onClick={gerarPrompt}
          disabled={loading}
          className="mt-5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Gerando..." : "✨ Gerar Prompt"}
        </button>

        {prompt && (
          <div className="mt-8 p-5 rounded-xl bg-gray-900 border border-gray-700">
            <h2 className="text-xl font-bold mb-3">
              Prompt gerado:
            </h2>

            <p className="whitespace-pre-wrap">
              {prompt}
            </p>

            <button
              className="mt-4 px-4 py-2 bg-gray-700 rounded-lg"
              onClick={() => navigator.clipboard.writeText(prompt)}
            >
              📋 Copiar Prompt
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
