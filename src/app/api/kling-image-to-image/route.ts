"use client";

import Link from "next/link";
import { useState } from "react";

export default function ImagemImagemPage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("Realista");

  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);

  const [preview1, setPreview1] = useState("");
  const [preview2, setPreview2] = useState("");

  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
    number: 1 | 2
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (number === 1) {
      setImage1(file);
      setPreview1(preview);
    } else {
      setImage2(file);
      setPreview2(preview);
    }

    setResultImage("");
    setErrorMessage("");
  }

  async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Não foi possível ler a imagem."));
        }
      };

      reader.onerror = () => {
        reject(new Error("Erro ao ler a imagem."));
      };

      reader.readAsDataURL(file);
    });
  }

  async function handleGenerate() {
    if (!image1 && !image2) {
      setErrorMessage(
        "Selecione pelo menos uma imagem de referência."
      );
      return;
    }

    if (!prompt.trim()) {
      setErrorMessage(
        "Descreva o que deseja criar na imagem."
      );
      return;
    }

    try {
      setLoading(true);
      setResultImage("");
      setErrorMessage("");

      const image = image1
        ? await fileToDataUrl(image1)
        : image2
          ? await fileToDataUrl(image2)
          : "";

      const image2Data =
        image1 && image2
          ? await fileToDataUrl(image2)
          : undefined;

      const response = await fetch(
        "/api/kling-image-to-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image,
            ...(image2Data
              ? { image2: image2Data }
              : {}),
            prompt: prompt.trim(),
            aspect_ratio: aspectRatio,
            style,
          }),
        }
      );

      const text = await response.text();

      let data: any = null;

      try {
        data = JSON.parse(text);
      } catch {
        data = {
          message: text || "Resposta inválida do servidor.",
        };
      }

      if (!response.ok) {
        const klingMessage =
          data?.klingMessage ||
          data?.message ||
          "Não foi possível gerar a imagem.";

        const klingCode = data?.klingCode
          ? `Código: ${data.klingCode}`
          : "";

        setErrorMessage(
          `${klingMessage}${klingCode ? ` — ${klingCode}` : ""}`
        );

        return;
      }

      /*
       * A Kling pode retornar a tarefa com task_id.
       * Nesta primeira etapa mostramos a confirmação
       * do envio e guardamos o taskId para a próxima etapa.
       */

      const taskId =
        data?.taskId ||
        data?.data?.task_id ||
        data?.klingResponse?.data?.task_id ||
        null;

      if (taskId) {
        setErrorMessage("");
        setResultImage("");
        return;
      }

      /*
       * Caso a API já devolva uma URL de imagem,
       * tentamos localizar nos formatos mais comuns.
       */

      const imageUrl =
        data?.imageUrl ||
        data?.image_url ||
        data?.data?.image_url ||
        data?.data?.url ||
        data?.data?.images?.[0]?.url ||
        data?.images?.[0]?.url ||
        null;

      if (imageUrl) {
        setResultImage(imageUrl);
        return;
      }

      /*
       * Solicitação aceita, mas ainda aguardando
       * processamento.
       */

      setErrorMessage(
        "Solicitação enviada com sucesso. A imagem ainda está sendo processada."
      );
    } catch (error) {
      console.error(
        "Erro ao conectar com a API Imagem → Imagem:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível se conectar com o servidor."
      );
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

        .images-label {
          margin-bottom: 12px;
        }

        .images-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .image-box {
          position: relative;
          height: 175px;
          border-radius: 16px;
          border: 1px dashed rgba(104, 207, 255, 0.55);
          background:
            radial-gradient(
              circle,
              rgba(43, 167, 255, 0.08),
              transparent 60%
            ),
            rgba(3, 13, 25, 0.72);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .image-box.has-image {
          border-style: solid;
        }

        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
          background: #020c18;
        }

        .image-box-content {
          text-align: center;
          padding: 10px;
        }

        .image-box-number {
          position: absolute;
          top: 9px;
          left: 10px;
          padding: 4px 8px;
          border-radius: 8px;
          background: rgba(3, 13, 25, 0.82);
          color: #bfeaff;
          font-size: 11px;
          font-weight: 700;
          z-index: 2;
        }

        .plus {
          width: 54px;
          height: 54px;
          margin: 0 auto 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #04101b;
          background: linear-gradient(
            135deg,
            #5ed2ff,
            #75e0ff
          );
          font-size: 32px;
          box-shadow:
            0 0 10px rgba(70, 199, 255, 0.7),
            0 0 22px rgba(43, 167, 255, 0.3);
        }

        .image-box-title {
          margin: 0;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
        }

        .image-box-text {
          margin: 5px 0 0;
          color: #7f92a5;
          font-size: 11px;
          line-height: 1.4;
        }

        .upload-button {
          display: inline-block;
          margin-top: 10px;
          padding: 7px 12px;
          border-radius: 9px;
          background: rgba(94, 210, 255, 0.16);
          border: 1px solid rgba(94, 210, 255, 0.4);
          color: #bfeaff;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .change-image {
          position: absolute;
          bottom: 9px;
          right: 9px;
          z-index: 2;
          padding: 7px 10px;
          border: none;
          border-radius: 9px;
          color: #04101b;
          background: rgba(117, 224, 255, 0.95);
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
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

        .result-image {
          width: 100%;
          height: 100%;
          max-height: 500px;
          object-fit: contain;
          border-radius: 14px;
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

        .error-box {
          margin-top: 18px;
          padding: 14px;
          border-radius: 12px;
          background: rgba(180, 45, 45, 0.12);
          border: 1px solid rgba(255, 100, 100, 0.35);
          color: #ffb7b7;
          font-size: 13px;
          line-height: 1.5;
          text-align: left;
        }

        .success-box {
          margin-top: 18px;
          padding: 14px;
          border-radius: 12px;
          background: rgba(45, 180, 110, 0.12);
          border: 1px solid rgba(100, 255, 170, 0.35);
          color: #b7ffd5;
          font-size: 13px;
          line-height: 1.5;
          text-align: left;
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

          .images-container {
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }

          .image-box {
            height: 145px;
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

          .image-box {
            height: 140px;
          }

          .plus {
            width: 48px;
            height: 48px;
            font-size: 29px;
          }

          .image-box-text {
            font-size: 10px;
          }

          .upload-button {
            font-size: 10px;
            padding: 6px 9px;
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

          <Link href="/dashboard" className="back">
            ← Voltar ao Dashboard
          </Link>
        </header>

        <section className="content">
          <div className="title-area">
            <h1>Imagem → Imagem</h1>

            <p>
              Transforme suas imagens com inteligência
              artificial.
            </p>
          </div>

          <div className="workspace">
            <section className="panel">
              <h2>🖼️ Transformar imagem</h2>

              <label className="label images-label">
                Imagens de referência
              </label>

              <div className="images-container">
                <div
                  className={`image-box ${
                    preview1 ? "has-image" : ""
                  }`}
                >
                  <span className="image-box-number">
                    IMAGEM 1
                  </span>

                  {preview1 ? (
                    <>
                      <img
                        src={preview1}
                        alt="Imagem de referência 1"
                        className="image-preview"
                      />

                      <label className="change-image">
                        Trocar

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden-input"
                          onChange={(e) =>
                            handleImageChange(e, 1)
                          }
                        />
                      </label>
                    </>
                  ) : (
                    <div className="image-box-content">
                      <div className="plus">+</div>

                      <p className="image-box-title">
                        Adicionar foto
                      </p>

                      <p className="image-box-text">
                        Pessoa, objeto ou cenário
                      </p>

                      <label className="upload-button">
                        Selecionar

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden-input"
                          onChange={(e) =>
                            handleImageChange(e, 1)
                          }
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div
                  className={`image-box ${
                    preview2 ? "has-image" : ""
                  }`}
                >
                  <span className="image-box-number">
                    IMAGEM 2
                  </span>

                  {preview2 ? (
                    <>
                      <img
                        src={preview2}
                        alt="Imagem de referência 2"
                        className="image-preview"
                      />

                      <label className="change-image">
                        Trocar

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden-input"
                          onChange={(e) =>
                            handleImageChange(e, 2)
                          }
                        />
                      </label>
                    </>
                  ) : (
                    <div className="image-box-content">
                      <div className="plus">+</div>

                      <p className="image-box-title">
                        Adicionar foto
                      </p>

                      <p className="image-box-text">
                        Segunda referência
                      </p>

                      <label className="upload-button">
                        Selecionar

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden-input"
                          onChange={(e) =>
                            handleImageChange(e, 2)
                          }
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <label className="label">
                O que deseja criar?
              </label>

              <textarea
                className="prompt"
                value={prompt}
                onChange={(e) =>
                  setPrompt(e.target.value)
                }
                placeholder="Exemplo: Coloque o carro da segunda imagem no cenário da primeira imagem, mantendo o realismo e a iluminação natural..."
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

              {errorMessage && (
                <div className="error-box">
                  ⚠️ {errorMessage}
                </div>
              )}

              <button
                className="generate"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading
                  ? "✨ Enviando..."
                  : "✨ Gerar Imagem"}
              </button>
            </section>

            <section className="panel">
              <h2>🖼️ Resultado</h2>

              <div
                className={`preview ${
                  loading ? "loading" : ""
                }`}
              >
                {resultImage ? (
                  <img
                    src={resultImage}
                    alt="Imagem gerada"
                    className="result-image"
                  />
                ) : (
                  <div>
                    <div className="preview-icon">
                      {loading ? "✨" : "🖼️"}
                    </div>

                    <h3>
                      {loading
                        ? "Enviando sua solicitação..."
                        : "Sua nova imagem aparecerá aqui"}
                    </h3>

                    <p>
                      Envie uma ou duas imagens,
                      descreva a transformação e clique
                      em “Gerar Imagem” para começar.
                    </p>

                    {!loading &&
                      errorMessage && (
                        <div className="success-box">
                          A conexão com a rota foi
                          realizada. Confira a mensagem
                          acima para saber o resultado da
                          solicitação.
                        </div>
                      )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <h2>CIEL IA STUDIO</h2>

              <p>
                Crie. Transforme. Inove com IA.
              </p>
            </div>

            <div className="footer-columns">
              <div className="footer-column">
                <h3>Produto</h3>

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
                <h3>Suporte</h3>

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
                <h3>Legal</h3>

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
              © 2026 CIEL IA STUDIO. Todos os direitos
              reservados.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
