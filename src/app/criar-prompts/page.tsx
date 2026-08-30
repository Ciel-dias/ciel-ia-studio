"use client";

import Link from "next/link";
import { useState } from "react";

export default function CriarPrompts() {
  const [ideia, setIdeia] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function gerarPrompt() {
    if (!ideia.trim()) {
      alert("Digite sua ideia antes de gerar o prompt.");
      return;
    }

    setLoading(true);
    setPrompt("");

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Crie um prompt profissional, detalhado e de alta qualidade para criação de conteúdo com inteligência artificial.

A ideia do usuário é:

${ideia}

Transforme essa ideia em um prompt completo, cinematográfico e bem estruturado. Preserve exatamente a intenção do usuário e acrescente detalhes úteis de cenário, iluminação, câmera, composição, estilo e qualidade quando fizer sentido.`,
        }),
      });

      const data = await response.json();

      setPrompt(
        data.result ||
          data.message ||
          "Não foi possível gerar o prompt."
      );
    } catch {
      setPrompt(
        "Erro ao conectar com a inteligência artificial."
      );
    }

    setLoading(false);
  }

  async function copiarPrompt() {
    if (!prompt) return;

    await navigator.clipboard.writeText(prompt);

    alert("Prompt copiado!");
  }

  return (
    <main className="page">

      {/* =========================
          CABEÇALHO
      ========================= */}

      <header className="topbar">

        <div className="brand">
          <span className="brand-icon">✨</span>

          <span className="brand-name">
            CIEL IA STUDIO
          </span>
        </div>

        <Link
          href="/dashboard"
          className="back"
        >
          ← Voltar ao Dashboard
        </Link>

      </header>


      {/* =========================
          CONTEÚDO
      ========================= */}

      <section className="content">

        <div className="title-area">

          <h1>
            CRIAR PROMPTS
          </h1>

          <p>
            Transforme suas ideias em prompts
            profissionais usando inteligência artificial.
          </p>

        </div>


        <div className="workspace">

          <section className="panel">

            <div className="panel-header">

              <div className="panel-icon">
                ✨
              </div>

              <h2>
                Criador de Prompts
              </h2>

              <p className="panel-subtitle">
                Descreva sua ideia e deixe a IA
                transformar sua inspiração em um
                prompt profissional.
              </p>

            </div>


            <label className="label">
              Descreva sua ideia
            </label>

            <textarea
              className="prompt-input"
              value={ideia}
              onChange={(e) =>
                setIdeia(e.target.value)
              }
              placeholder="Exemplo: Uma mulher caminhando em uma cidade futurista ao pôr do sol, com aparência cinematográfica..."
            />


            <button
              className={`generate ${
                loading ? "loading" : ""
              }`}
              onClick={gerarPrompt}
              disabled={loading}
            >
              {loading
                ? "🤖 Criando seu prompt..."
                : "✨ Gerar Prompt"}
            </button>


            {prompt && (
              <div className="result">

                <div className="result-title">

                  <span>
                    🚀
                  </span>

                  <span>
                    Prompt gerado
                  </span>

                </div>


                <div className="result-text">
                  {prompt}
                </div>


                <button
                  className="copy"
                  onClick={copiarPrompt}
                >
                  📋 Copiar Prompt
                </button>

              </div>
            )}

          </section>

        </div>

      </section>


      {/* =========================
          RODAPÉ
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

              <Link href="/criar-prompts">
                Criar Prompts
              </Link>

              <Link href="/texto-imagem">
                Texto → Imagem
              </Link>

              <Link href="/texto-video">
                Texto → Vídeo
              </Link>

              <Link href="/imagem-imagem">
                Imagem → Imagem
              </Link>

              <Link href="/imagem-video">
                Imagem → Vídeo
              </Link>

              <Link href="/projetos">
                Meus Projetos
              </Link>

            </div>


            <div className="footer-column">

              <h3>
                Suporte
              </h3>

              <Link href="/ajuda">
                Central de Ajuda
              </Link>

              <Link href="/contato">
                Contato
              </Link>

              <Link href="/sobre">
                Sobre o CIEL IA STUDIO
              </Link>

            </div>


            <div className="footer-column">

              <h3>
                Legal
              </h3>

              <Link href="/termos">
                Termos de Uso
              </Link>

              <Link href="/privacidade">
                Política de Privacidade
              </Link>

              <Link href="/reembolso">
                Política de Reembolso
              </Link>

            </div>

          </div>


          <div className="footer-bottom">
            © 2026 CIEL IA STUDIO. Todos os direitos reservados.
          </div>

        </div>

      </footer>


      {/* =========================
          ESTILOS
      ========================= */}

      <style jsx>{`

        .page {
          min-height: 100vh;

          color: var(--ciel-text);

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

          transition:
            background 0.35s ease,
            color 0.35s ease;
        }

        /* =========================
           TEMA CLARO
        ========================= */

        :global(html[data-theme="light"]) .page {
          background:
            radial-gradient(
              circle at 75% 20%,
              rgba(65, 175, 255, 0.25),
              transparent 38%
            ),
            radial-gradient(
              circle at 15% 65%,
              rgba(80, 190, 255, 0.18),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #eef8ff 0%,
              #e4f4ff 48%,
              #d8efff 100%
            );

          color: #101827;
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

          gap: 20px;
          padding: 0 42px;

          background: rgba(4, 12, 24, 0.88);

          border-bottom:
            1px solid rgba(100, 180, 255, 0.18);

          backdrop-filter: blur(12px);

          transition:
            background 0.35s ease,
            border-color 0.35s ease;
        }

        :global(html[data-theme="light"]) .topbar {
          background: rgba(255, 255, 255, 0.88);

          border-bottom:
            1px solid rgba(0, 119, 255, 0.16);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;

          white-space: nowrap;
        }

        .brand-icon {
          font-size: 28px;
        }

        .brand-name {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.4px;
        }

        .back {
          color: #e8eef7;

          background: transparent;

          text-decoration: none;

          font-size: 15px;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        :global(html[data-theme="light"]) .back {
          color: #1b496d;
        }

        .back:hover {
          color: #72d5ff;

          text-shadow:
            0 0 12px rgba(75, 199, 255, 0.8);
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

          transition: color 0.35s ease;
        }

        :global(html[data-theme="light"]) .title-area p {
          color: #536579;
        }

        /* =========================
           CARD PRINCIPAL
        ========================= */

        .workspace {
          width: 100%;

          display: flex;
          justify-content: center;
        }

        .panel {
          width: min(760px, 100%);

          border-radius: 22px;

          padding: 32px;

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

          transition:
            background 0.35s ease,
            box-shadow 0.22s ease,
            border-color 0.35s ease,
            transform 0.22s ease;
        }

        :global(html[data-theme="light"]) .panel {
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.97),
              rgba(239, 249, 255, 0.97)
            );

          border-color: #38aef5;

          box-shadow:
            0 0 8px rgba(40, 160, 235, 0.35),
            0 0 22px rgba(43, 167, 255, 0.20),
            inset 0 0 22px rgba(56, 174, 255, 0.06);
        }

        .panel:hover {
          box-shadow:
            0 0 12px rgba(85, 211, 255, 1),
            0 0 32px rgba(43, 167, 255, 0.7),
            inset 0 0 25px rgba(56, 174, 255, 0.12);
        }

        :global(html[data-theme="light"]) .panel:hover {
          box-shadow:
            0 0 12px rgba(50, 174, 245, 0.5),
            0 0 30px rgba(43, 167, 255, 0.25),
            inset 0 0 25px rgba(56, 174, 255, 0.08);
        }

        .panel-header {
          text-align: center;

          margin-bottom: 28px;
        }

        .panel-icon {
          font-size: 50px;

          line-height: 1;

          margin-bottom: 15px;
        }

        .panel h2 {
          margin: 0;

          font-size: 25px;

          font-weight: 700;
        }

        .panel-subtitle {
          margin:
            10px auto 0;

          max-width: 520px;

          color: #aebdcc;

          font-size: 15px;

          line-height: 1.5;

          transition: color 0.35s ease;
        }

        :global(html[data-theme="light"]) .panel-subtitle {
          color: #536579;
        }

        /* =========================
           CAMPO
        ========================= */

        .label {
          display: block;

          margin:
            0 0 10px;

          color: #c7d3df;

          font-size: 14px;

          font-weight: 700;

          transition: color 0.35s ease;
        }

        :global(html[data-theme="light"]) .label {
          color: #30475d;
        }

        .prompt-input {
          width: 100%;

          min-height: 190px;

          resize: vertical;

          padding: 17px;

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

          line-height: 1.55;

          transition:
            background 0.35s ease,
            color 0.35s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        :global(html[data-theme="light"]) .prompt-input {
          background: rgba(255, 255, 255, 0.95);

          color: #101827;

          border-color:
            rgba(0, 140, 220, 0.35);
        }

        .prompt-input::placeholder {
          color: #718195;
        }

        .prompt-input:focus {
          border-color: #63d3ff;

          box-shadow:
            0 0 15px rgba(70, 199, 255, 0.25);
        }

        /* =========================
           BOTÃO
        ========================= */

        .generate {
          width: 100%;

          margin-top: 20px;

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

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .generate:hover {
          transform: translateY(-2px);

          box-shadow:
            0 0 14px rgba(85, 211, 255, 1),
            0 0 32px rgba(43, 167, 255, 0.55);
        }

        .generate:active {
          transform: scale(0.98);
        }

        .generate:disabled {
          cursor: wait;

          opacity: 0.65;

          transform: none;
        }

        /* =========================
           RESULTADO
        ========================= */

        .result {
          margin-top: 26px;

          padding: 22px;

          border-radius: 16px;

          background:
            rgba(2, 12, 24, 0.62);

          border:
            1px solid rgba(104, 207, 255, 0.35);

          box-shadow:
            inset 0 0 20px rgba(56, 174, 255, 0.05);

          transition:
            background 0.35s ease,
            border-color 0.35s ease;
        }

        :global(html[data-theme="light"]) .result {
          background:
            rgba(255, 255, 255, 0.75);

          border-color:
            rgba(0, 140, 220, 0.25);
        }

        .result-title {
          display: flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 14px;

          font-size: 18px;

          font-weight: 700;
        }

        .result-text {
          padding: 17px;

          border-radius: 13px;

          background:
            rgba(3, 13, 25, 0.9);

          color: #dce8f4;

          font-size: 15px;

          line-height: 1.6;

          white-space: pre-wrap;

          word-break: break-word;

          border:
            1px solid rgba(94, 203, 255, 0.22);

          transition:
            background 0.35s ease,
            color 0.35s ease,
            border-color 0.35s ease;
        }

        :global(html[data-theme="light"]) .result-text {
          background:
            rgba(245, 251, 255, 0.95);

          color: #243447;

          border-color:
            rgba(0, 140, 220, 0.20);
        }

        .copy {
          width: 100%;

          margin-top: 14px;

          padding: 13px;

          border:
            1px solid rgba(94, 203, 255, 0.45);

          border-radius: 12px;

          cursor: pointer;

          color: #ffffff;

          background:
            rgba(29, 112, 157, 0.2);

          font-size: 14px;

          font-weight: 700;

          transition:
            background 0.2s ease,
            box-shadow 0.2s ease,
            color 0.35s ease;
        }

        :global(html[data-theme="light"]) .copy {
          color: #145078;

          background:
            rgba(80, 190, 255, 0.12);

          border-color:
            rgba(0, 140, 220, 0.30);
        }

        .copy:hover {
          background:
            rgba(29, 130, 180, 0.35);

          box-shadow:
            0 0 15px rgba(70, 199, 255, 0.25);
        }

        /* =========================
           RODAPÉ
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

          transition:
            background 0.35s ease,
            border-color 0.35s ease;
        }

        :global(html[data-theme="light"]) .footer {
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.96),
              rgba(235, 247, 255, 1)
            );

          border-top-color:
            rgba(0, 119, 255, 0.14);
        }

        .footer-inner {
          width: min(1180px, 100%);

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

          transition: color 0.35s ease;
        }

        :global(html[data-theme="light"]) .footer-brand p {
          color: #536579;
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

          transition:
            color 0.2s ease;
        }

        :global(html[data-theme="light"]) .footer-column a {
          color: #536579;
        }

        .footer-column a:hover {
          color: #68d2ff;
        }

        .footer-bottom {
          margin-top: 36px;

          padding-top: 22px;

          border-top:
            1px solid rgba(100, 180, 255, 0.16);

          text-align: center;

          color: #8997a9;

          font-size: 13px;

          transition:
            color 0.35s ease,
            border-color 0.35s ease;
        }

        :global(html[data-theme="light"]) .footer-bottom {
          color: #68798b;

          border-top-color:
            rgba(0, 119, 255, 0.13);
        }

        /* =========================
           LOADING
        ========================= */

        .loading {
          animation:
            pulse 1.1s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
          }
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 900px) {
          .topbar {
            padding: 0 24px;
          }

          .content {
            width:
              min(760px, calc(100% - 40px));
          }
        }

        /* =========================
           CELULAR
        ========================= */

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
            padding: 23px;

            border-radius: 19px;
          }

          .panel-icon {
            font-size: 44px;
          }

          .panel h2 {
            font-size: 22px;
          }

          .prompt-input {
            min-height: 180px;
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

    </main>
  );
}
