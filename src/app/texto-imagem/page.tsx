"use client";

import { useState } from "react";

export default function TextoImagemPage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("Realista");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) {
      alert("Digite uma descrição para gerar sua imagem.");
      return;
    }

    setLoading(true);

    // Futuramente conectaremos aqui a API de geração de imagens.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setLoading(false);

    alert(
      "A estrutura de geração está pronta. Agora vamos conectar a API de imagens."
    );
  }

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #07111f;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
        }

        .page {
          min-height: 100vh;
          color: #fff;
          background:
            radial-gradient(
              circle at 80% 15%,
              rgba(20, 119, 190, 0.4),
              transparent 38%
            ),
            radial-gradient(
              circle at 15% 70%,
              rgba(15, 76, 125, 0.28),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #06101e 0%,
              #081a30 48%,
              #0b3556 100%
            );
        }

        .topbar {
          min-height: 74px;
          padding: 0 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(4, 12, 24, 0.9);
          border-bottom: 1px solid rgba(100, 180, 255, 0.18);
          backdrop-filter: blur(12px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon {
          font-size: 27px;
        }

        .brand-name {
          font-size: 20px;
          font-weight: 700;
        }

        .back {
          color: #bfeaff;
          text-decoration: none;
          font-size: 14px;
          transition: 0.2s;
        }

        .back:hover {
          color: #6ed7ff;
          text-shadow: 0 0 12px rgba(75, 199, 255, 0.8);
        }

        .content {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 55px 0 70px;
        }

        .title-area {
          text-align: center;
          margin-bottom: 38px;
        }

        .title-area h1 {
          margin: 0;
          font-size: clamp(32px, 5vw, 52px);
          text-transform: uppercase;
        }

        .title-area p {
          margin: 14px auto 0;
          max-width: 650px;
          color: #b7c5d5;
          font-size: 17px;
        }

        .workspace {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 28px;
          align-items: stretch;
        }

        .panel {
          border-radius: 22px;
          padding: 28px;
          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.95),
              rgba(14, 25, 40, 0.97)
            );
          border: 2px solid #58c9ff;
          box-shadow:
            0 0 8px rgba(70, 199, 255, 0.8),
            0 0 22px rgba(43, 167, 255, 0.35),
            inset 0 0 22px rgba(56, 174, 255, 0.07);
        }

        .panel h2 {
          margin: 0 0 22px;
          font-size: 21px;
        }

        .label {
          display: block;
          margin: 20px 0 9px;
          color: #c7d3df;
          font-size: 14px;
          font-weight: 700;
        }

        .prompt {
          width: 100%;
          min-height: 210px;
          resize: vertical;
          padding: 16px;
          border: 1px solid rgba(94, 203, 255, 0.45);
          border-radius: 14px;
          outline: none;
          background: rgba(3, 13, 25, 0.8);
          color: #fff;
          font-size: 15px;
          line-height: 1.5;
        }

        .prompt:focus {
          border-color: #63d3ff;
          box-shadow: 0 0 15px rgba(70, 199, 255, 0.25);
        }

        .options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        select {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          border: 1px solid rgba(94, 203, 255, 0.35);
          outline: none;
          background: #0a192b;
          color: #fff;
          font-size: 14px;
        }

        .credits {
          margin-top: 20px;
          padding: 13px 15px;
          border-radius: 12px;
          background: rgba(29, 112, 157, 0.16);
          border: 1px solid rgba(94, 203, 255, 0.25);
          color: #bfeaff;
          font-size: 14px;
        }

        .generate {
          width: 100%;
          margin-top: 22px;
          padding: 16px;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          color: #04101b;
          background: linear-gradient(
            90deg,
            #5ed2ff,
            #75e0ff
          );
          font-size: 16px;
          font-weight: 800;
          box-shadow:
            0 0 10px rgba(70, 199, 255, 0.7),
            0 0 24px rgba(43, 167, 255, 0.35);
          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .generate:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 14px rgba(85, 211, 255, 1),
            0 0 32px rgba(43, 167, 255, 0.55);
        }

        .generate:disabled {
          cursor: wait;
          opacity: 0.65;
          transform: none;
        }

        .preview {
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 16px;
          border: 1px dashed rgba(104, 207, 255, 0.35);
          background:
            radial-gradient(
              circle,
              rgba(43, 167, 255, 0.08),
              transparent 55%
            ),
            rgba(2, 12, 24, 0.55);
        }

        .preview-icon {
          font-size: 62px;
          margin-bottom: 18px;
        }

        .preview h3 {
          margin: 0;
          font-size: 20px;
        }

        .preview p {
          margin: 10px auto 0;
          max-width: 350px;
          color: #8798aa;
          line-height: 1.5;
        }

        .loading {
          animation: pulse 1.1s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.45;
          }

          50% {
            opacity: 1;
          }
        }

        @media (max-width: 850px) {
          .topbar {
            padding: 0 22px;
          }

          .workspace {
            grid-template-columns: 1fr;
          }

          .preview {
            min-height: 380px;
          }
        }

        @media (max-width: 520px) {
          .topbar {
            min-height: 68px;
            padding: 0 15px;
          }

          .brand-name {
            font-size: 16px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .content {
            width: min(100% - 28px, 430px);
            padding-top: 38px;
          }

          .panel {
            padding: 21px;
            border-radius: 18px;
          }

          .options {
            grid-template-columns: 1fr;
          }

          .preview {
            min-height: 320px;
          }
        }
      `}</style>

      <main className="page">
        <header className="topbar">
          <div className="brand">
            <span className="brand-icon">✨</span>
            <span className="brand-name">
              CIEL IA STUDIO
            </span>
          </div>

          <a href="/dashboard" className="back">
            ← Voltar ao Dashboard
          </a>
        </header>

        <section className="content">
          <div className="title-area">
            <h1>Texto → Imagem</h1>

            <p>
              Transforme suas ideias em imagens incríveis
              usando inteligência artificial.
            </p>
          </div>

          <div className="workspace">
            <section className="panel">
              <h2>✨ Criar imagem</h2>

              <label className="label">
                Descreva o que você deseja criar
              </label>

              <textarea
                className="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Exemplo: Uma cidade futurista brasileira ao pôr do sol, extremamente detalhada, cinematográfica..."
              />

              <label className="label">
                Proporção
              </label>

              <select
                value={aspectRatio}
                onChange={(e) =>
                  setAspectRatio(e.target.value)
                }
              >
                <option value="1:1">
                  1:1 — Quadrada
                </option>

                <option value="16:9">
                  16:9 — Paisagem
                </option>

                <option value="9:16">
                  9:16 — Vertical
                </option>
              </select>

              <label className="label">
                Estilo
              </label>

              <select
                value={style}
                onChange={(e) =>
                  setStyle(e.target.value)
                }
              >
                <option>Realista</option>
                <option>Cinematográfico</option>
                <option>Artístico</option>
                <option>Anime</option>
                <option>3D</option>
              </select>

              <div className="credits">
                💎 Seus créditos: <strong>30</strong>
              </div>

              <button
                className="generate"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading
                  ? "✨ Preparando..."
                  : "✨ Gerar Imagem"}
              </button>
            </section>

            <section className="panel">
              <h2>🖼️ Resultado</h2>

              <div className={`preview ${loading ? "loading" : ""}`}>
                <div>
                  <div className="preview-icon">
                    {loading ? "✨" : "🖼️"}
                  </div>

                  <h3>
                    {loading
                      ? "Preparando sua criação..."
                      : "Sua imagem aparecerá aqui"}
                  </h3>

                  <p>
                    Escreva um prompt ao lado e clique em
                    “Gerar Imagem” para começar.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
