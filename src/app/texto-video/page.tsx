"use client";

import Link from "next/link";
import { useState } from "react";

type KlingResponse = {
  status?: string;
  message?: string;
  taskId?: string | null;
  klingStatus?: number;
  klingResponse?: {
    code?: number;
    message?: string;
    request_id?: string;
    data?: {
      task_id?: string;
    };
    task_id?: string;
  };
};

export default function TextoVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [duration, setDuration] = useState("5 segundos");
  const [style, setStyle] = useState("Realista");
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
    details?: KlingResponse;
  }>({
    type: "idle",
    message: "",
  });

  async function handleGenerate() {
    if (!prompt.trim()) {
      setResult({
        type: "error",
        message: "Digite uma descrição para gerar seu vídeo.",
      });

      return;
    }

    setLoading(true);

    setResult({
      type: "loading",
      message: "Enviando sua criação para a Kling...",
    });

    try {
      /*
       * A rota atual da Kling trabalha com:
       * 5 ou 10 segundos.
       */

      const durationValue =
        duration === "10 segundos"
          ? "10"
          : "5";

      const response = await fetch("/api/kling", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: prompt.trim(),

          aspect_ratio: aspectRatio,

          duration: durationValue,

          mode: "std",

          model_name: "kling-v3",

          negative_prompt:
            "baixa qualidade, deformações, mãos deformadas, rosto deformado",
        }),
      });

      const data: KlingResponse =
        await response.json();

      /*
       * Erro retornado pela API.
       */

      if (!response.ok || data.status === "error") {
        const klingData =
          data.klingResponse;

        const klingCode =
          klingData?.code ?? "N/A";

        const klingMessage =
          klingData?.message ||
          data.message ||
          "A Kling recusou a solicitação.";

        const requestId =
          klingData?.request_id ||
          "N/A";

        /*
         * Código 1102:
         * Account balance not enough
         */

        if (
          klingCode === 1102 ||
          klingMessage
            .toLowerCase()
            .includes(
              "account balance not enough"
            )
        ) {
          setResult({
            type: "error",

            message:
              "Saldo insuficiente na Kling para gerar este vídeo.",

            details: data,
          });

          return;
        }

        setResult({
          type: "error",

          message: klingMessage,

          details: data,
        });

        return;
      }

      /*
       * Solicitação aceita pela Kling.
       */

      const taskId =
        data.taskId ||
        data.klingResponse?.data?.task_id ||
        data.klingResponse?.task_id ||
        null;

      setResult({
        type: "success",

        message:
          "Sua tarefa foi enviada para a Kling com sucesso!",

        details: {
          ...data,
          taskId,
        },
      });
    } catch (error) {
      console.error(
        "Erro ao chamar /api/kling:",
        error
      );

      setResult({
        type: "error",

        message:
          error instanceof Error
            ? error.message
            : "Não foi possível conectar à API Kling.",
      });
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
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        a,
        button,
        textarea,
        select {
          -webkit-tap-highlight-color:
            transparent;
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

        /* =========================
           TOPO
        ========================= */

        .topbar {
          min-height: 74px;

          padding: 0 42px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          background:
            rgba(4, 12, 24, 0.9);

          border-bottom:
            1px solid rgba(
              100,
              180,
              255,
              0.18
            );

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

          text-shadow:
            0 0 12px
            rgba(75, 199, 255, 0.8);
        }

        /* =========================
           CONTEÚDO
        ========================= */

        .content {
          width:
            min(1180px, calc(100% - 40px));

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
            clamp(32px, 5vw, 52px);

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

        /* =========================
           WORKSPACE
        ========================= */

        .workspace {
          display: grid;

          grid-template-columns:
            0.9fr 1.1fr;

          gap: 28px;

          align-items: stretch;
        }

        /* =========================
           PAINÉIS
        ========================= */

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

        /* =========================
           CAMPOS
        ========================= */

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

          cursor: pointer;
        }

        select:focus {
          border-color: #63d3ff;

          box-shadow:
            0 0 12px
            rgba(70, 199, 255, 0.2);
        }

        /* =========================
           CRÉDITOS
        ========================= */

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

        /* =========================
           BOTÃO
        ========================= */

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

          transition:
            transform 0.2s,
            box-shadow 0.2s;
        }

        .generate:hover {
          transform: translateY(-2px);

          box-shadow:
            0 0 14px
            rgba(85, 211, 255, 1),

            0 0 32px
            rgba(43, 167, 255, 0.55);
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
           PREVIEW
        ========================= */

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

          padding: 28px;
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

        /* =========================
           ESTADOS
        ========================= */

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

        .result-loading {
          width: 100%;

          padding: 24px;
        }

        .result-success {
          width: 100%;

          padding: 24px;

          border-radius: 16px;

          background:
            rgba(26, 126, 91, 0.14);

          border:
            1px solid
            rgba(78, 220, 164, 0.45);
        }

        .result-success
          .preview-icon {
          margin-bottom: 10px;
        }

        .result-error {
          width: 100%;

          padding: 24px;

          border-radius: 16px;

          background:
            rgba(145, 35, 45, 0.16);

          border:
            1px solid
            rgba(255, 105, 120, 0.5);
        }

        .result-error
          .preview-icon {
          margin-bottom: 10px;
        }

        .details {
          margin-top: 22px;

          padding: 16px;

          text-align: left;

          border-radius: 12px;

          background:
            rgba(0, 0, 0, 0.25);

          border:
            1px solid
            rgba(255, 255, 255, 0.08);

          font-size: 13px;

          line-height: 1.8;

          word-break: break-word;
        }

        .details strong {
          color: #d9f5ff;
        }

        .task-id {
          margin-top: 15px;

          padding: 12px;

          border-radius: 10px;

          background:
            rgba(94, 203, 255, 0.08);

          border:
            1px solid
            rgba(94, 203, 255, 0.25);

          word-break: break-all;

          color: #bfeaff;
        }

        /* =========================
           RODAPÉ
        ========================= */

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

          transition:
            color 0.2s ease;
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

        /* =========================
           TABLET
        ========================= */

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

        /* =========================
           CELULAR
        ========================= */

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
            width:
              min(430px, calc(100% - 28px));

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
        }
      `}</style>

      <main className="page">

        {/* CABEÇALHO */}

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

        {/* CONTEÚDO */}

        <section className="content">

          <div className="title-area">

            <h1>
              Texto → Vídeo
            </h1>

            <p>
              Transforme suas ideias em vídeos
              incríveis usando inteligência artificial.
            </p>

          </div>

          <div className="workspace">

            {/* PAINEL DE CRIAÇÃO */}

            <section className="panel">

              <h2>
                🎥 Criar vídeo
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
                placeholder="Exemplo: Uma mulher caminhando em uma cidade futurista ao pôr do sol, câmera cinematográfica acompanhando seus movimentos..."
              />

              <div className="options">

                {/* PROPORÇÃO */}

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

                    <option value="9:16">
                      9:16 — Vertical
                    </option>

                    <option value="16:9">
                      16:9 — Paisagem
                    </option>

                    <option value="1:1">
                      1:1 — Quadrada
                    </option>

                  </select>

                </div>

                {/* DURAÇÃO */}

                <div>

                  <label className="label">
                    Duração
                  </label>

                  <select
                    value={duration}
                    onChange={(e) =>
                      setDuration(
                        e.target.value
                      )
                    }
                  >

                    <option value="5 segundos">
                      5 segundos
                    </option>

                    <option value="10 segundos">
                      10 segundos
                    </option>

                  </select>

                </div>

              </div>

              {/* ESTILO */}

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

              {/* CRÉDITOS */}

              <div className="credits">

                💎 Seus créditos:{" "}

                <strong>
                  30
                </strong>

              </div>

              {/* BOTÃO */}

              <button
                className="generate"
                onClick={handleGenerate}
                disabled={loading}
              >

                {loading
                  ? "🎥 Enviando para Kling..."
                  : "🎥 Gerar Vídeo"}

              </button>

            </section>

            {/* RESULTADO */}

            <section className="panel">

              <h2>
                🎬 Resultado
              </h2>

              <div className="preview">

                {/* ESTADO INICIAL */}

                {result.type === "idle" && (
                  <div>

                    <div className="preview-icon">
                      🎬
                    </div>

                    <h3>
                      Seu vídeo aparecerá aqui
                    </h3>

                    <p>
                      Escreva um prompt ao lado e
                      clique em “Gerar Vídeo” para
                      começar.
                    </p>

                  </div>
                )}

                {/* ENVIANDO */}

                {result.type === "loading" && (
                  <div
                    className=
                      "result-loading loading"
                  >

                    <div className="preview-icon">
                      🎥
                    </div>

                    <h3>
                      Enviando para a Kling...
                    </h3>

                    <p>
                      Estamos enviando sua
                      solicitação de geração
                      de vídeo.
                    </p>

                  </div>
                )}

                {/* SUCESSO */}

                {result.type === "success" && (
                  <div className="result-success">

                    <div className="preview-icon">
                      ✅
                    </div>

                    <h3>
                      Tarefa enviada com sucesso!
                    </h3>

                    <p>
                      A Kling aceitou sua
                      solicitação e iniciou o
                      processamento.
                    </p>

                    {result.details?.taskId && (
                      <div className="task-id">

                        <strong>
                          Task ID:
                        </strong>

                        <br />

                        {result.details.taskId}

                      </div>
                    )}

                  </div>
                )}

                {/* ERRO */}

                {result.type === "error" && (
                  <div className="result-error">

                    <div className="preview-icon">
                      ⚠️
                    </div>

                    <h3>
                      {result.message}
                    </h3>

                    {result.details && (
                      <div className="details">

                        <div>
                          <strong>
                            HTTP:
                          </strong>{" "}
                          {result.details
                            .klingStatus ??
                            "N/A"}
                        </div>

                        <div>
                          <strong>
                            Código Kling:
                          </strong>{" "}
                          {result.details
                            .klingResponse
                            ?.code ??
                            "N/A"}
                        </div>

                        <div>
                          <strong>
                            Mensagem Kling:
                          </strong>{" "}
                          {result.details
                            .klingResponse
                            ?.message ??
                            result.details
                              .message ??
                            "N/A"}
                        </div>

                        <div>
                          <strong>
                            Request ID:
                          </strong>{" "}
                          {result.details
                            .klingResponse
                            ?.request_id ??
                            "N/A"}
                        </div>

                      </div>
                    )}

                  </div>
                )}

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

              © 2026 CIEL IA STUDIO.
              Todos os direitos reservados.

            </div>

          </div>

        </footer>

      </main>
    </>
  );
}
