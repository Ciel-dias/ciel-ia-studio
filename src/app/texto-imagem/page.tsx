"use client";

import { useState } from "react";

export default function TextoImagemPage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("Realista");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorData, setErrorData] = useState<any>(null);

  async function handleGenerate() {
    if (!prompt.trim()) {
      alert("Digite uma descrição para gerar sua imagem.");
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorData(null);

    try {
      const finalPrompt =
        `${prompt.trim()}. ` +
        `Estilo visual: ${style}. ` +
        `Alta qualidade, extremamente detalhada, fotorealista.`;

      const response = await fetch("/api/kling-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          aspect_ratio: aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.status !== "success") {
        setErrorData(data);

        throw new Error(
          data?.message ||
            "A Kling recusou a solicitação de imagem."
        );
      }

      setResult(data);
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);

      if (!errorData) {
        setErrorData({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Erro ao conectar com a API da Kling.",
        });
      }
    } finally {
      setLoading(false);
    }
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
          background: #07111f !important;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
        }

        a,
        button,
        textarea,
        select {
          -webkit-tap-highlight-color: transparent;
        }

        .page {
          min-height: 100vh;
          color: #ffffff;

          background:
            radial-gradient(
              circle at 75% 20%,
              rgba(20, 119, 190, 0.42),
              transparent 38%
            ),
            radial-gradient(
              circle at 15% 65%,
              rgba(15, 76, 125, 0.32),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #06101e 0%,
              #081a30 48%,
              #0b3556 100%
            );

          overflow-x: hidden;
        }

        /* =========================
           TOPO
        ========================= */

        .topbar {
          width: 100%;
          min-height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 42px;

          background: rgba(4, 12, 24, 0.92);

          border-bottom: 1px solid
            rgba(100, 180, 255, 0.18);

          backdrop-filter: blur(12px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;

          white-space: nowrap;
        }

        .brand-icon {
          font-size: 28px;

          filter: drop-shadow(
            0 0 10px rgba(75, 199, 255, 0.8)
          );
        }

        .brand-name {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .back {
          color: #7bd8ff;

          text-decoration: none;

          font-size: 17px;
          font-weight: 700;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .back:hover {
          color: #b4ecff;

          text-shadow:
            0 0 12px rgba(75, 199, 255, 0.8);

          transform: translateX(-2px);
        }

        /* =========================
           CONTEÚDO
        ========================= */

        .content {
          width: min(1180px, calc(100% - 48px));

          margin: 0 auto;

          padding:
            58px 0 76px;
        }

        .title-area {
          text-align: center;

          margin-bottom: 38px;
        }

        .title-area h1 {
          margin: 0;

          font-size:
            clamp(34px, 5vw, 56px);

          line-height: 1.12;

          font-weight: 700;

          letter-spacing: 0.5px;

          text-transform: uppercase;
        }

        .title-area p {
          margin:
            20px auto 0;

          max-width: 650px;

          color: #b9c5d4;

          font-size:
            clamp(17px, 2vw, 21px);

          line-height: 1.5;
        }

        .workspace {
          display: grid;

          grid-template-columns:
            0.9fr 1.1fr;

          gap: 28px;

          align-items: stretch;
        }

        .panel {
          min-width: 0;

          border-radius: 22px;

          padding: 28px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.95),
              rgba(14, 25, 40, 0.97)
            );

          border:
            2px solid #58c9ff;

          box-shadow:
            0 0 8px rgba(70, 199, 255, 0.9),
            0 0 22px rgba(43, 167, 255, 0.48),
            inset 0 0 22px rgba(56, 174, 255, 0.08);
        }

        .panel h2 {
          margin:
            0 0 22px;

          font-size: 21px;
        }

        .label {
          display: block;

          margin:
            20px 0 9px;

          color: #c7d3df;

          font-size: 14px;

          font-weight: 700;
        }

        .prompt {
          width: 100%;

          min-height: 210px;

          resize: vertical;

          padding: 16px;

          border:
            1px solid rgba(94, 203, 255, 0.45);

          border-radius: 14px;

          outline: none;

          background:
            rgba(3, 13, 25, 0.8);

          color: #ffffff;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 15px;

          line-height: 1.5;
        }

        .prompt::placeholder {
          color: #718195;
        }

        .prompt:focus {
          border-color: #63d3ff;

          box-shadow:
            0 0 15px rgba(70, 199, 255, 0.25);
        }

        select {
          width: 100%;

          padding: 13px;

          border-radius: 12px;

          border:
            1px solid rgba(94, 203, 255, 0.35);

          outline: none;

          background: #0a192b;

          color: #ffffff;

          font-size: 14px;
        }

        .credits {
          margin-top: 20px;

          padding: 13px 15px;

          border-radius: 12px;

          background:
            rgba(29, 112, 157, 0.16);

          border:
            1px solid rgba(94, 203, 255, 0.25);

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

          background:
            linear-gradient(
              90deg,
              #5ed2ff,
              #75e0ff
            );

          font-size: 16px;

          font-weight: 800;

          box-shadow:
            0 0 10px rgba(70, 199, 255, 0.7),
            0 0 24px rgba(43, 167, 255, 0.35);
        }

        .generate:disabled {
          cursor: wait;

          opacity: 0.65;
        }

        .preview {
          min-height: 500px;

          display: flex;

          align-items: center;

          justify-content: center;

          text-align: center;

          border-radius: 16px;

          border:
            1px dashed rgba(104, 207, 255, 0.35);

          background:
            radial-gradient(
              circle,
              rgba(43, 167, 255, 0.08),
              transparent 55%
            ),
            rgba(2, 12, 24, 0.55);

          padding: 25px;
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
          margin:
            10px auto 0;

          max-width: 430px;

          color: #8798aa;

          line-height: 1.5;
        }

        .loading {
          animation:
            pulse 1.1s infinite;
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

        .task-box {
          margin-top: 22px;

          padding: 16px;

          border-radius: 12px;

          background:
            rgba(20, 150, 90, 0.12);

          border:
            1px solid rgba(80, 220, 150, 0.35);

          text-align: left;

          overflow-wrap: anywhere;
        }

        .task-title {
          color: #72f0b1;

          font-weight: 700;

          margin-bottom: 8px;
        }

        .task-id {
          color: #c8d7e5;

          font-size: 13px;

          line-height: 1.5;
        }

        .error-box {
          margin-top: 22px;

          padding: 18px;

          border-radius: 12px;

          background:
            rgba(180, 40, 40, 0.15);

          border:
            1px solid rgba(255, 100, 100, 0.35);

          color: #ffb0b0;

          text-align: left;

          line-height: 1.6;

          overflow-wrap: anywhere;
        }

        .error-title {
          color: #ff8080;

          font-size: 17px;

          font-weight: 800;

          margin-bottom: 14px;
        }

        .error-line {
          margin-bottom: 7px;
        }

        .error-label {
          color: #ffffff;

          font-weight: 700;
        }

        .error-json {
          margin-top: 14px;

          padding: 12px;

          max-height: 260px;

          overflow: auto;

          border-radius: 8px;

          background: rgba(0, 0, 0, 0.35);

          color: #d7e8f5;

          font-family:
            monospace;

          font-size: 11px;

          white-space: pre-wrap;
        }

        /* =========================
           FOOTER
        ========================= */

        .footer {
          border-top:
            1px solid rgba(100, 180, 255, 0.18);

          background:
            linear-gradient(
              180deg,
              rgba(4, 15, 29, 0.96),
              rgba(3, 11, 22, 1)
            );

          padding:
            52px 42px 24px;
        }

        .footer-inner {
          width:
            min(1180px, 100%);

          margin: 0 auto;
        }

        .footer-brand {
          margin-bottom: 42px;
        }

        .footer-brand h2 {
          margin:
            0 0 8px;

          font-size: 24px;
        }

        .footer-brand p {
          margin: 0;

          color: #9eacbd;

          font-size: 15px;
        }

        .footer-columns {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 50px;
        }

        .footer-column h3 {
          margin:
            0 0 18px;

          font-size: 16px;
        }

        .footer-column a {
          display: block;

          width: fit-content;

          margin-bottom: 12px;

          color: #aebaca;

          text-decoration: none;

          font-size: 14px;
        }

        .footer-bottom {
          margin-top: 36px;

          padding-top: 22px;

          border-top:
            1px solid rgba(100, 180, 255, 0.16);

          text-align: center;

          color: #8997a9;

          font-size: 13px;
        }

        /* =========================
           RESPONSIVO
        ========================= */

        @media (max-width: 850px) {
          .topbar {
            padding:
              0 22px;
          }

          .workspace {
            grid-template-columns: 1fr;
          }

          .preview {
            min-height: 380px;
          }
        }

        @media (max-width: 650px) {
          .topbar {
            min-height: 68px;

            padding:
              14px 16px;

            flex-wrap: wrap;

            justify-content: center;
          }

          .brand {
            width: 100%;

            justify-content: center;
          }

          .brand-name {
            font-size: 16px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .back {
            font-size: 13px;
          }

          .content {
            width:
              min(100% - 32px, 430px);

            padding:
              42px 0 55px;
          }

          .title-area {
            margin-bottom: 30px;
          }

          .title-area h1 {
            font-size: 34px;
          }

          .title-area p {
            font-size: 16px;
          }

          .panel {
            padding: 21px;

            border-radius: 19px;
          }

          .preview {
            min-height: 320px;
          }

          .footer {
            padding:
              42px 24px 22px;
          }

          .footer-columns {
            grid-template-columns: 1fr;

            gap: 30px;
          }
        }
      `}</style>

      <main className="page">

        {/* =========================
            CABEÇALHO
        ========================= */}

        <header className="topbar">

          <div className="brand">

            <span className="brand-icon">
              ✨
            </span>

            <span className="brand-name">
              CIEL IA STUDIO
            </span>

          </div>

          <a
            href="/dashboard"
            className="back"
          >
            ← Voltar ao Dashboard
          </a>

        </header>

        {/* =========================
            CONTEÚDO
        ========================= */}

        <section className="content">

          <div className="title-area">

            <h1>
              TEXTO → IMAGEM
            </h1>

            <p>
              Transforme suas ideias em imagens incríveis
              usando inteligência artificial.
            </p>

          </div>

          <div className="workspace">

            <section className="panel">

              <h2>
                ✨ Criar imagem
              </h2>

              <label className="label">
                Descreva o que você deseja criar
              </label>

              <textarea
                className="prompt"
                value={prompt}
                onChange={(e) =>
                  setPrompt(e.target.value)
                }
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
                <option>
                  Realista
                </option>

                <option>
                  Cinematográfico
                </option>

                <option>
                  Artístico
                </option>

                <option>
                  Anime
                </option>

                <option>
                  3D
                </option>
              </select>

              <div className="credits">
                💎 Seus créditos:{" "}
                <strong>
                  30
                </strong>
              </div>

              <button
                className={`generate ${
                  loading ? "loading" : ""
                }`}
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading
                  ? "✨ Enviando para a Kling..."
                  : "✨ Gerar Imagem"}
              </button>

            </section>

            <section className="panel">

              <h2>
                🖼️ Resultado
              </h2>

              <div
                className={`preview ${
                  loading ? "loading" : ""
                }`}
              >

                <div>

                  <div className="preview-icon">
                    {loading
                      ? "✨"
                      : result
                      ? "✅"
                      : errorData
                      ? "⚠️"
                      : "🖼️"}
                  </div>

                  <h3>

                    {loading
                      ? "Enviando sua criação para a Kling..."
                      : result
                      ? "Tarefa enviada com sucesso!"
                      : errorData
                      ? "A Kling recusou a solicitação"
                      : "Sua imagem aparecerá aqui"}

                  </h3>

                  <p>

                    {loading
                      ? "Aguarde enquanto a Kling recebe seu pedido."
                      : result
                      ? "A Kling recebeu a solicitação."
                      : errorData
                      ? "Confira abaixo os detalhes retornados pela API."
                      : "Escreva um prompt ao lado e clique em “Gerar Imagem” para começar."}

                  </p>

                  {result?.taskId && (
                    <div className="task-box">

                      <div className="task-title">
                        ✅ Task ID recebido
                      </div>

                      <div className="task-id">
                        {result.taskId}
                      </div>

                    </div>
                  )}

                  {errorData && (
                    <div className="error-box">

                      <div className="error-title">
                        ⚠️ Detalhes do erro
                      </div>

                      <div className="error-line">
                        <span className="error-label">
                          HTTP:
                        </span>{" "}
                        {errorData.httpStatus ?? "N/A"}
                      </div>

                      <div className="error-line">
                        <span className="error-label">
                          Código Kling:
                        </span>{" "}
                        {errorData.klingCode ?? "N/A"}
                      </div>

                      <div className="error-line">
                        <span className="error-label">
                          Mensagem Kling:
                        </span>{" "}
                        {errorData.klingMessage ?? "N/A"}
                      </div>

                      <div className="error-line">
                        <span className="error-label">
                          Request ID:
                        </span>{" "}
                        {errorData.requestId ?? "N/A"}
                      </div>

                      <div className="error-json">
                        {JSON.stringify(
                          errorData.klingResponse ??
                            errorData,
                          null,
                          2
                        )}
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </section>

          </div>

        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="footer">

          <div className="footer-inner">

            <div className="footer-brand">

              <h2>
                CIEL IA STUDIO
              </h2>

              <p>
                Crie. Transforme. Inove com IA.
              </p>

            </div>

            <div className="footer-columns">

              <div className="footer-column">

                <h3>
                  Produto
                </h3>

                <a href="/criar-prompts">
                  Criar Prompts
                </a>

                <a href="/texto-imagem">
                  Texto → Imagem
                </a>

                <a href="/texto-video">
                  Texto → Vídeo
                </a>

                <a href="/imagem-imagem">
                  Imagem → Imagem
                </a>

                <a href="/imagem-video">
                  Imagem → Vídeo
                </a>

                <a href="/projetos">
                  Meus Projetos
                </a>

              </div>

              <div className="footer-column">

                <h3>
                  Suporte
                </h3>

                <a href="/ajuda">
                  Central de Ajuda
                </a>

                <a href="/contato">
                  Contato
                </a>

                <a href="/sobre">
                  Sobre o CIEL IA STUDIO
                </a>

              </div>

              <div className="footer-column">

                <h3>
                  Legal
                </h3>

                <a href="/termos">
                  Termos de Uso
                </a>

                <a href="/privacidade">
                  Política de Privacidade
                </a>

                <a href="/reembolso">
                  Política de Reembolso
                </a>

              </div>

            </div>

            <div className="footer-bottom">
              © 2026 CIEL IA STUDIO. Todos os direitos reservados.
            </div>

          </div>

        </footer>

      </main>
    </>
  );
}
