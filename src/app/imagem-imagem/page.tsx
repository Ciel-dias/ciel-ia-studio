"use client";

import Link from "next/link";
import { useState } from "react";

export default function ImagemImagemPage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("Realista");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
  }

  async function handleGenerate() {
    if (!image) {
      alert("Selecione uma imagem de referência.");
      return;
    }

    if (!prompt.trim()) {
      alert("Descreva o que deseja transformar na imagem.");
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

        a {
          -webkit-tap-highlight-color: transparent;
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
          overflow-x: hidden;
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
          letter-spacing: 0.4px;
        }

        .back {
          color: #bfeaff;
          text-decoration: none;
          font-size: 14px;
          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
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
          line-height: 1.5;
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

        .upload-area {
          position: relative;
          min-height: 185px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
          border-radius: 16px;
          border: 1px dashed rgba(104, 207, 255, 0.55);
          background:
            radial-gradient(
              circle,
              rgba(43, 167, 255, 0.08),
              transparent 60%
            ),
            rgba(3, 13, 25, 0.72);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .upload-area:hover {
          border-color: #63d3ff;
          box-shadow: 0 0 18px rgba(70, 199, 255, 0.18);
        }

        .upload-icon {
          font-size: 50px;
          margin-bottom: 12px;
        }

        .upload-title {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
        }

        .upload-text {
          margin: 8px 0 0;
          color: #8798aa;
          font-size: 13px;
          line-height: 1.5;
        }

        .upload-button {
          display: inline-block;
          margin-top: 15px;
          padding: 10px 18px;
          border-radius: 10px;
          color: #04101b;
          background: linear-gradient(
            90deg,
            #5ed2ff,
            #75e0ff
          );
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(70, 199, 255, 0.4);
        }

        .upload-button:hover {
          box-shadow: 0 0 20px rgba(70, 199, 255, 0.65);
        }

        .file-name {
          margin-top: 10px;
          color: #70d7ff;
          font-size: 13px;
          word-break: break-word;
        }

        .hidden-input {
          display: none;
        }

        .prompt {
          width: 100%;
          min-height: 150px;
          resize: vertical;
          padding: 16px;
          border: 1px solid rgba(94, 203, 255, 0.45);
          border-radius: 14px;
          outline: none;
          background: rgba(3, 13, 25, 0.8);
          color: #fff;
          font-size: 15px;
          line-height: 1.5;
          font-family: Arial, Helvetica, sans-serif;
        }

        .prompt::placeholder {
          color: #68798b;
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
          cursor: pointer;
        }

        select:focus {
          border-color: #63d3ff;
          box-shadow: 0 0 12px rgba(70, 199, 255, 0.2);
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

        .generate:active {
          transform: scale(0.98);
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
          overflow: hidden;
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

        /* RODAPÉ */

        .footer {
          border-top: 1px solid rgba(100, 180, 255, 0.18);
          background:
            linear-gradient(
              180deg,
              rgba(4, 15, 29, 0.96),
              rgba(3, 11, 22, 1)
            );
          padding: 52px 42px 24px;
        }

        .footer-inner {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .footer-brand {
          margin-bottom: 42px;
        }

        .footer-brand h2 {
          margin: 0 0 8px;
          font-size: 24px;
        }

        .footer-brand p {
          margin: 0;
          color: #9eacbd;
          font-size: 15px;
        }

        .footer-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 50px;
        }

        .footer-column h3 {
          margin: 0 0 18px;
          font-size: 16px;
        }

        .footer-column a {
          display: block;
          width: fit-content;
          margin-bottom: 12px;
          color: #aebaca;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .footer-column a:hover {
          color: #68d2ff;
        }

        .footer-bottom {
          margin-top: 36px;
          padding-top: 22px;
          border-top: 1px solid rgba(100, 180, 255, 0.16);
          text-align: center;
          color: #8997a9;
          font-size: 13px;
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

        @media (max-width: 650px) {
          .topbar {
            min-height: 68px;
            padding: 0 16px;
            gap: 12px;
          }

          .brand-name {
            font-size: 16px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .content {
            width: min(430px, calc(100% - 28px));
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

          .footer {
            padding: 42px 24px 22px;
          }

          .footer-columns {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 430px) {
          .topbar {
            flex-wrap: wrap;
            justify-content: center;
            padding: 14px 10px;
          }

          .brand {
            width: 100%;
            justify-content: center;
          }

          .back {
            margin-top: 4px;
          }

          .title-area h1 {
            font-size: 34px;
          }

          .title-area p {
            font-size: 16px;
          }
        }
      `}</style>

      <main className="page">

        {/* CABEÇALHO */}

        <header className="topbar">
          <div className="brand">
            <span className="brand-icon">✨</span>

            <span className="brand-name">
              CIEL IA STUDIO
            </span>
          </div>

          <Link href="/dashboard" className="back">
            ← Voltar ao Dashboard
          </Link>
        </header>

        {/* CONTEÚDO */}

        <section className="content">

          <div className="title-area">
            <h1>Imagem → Imagem</h1>

            <p>
              Transforme suas imagens com inteligência
              artificial.
            </p>
          </div>

          <div className="workspace">

            {/* PAINEL DE CRIAÇÃO */}

            <section className="panel">

              <h2>🖼️ Transformar imagem</h2>

              <label className="label">
                Imagem de referência
              </label>

              <div className="upload-area">

                <div>

                  <div className="upload-icon">
                    🖼️
                  </div>

                  <p className="upload-title">
                    Escolha uma imagem
                  </p>

                  <p className="upload-text">
                    Envie uma imagem para usar como
                    referência na criação.
                  </p>

                  <label className="upload-button">
                    📁 Selecionar imagem

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden-input"
                      onChange={handleImageChange}
                    />
                  </label>

                  {image && (
                    <div className="file-name">
                      ✓ {image.name}
                    </div>
                  )}

                </div>

              </div>

              <label className="label">
                O que deseja transformar?
              </label>

              <textarea
                className="prompt"
                value={prompt}
                onChange={(e) =>
                  setPrompt(e.target.value)
                }
                placeholder="Exemplo: Transforme esta imagem em uma cena cinematográfica, mantendo a pessoa e suas características..."
              />

              <div className="options">

                <div>

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

                    <option value="9:16">
                      9:16 — Vertical
                    </option>

                    <option value="16:9">
                      16:9 — Paisagem
                    </option>
                  </select>

                </div>

                <div>

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

                </div>

              </div>

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

            {/* RESULTADO */}

            <section className="panel">

              <h2>🖼️ Resultado</h2>

              <div
                className={`preview ${
                  loading ? "loading" : ""
                }`}
              >

                <div>

                  <div className="preview-icon">
                    {loading ? "✨" : "🖼️"}
                  </div>

                  <h3>
                    {loading
                      ? "Preparando sua transformação..."
                      : "Sua nova imagem aparecerá aqui"}
                  </h3>

                  <p>
                    Envie uma imagem, descreva a
                    transformação e clique em “Gerar
                    Imagem” para começar.
                  </p>

                </div>

              </div>

            </section>

          </div>

        </section>

        {/* RODAPÉ */}

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

              {/* PRODUTO */}

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

              {/* SUPORTE */}

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

              {/* LEGAL */}

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

      </main>
    </>
  );
}
