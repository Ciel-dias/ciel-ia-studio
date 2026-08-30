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

  const [resultMessage, setResultMessage] = useState("");
  const [taskId, setTaskId] = useState("");
  const [resultImageUrl, setResultImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * =====================================================
   * SELEÇÃO DAS IMAGENS
   * =====================================================
   */

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
    number: 1 | 2
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "Selecione um arquivo de imagem válido."
      );
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage(
        "Essa imagem é muito grande. Escolha uma imagem de até 30 MB."
      );
      return;
    }

    const preview = URL.createObjectURL(file);

    if (number === 1) {
      if (preview1) {
        URL.revokeObjectURL(preview1);
      }

      setImage1(file);
      setPreview1(preview);
    } else {
      if (preview2) {
        URL.revokeObjectURL(preview2);
      }

      setImage2(file);
      setPreview2(preview);
    }

    setErrorMessage("");
    setResultMessage("");
    setTaskId("");
    setResultImageUrl("");

    /**
     * Permite selecionar novamente a mesma imagem.
     */
    event.target.value = "";
  }

  /**
   * =====================================================
   * PREPARAR IMAGEM
   *
   * CORREÇÃO:
   *
   * Usa FileReader diretamente no File selecionado.
   * Não depende de URL.createObjectURL() para carregar
   * a imagem durante a preparação.
   *
   * Isso evita o erro:
   *
   * "Não foi possível carregar a imagem selecionada."
   * =====================================================
   */

  async function prepareImage(
    file: File
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const source =
            typeof reader.result === "string"
              ? reader.result
              : "";

          if (!source) {
            reject(
              new Error(
                "Não foi possível ler a imagem selecionada."
              )
            );
            return;
          }

          const img = new Image();

          img.onload = () => {
            try {
              const MAX_SIZE = 1600;

              let width = img.naturalWidth;
              let height = img.naturalHeight;

              if (!width || !height) {
                reject(
                  new Error(
                    "Não foi possível identificar as dimensões da imagem."
                  )
                );
                return;
              }

              if (
                width > MAX_SIZE ||
                height > MAX_SIZE
              ) {
                const scale = Math.min(
                  MAX_SIZE / width,
                  MAX_SIZE / height
                );

                width = Math.max(
                  300,
                  Math.round(width * scale)
                );

                height = Math.max(
                  300,
                  Math.round(height * scale)
                );
              }

              const canvas =
                document.createElement("canvas");

              canvas.width = width;
              canvas.height = height;

              const context =
                canvas.getContext("2d");

              if (!context) {
                reject(
                  new Error(
                    "Não foi possível preparar a imagem no navegador."
                  )
                );
                return;
              }

              /**
               * Fundo branco para imagens transparentes.
               */
              context.fillStyle = "#ffffff";

              context.fillRect(
                0,
                0,
                width,
                height
              );

              context.imageSmoothingEnabled = true;
              context.imageSmoothingQuality = "high";

              context.drawImage(
                img,
                0,
                0,
                width,
                height
              );

              let quality = 0.82;

              let dataUrl =
                canvas.toDataURL(
                  "image/jpeg",
                  quality
                );

              /**
               * Mantemos o payload pequeno para
               * evitar HTTP 413.
               */
              const MAX_BASE64_LENGTH = 2_700_000;

              while (
                dataUrl.length >
                  MAX_BASE64_LENGTH &&
                quality > 0.45
              ) {
                quality -= 0.08;

                dataUrl =
                  canvas.toDataURL(
                    "image/jpeg",
                    quality
                  );
              }

              /**
               * Caso ainda esteja grande,
               * reduzimos as dimensões.
               */
              if (
                dataUrl.length >
                MAX_BASE64_LENGTH
              ) {
                let currentWidth = width;
                let currentHeight = height;

                while (
                  dataUrl.length >
                    MAX_BASE64_LENGTH &&
                  currentWidth > 700 &&
                  currentHeight > 700
                ) {
                  currentWidth = Math.max(
                    700,
                    Math.round(
                      currentWidth * 0.85
                    )
                  );

                  currentHeight = Math.max(
                    700,
                    Math.round(
                      currentHeight * 0.85
                    )
                  );

                  canvas.width = currentWidth;
                  canvas.height = currentHeight;

                  context.fillStyle = "#ffffff";

                  context.fillRect(
                    0,
                    0,
                    currentWidth,
                    currentHeight
                  );

                  context.drawImage(
                    img,
                    0,
                    0,
                    currentWidth,
                    currentHeight
                  );

                  dataUrl =
                    canvas.toDataURL(
                      "image/jpeg",
                      0.72
                    );
                }
              }

              if (
                dataUrl.length >
                MAX_BASE64_LENGTH
              ) {
                reject(
                  new Error(
                    "Não foi possível reduzir a imagem o suficiente. Escolha uma foto menor."
                  )
                );
                return;
              }

              /**
               * Remove o cabeçalho:
               *
               * data:image/jpeg;base64,
               *
               * deixando somente o Base64.
               */
              const commaIndex =
                dataUrl.indexOf(",");

              if (commaIndex === -1) {
                reject(
                  new Error(
                    "Não foi possível converter a imagem para Base64."
                  )
                );
                return;
              }

              const base64 =
                dataUrl.substring(
                  commaIndex + 1
                );

              if (!base64) {
                reject(
                  new Error(
                    "A imagem convertida ficou vazia."
                  )
                );
                return;
              }

              resolve(base64);
            } catch {
              reject(
                new Error(
                  "Erro ao preparar a imagem."
                )
              );
            }
          };

          img.onerror = () => {
            reject(
              new Error(
                "Não foi possível carregar a imagem selecionada."
              )
            );
          };

          /**
           * Usa o Data URL diretamente.
           * Não usa blob URL aqui.
           */
          img.src = source;
        } catch {
          reject(
            new Error(
              "Erro ao processar a imagem selecionada."
            )
          );
        }
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Não foi possível ler o arquivo de imagem."
          )
        );
      };

      reader.onabort = () => {
        reject(
          new Error(
            "A leitura da imagem foi interrompida."
          )
        );
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * =====================================================
   * GERAR IMAGEM
   * =====================================================
   */

  async function handleGenerate() {
    if (!image1) {
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

    setLoading(true);
    setErrorMessage("");
    setResultMessage("");
    setTaskId("");
    setResultImageUrl("");

    try {
      /**
       * Prepara a primeira imagem.
       */
      const image1Base64 =
        await prepareImage(image1);

      /**
       * Prepara a segunda imagem somente se existir.
       */
      let image2Base64 = "";

      if (image2) {
        image2Base64 =
          await prepareImage(image2);
      }

      /**
       * =================================================
       * CHAMADA PARA A ROTA EXISTENTE
       *
       * /api/kling-image-to-image
       *
       * A rota usa KLING_API_KEY.
       * =================================================
       */

      const response =
        await fetch(
          "/api/kling-image-to-image",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              prompt:
                prompt.trim(),

              image:
                image1Base64,

              image2:
                image2Base64 ||
                undefined,

              aspect_ratio:
                aspectRatio,

              style,
            }),
          }
        );

      const responseText =
        await response.text();

      let data: any = null;

      try {
        data =
          responseText
            ? JSON.parse(
                responseText
              )
            : null;
      } catch {
        data = null;
      }

      /**
       * =================================================
       * ERRO
       * =================================================
       */

      if (
        !response.ok ||
        data?.status === "error"
      ) {
        const message =
          data?.message ||
          data?.klingMessage ||
          `O servidor retornou o erro ${response.status}.`;

        setErrorMessage(message);

        return;
      }

      /**
       * =================================================
       * TASK ID
       * =================================================
       */

      const returnedTaskId =
        data?.taskId ||
        data?.data?.task_id ||
        data?.data?.taskId ||
        "";

      /**
       * =================================================
       * URL DA IMAGEM
       * =================================================
       */

      const returnedImageUrl =
        data?.imageUrl ||
        data?.data?.image_url ||
        data?.data?.imageUrl ||
        "";

      if (returnedTaskId) {
        setTaskId(
          returnedTaskId
        );
      }

      if (returnedImageUrl) {
        setResultImageUrl(
          returnedImageUrl
        );
      }

      setResultMessage(
        returnedTaskId
          ? "Sua solicitação foi enviada com sucesso. A imagem está sendo processada."
          : "Solicitação enviada com sucesso."
      );
    } catch (error) {
      console.error(
        "CIEL IA STUDIO - Erro Image-to-Image:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível preparar ou enviar a imagem."
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

          background:
            rgba(4, 12, 24, 0.9);

          border-bottom:
            1px solid
            rgba(100, 180, 255, 0.18);

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
          transition: 0.2s ease;
        }

        .back:hover {
          color: #6ed7ff;

          text-shadow:
            0 0 12px
            rgba(75, 199, 255, 0.8);
        }

        .content {
          width:
            min(
              1180px,
              calc(100% - 40px)
            );

          margin: 0 auto;

          padding:
            55px 0 70px;
        }

        .title-area {
          text-align: center;
          margin-bottom: 38px;
        }

        .title-area h1 {
          margin: 0;

          font-size:
            clamp(
              32px,
              5vw,
              52px
            );

          text-transform: uppercase;
        }

        .title-area p {
          margin:
            14px auto 0;

          max-width: 650px;

          color: #b7c5d5;

          font-size: 17px;

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
            0 0 8px
              rgba(70, 199, 255, 0.8),
            0 0 22px
              rgba(43, 167, 255, 0.35),
            inset 0 0 22px
              rgba(56, 174, 255, 0.07);
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

        .images-label {
          margin-bottom: 12px;
        }

        .images-container {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 12px;
        }

        .image-box {
          position: relative;

          height: 175px;

          border-radius: 16px;

          border:
            1px dashed
            rgba(104, 207, 255, 0.55);

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

          padding:
            4px 8px;

          border-radius: 8px;

          background:
            rgba(3, 13, 25, 0.82);

          color: #bfeaff;

          font-size: 11px;

          font-weight: 700;

          z-index: 2;
        }

        .plus {
          width: 54px;
          height: 54px;

          margin:
            0 auto 10px;

          border-radius: 50%;

          display: flex;

          align-items: center;
          justify-content: center;

          color: #04101b;

          background:
            linear-gradient(
              135deg,
              #5ed2ff,
              #75e0ff
            );

          font-size: 32px;

          box-shadow:
            0 0 10px
              rgba(70, 199, 255, 0.7),
            0 0 22px
              rgba(43, 167, 255, 0.3);
        }

        .image-box-title {
          margin: 0;

          font-size: 13px;

          font-weight: 700;
        }

        .image-box-text {
          margin:
            5px 0 0;

          color: #7f92a5;

          font-size: 11px;
        }

        .upload-button,
        .change-image {
          cursor: pointer;
          font-weight: 700;
        }

        .upload-button {
          display: inline-block;

          margin-top: 10px;

          padding:
            7px 12px;

          border-radius: 9px;

          background:
            rgba(94, 210, 255, 0.16);

          border:
            1px solid
            rgba(94, 210, 255, 0.4);

          color: #bfeaff;

          font-size: 11px;
        }

        .change-image {
          position: absolute;

          bottom: 9px;
          right: 9px;

          z-index: 2;

          padding:
            7px 10px;

          border: none;

          border-radius: 9px;

          color: #04101b;

          background:
            rgba(117, 224, 255, 0.95);

          font-size: 11px;
        }

        .hidden-input {
          display: none;
        }

        .prompt {
          width: 100%;

          min-height: 150px;

          resize: vertical;

          padding: 16px;

          border:
            1px solid
            rgba(94, 203, 255, 0.45);

          border-radius: 14px;

          outline: none;

          background:
            rgba(3, 13, 25, 0.8);

          color: #fff;

          font-size: 15px;

          line-height: 1.5;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .prompt::placeholder {
          color: #68798b;
        }

        .prompt:focus {
          border-color: #63d3ff;

          box-shadow:
            0 0 15px
            rgba(70, 199, 255, 0.25);
        }

        .options {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 12px;
        }

        select {
          width: 100%;

          padding: 13px;

          border-radius: 12px;

          border:
            1px solid
            rgba(94, 203, 255, 0.35);

          outline: none;

          background: #0a192b;

          color: #fff;

          font-size: 14px;
        }

        .credits {
          margin-top: 20px;

          padding:
            13px 15px;

          border-radius: 12px;

          background:
            rgba(29, 112, 157, 0.16);

          border:
            1px solid
            rgba(94, 203, 255, 0.25);

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
            0 0 10px
              rgba(70, 199, 255, 0.7),
            0 0 24px
              rgba(43, 167, 255, 0.35);
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
            1px dashed
            rgba(104, 207, 255, 0.35);

          background:
            radial-gradient(
              circle,
              rgba(43, 167, 255, 0.08),
              transparent 55%
            ),
            rgba(2, 12, 24, 0.55);

          overflow: hidden;

          padding: 20px;
        }

        .preview-image {
          width: 100%;

          max-height: 470px;

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
          margin:
            10px auto 0;

          max-width: 390px;

          color: #8798aa;

          line-height: 1.5;
        }

        .success-message,
        .error-message,
        .task-id {
          margin:
            18px auto 0;

          max-width: 430px;

          padding:
            13px 15px;

          border-radius: 12px;

          font-size: 13px;

          line-height: 1.5;
        }

        .success-message {
          background:
            rgba(35, 170, 115, 0.12);

          border:
            1px solid
            rgba(65, 220, 160, 0.3);

          color: #8ff0c6;
        }

        .error-message {
          background:
            rgba(220, 70, 70, 0.12);

          border:
            1px solid
            rgba(255, 100, 100, 0.3);

          color: #ffb0b0;
        }

        .task-id {
          background:
            rgba(94, 203, 255, 0.08);

          border:
            1px solid
            rgba(94, 203, 255, 0.2);

          color: #9fdfff;

          word-break: break-all;
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

        .footer {
          border-top:
            1px solid
            rgba(100, 180, 255, 0.18);

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

        .footer-column a:hover {
          color: #68d2ff;
        }

        .footer-bottom {
          margin-top: 36px;

          padding-top: 22px;

          border-top:
            1px solid
            rgba(100, 180, 255, 0.16);

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
          }

          .brand-name {
            font-size: 16px;
          }

          .content {
            width:
              min(
                430px,
                calc(100% - 28px)
              );

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
            gap: 9px;
          }

          .image-box {
            height: 145px;
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

        @media (max-width: 430px) {
          .topbar {
            flex-wrap: wrap;

            justify-content: center;

            padding:
              14px 10px;
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
        }
      `}</style>

      <main className="page">

        <header className="topbar">

          <div className="brand">

            <span className="brand-icon">
              ✨
            </span>

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

        <section className="content">

          <div className="title-area">

            <h1>
              Imagem → Imagem
            </h1>

            <p>
              Transforme suas imagens com
              inteligência artificial.
            </p>

          </div>

          <div className="workspace">

            <section className="panel">

              <h2>
                🖼️ Transformar imagem
              </h2>

              <label className="label images-label">
                Imagens de referência
              </label>

              <div className="images-container">

                {/* IMAGEM 1 */}

                <div
                  className={`image-box ${
                    preview1
                      ? "has-image"
                      : ""
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
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden-input"
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              1
                            )
                          }
                        />

                      </label>
                    </>

                  ) : (

                    <div className="image-box-content">

                      <div className="plus">
                        +
                      </div>

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
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden-input"
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              1
                            )
                          }
                        />

                      </label>

                    </div>

                  )}

                </div>

                {/* IMAGEM 2 */}

                <div
                  className={`image-box ${
                    preview2
                      ? "has-image"
                      : ""
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
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden-input"
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              2
                            )
                          }
                        />

                      </label>
                    </>

                  ) : (

                    <div className="image-box-content">

                      <div className="plus">
                        +
                      </div>

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
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden-input"
                          onChange={(e) =>
                            handleImageChange(
                              e,
                              2
                            )
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
                  setPrompt(
                    e.target.value
                  )
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
                      setAspectRatio(
                        e.target.value
                      )
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
                      setStyle(
                        e.target.value
                      )
                    }
                  >

                    <option value="Realista">
                      Realista
                    </option>

                    <option value="Cinematográfico">
                      Cinematográfico
                    </option>

                    <option value="Artístico">
                      Artístico
                    </option>

                    <option value="Anime">
                      Anime
                    </option>

                    <option value="3D">
                      3D
                    </option>

                  </select>

                </div>

              </div>

              <div className="credits">

                💎 Seus créditos:{" "}

                <strong>
                  30
                </strong>

              </div>

              <button
                className="generate"
                onClick={handleGenerate}
                disabled={loading}
              >

                {loading
                  ? "✨ Preparando imagem..."
                  : "✨ Gerar Imagem"}

              </button>

            </section>

            <section className="panel">

              <h2>
                🖼️ Resultado
              </h2>

              <div
                className={`preview ${
                  loading
                    ? "loading"
                    : ""
                }`}
              >

                <div>

                  {resultImageUrl ? (

                    <img
                      src={resultImageUrl}
                      alt="Imagem gerada"
                      className="preview-image"
                    />

                  ) : (

                    <>

                      <div className="preview-icon">

                        {loading
                          ? "✨"
                          : resultMessage
                          ? "✅"
                          : errorMessage
                          ? "⚠️"
                          : "🖼️"}

                      </div>

                      <h3>

                        {loading
                          ? "Preparando sua solicitação..."
                          : resultMessage
                          ? "Solicitação enviada!"
                          : errorMessage
                          ? "Não foi possível gerar"
                          : "Sua nova imagem aparecerá aqui"}

                      </h3>

                      {!loading &&
                        !resultMessage &&
                        !errorMessage && (

                          <p>
                            Envie uma ou duas
                            imagens, descreva a
                            transformação e clique
                            em “Gerar Imagem” para
                            começar.
                          </p>

                        )}

                    </>

                  )}

                  {resultMessage && (

                    <div className="success-message">
                      {resultMessage}
                    </div>

                  )}

                  {taskId && (

                    <div className="task-id">

                      <strong>
                        ID da tarefa:
                      </strong>

                      <br />

                      {taskId}

                    </div>

                  )}

                  {errorMessage && (

                    <div className="error-message">
                      {errorMessage}
                    </div>

                  )}

                </div>

              </div>

            </section>

          </div>

        </section>

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

              © 2026 CIEL IA STUDIO.
              Todos os direitos reservados.

            </div>

          </div>

        </footer>

      </main>
    </>
  );
}
