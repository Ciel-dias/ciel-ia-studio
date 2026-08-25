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
          prompt: `Crie um prompt profissional de alta qualidade para IA baseado nesta ideia:

${ideia}`,
        }),
      });

      const data = await response.json();

      setPrompt(
        data.result ||
        data.message ||
        "Não foi possível gerar o prompt."
      );

    } catch {
      setPrompt("Erro ao conectar com a inteligência artificial.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black text-white p-6">

      <div className="max-w-4xl mx-auto">

        {/* Cabeçalho */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            ✨ Criar Prompts
          </h1>

          <p className="text-gray-400 mt-3">
            Transforme suas ideias em prompts profissionais usando IA.
          </p>

        </div>


        {/* Card principal */}
        <div className="bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 shadow-2xl">

          <label className="text-sm text-gray-300">
            Sua ideia
          </label>

          <textarea
            className="w-full h-44 mt-3 p-4 rounded-2xl bg-gray-950 border border-blue-500/30 focus:border-blue-400 outline-none text-white placeholder-gray-500"
            placeholder="Ex: Uma mulher caminhando em uma cidade futurista com estilo cinematográfico..."
            value={ideia}
            onChange={(e) => setIdeia(e.target.value)}
          />


          <button
            onClick={gerarPrompt}
            disabled={loading}
            className="mt-5 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 font-bold hover:scale-[1.02] transition disabled:opacity-50"
          >
            {loading ? "🤖 Criando..." : "✨ Gerar Prompt"}
          </button>

        </div>


        {/* Resultado */}
        {prompt && (

          <div className="mt-8 bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6">

            <h2 className="text-xl font-bold mb-4">
              🚀 Prompt gerado
            </h2>

            <div className="bg-gray-950 rounded-2xl p-5 text-gray-200 whitespace-pre-wrap">
              {prompt}
            </div>


            <button
              onClick={() => navigator.clipboard.writeText(prompt)}
              className="mt-5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
            >
              📋 Copiar Prompt
            </button>

          </div>

        )}

      </div>

    </main>
  );
}
