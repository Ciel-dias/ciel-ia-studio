"use client";

import { useState } from "react";

export default function ImagemVideoPage() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  }

  async function handleGenerate() {
    if (!image) {
      alert("Envie uma imagem antes de gerar o vídeo.");
      return;
    }

    if (!prompt.trim()) {
      alert("Digite uma descrição para o vídeo.");
      return;
    }

    setLoading(true);

    // Futuramente conectaremos aqui a API de geração de vídeo.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);

    alert(
      "A estrutura de geração de vídeo está pronta. Agora vamos conectar a API."
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
          color: #ffffff;
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
          width: 100%;
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
          white-space: nowrap;
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
          letter-spacing: 0.5px;
        }

        .title-area p {
          margin: 14px auto 0;
          max-width: 680px;
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

        .upload-box {
          position: relative;
          width: 100%;
          height: 270px;
          border-radius: 16px;
          border: 2px dashed rgba(104, 207, 255, 0.5);
          background:
            radial-gradient(
              circle,
              rgba(43, 167, 255, 0.09),
              transparent 60%
            ),
            rgba(3, 13, 25, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .upload-box:hover {
          border-color: #63d3ff;
          box-shadow:
            0 0 12px rgba(70, 199, 255, 0.35),
            inset 0 0 20px rgba(56, 174, 255, 0.08);
        }

        .upload-input {
          display: none;
        }

        .upload-content {
          position: relative;
          z-index: 2;
          padding: 20px;
        }

        .upload-plus {
          width: 70px;
          height: 70px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          border: 2px solid #58c9ff;
          background: rgba(5, 24, 42, 0.8);
          color: #69d5ff;
          font-size: 42px;
          line-height: 1;
          box-shadow:
            0 0 10px rgba(70, 199, 255, 0.45),
            inset 0 0 15px rgba(56, 174, 255, 0.08);
        }

        .upload-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .upload-description {
          margin: 9px auto 0;
          max-width: 310px;
          color: #8798aa;
          font-size: 14px;
          line-height: 1.5;
        }

        .image-preview {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 14px;
          background: linear-gradient(
            transparent,
            rgba(0, 0, 0, 0.82)
          );
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          z-index: 3;
        }

        .prompt {
          width: 100%;
          min-height: 165px;
          resize: vertical;
          padding: 16px;
          border: 1px solid rgba(94, 203, 255, 0.45);
          border-radius: 14px;
          outline: none;
          background: rgba(3, 13, 25, 0.8);
          color: #ffffff;
          font-size: 15px;
          line-height: 1.5;
        }

        .prompt:focus {
          border-color: #63d3ff;
          box-shadow: 0 0 15px rgba(70, 199, 255, 0.25);
        }

        .prompt::placeholder {
          color: #657589;
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
          min-height: 560px;
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

          .upload-box {
            height: 230px;
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

          <a href="/dashboard" className="back">
            ← Voltar ao Dashboard
          </a>
        </header>

        {/* CONTEÚDO */}
        <section className="content">

          <div className="title-area">
            <h1>Imagem → Vídeo</h1>

            <p>
              Transforme sua imagem em vídeo com inteligência
              artificial.
            </p>
          </div>

          <div className="workspace">

            {/* PAINEL DE CRIAÇÃO */}
            <section className="panel">

              <h2>🎬 Criar vídeo</h2>

              <label className="label">
                Sua imagem
              </label>

              <label className="upload-box">

                <input
                  className="upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {image ? (
                  <>
                    <img
                      src={image}
                      alt="Imagem selecionada"
                      className="image-preview"
                    />

                    <div className="image-overlay">
                      Clique para trocar a imagem
                    </div>
                  </>
                ) : (
                  <div className="upload-content">

                    <div className="upload-plus">
                      +
                    </div>

                    <h3 className="upload-title">
                      Envie sua imagem
                    </h3>

                    <p className="upload-description">
                      Escolha uma imagem para transformar
                      em vídeo com IA.
                    </p>

                  </div>
                )}

              </label>

              <label className="label">
                Descreva o vídeo que você deseja criar
              </label>

              <textarea
                className="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Exemplo: Faça a câmera se aproximar lentamente, com movimento natural, iluminação cinematográfica e vento suave..."
              />

              <div className="credits">
                💎 Seus créditos: <strong>30</strong>
              </div>

              <button
                className="generate"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading
                  ? "🎬 Preparando vídeo..."
                  : "✨ Gerar Vídeo"}
              </button>

            </section>

            {/* RESULTADO */}
            <section className="panel">

              <h2>🎥 Resultado</h2>

              <div
                className={`preview ${
                  loading ? "loading" : ""
                }`}
              >

                <div>

                  <div className="preview-icon">
                    {loading ? "✨" : "🎬"}
                  </div>

                  <h3>
                    {loading
                      ? "Preparando seu vídeo..."
                      : "Seu vídeo aparecerá aqui"}
                  </h3>

                  <p>
                    Envie uma imagem, descreva o movimento
                    desejado e clique em “Gerar Vídeo”.
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

              <div className="footer-column">

                <h3>Produto</h3>

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

                <h3>Suporte</h3>

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

                <h3>Legal</h3>

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
