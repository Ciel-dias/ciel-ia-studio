"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContatoPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setEnviado(false);

    /*
     * FUTURO:
     * Aqui vamos conectar o formulário ao sistema
     * de mensagens/e-mail do CIEL IA STUDIO.
     */

    setTimeout(() => {
      setLoading(false);
      setEnviado(true);

      setNome("");
      setEmail("");
      setAssunto("");
      setMensagem("");
    }, 700);
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
          background: #06101e;
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
              circle at 75% 18%,
              rgba(20, 119, 190, 0.42),
              transparent 38%
            ),
            radial-gradient(
              circle at 15% 70%,
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

        .back-link {
          color: #7bd8ff;

          text-decoration: none;

          font-size: 17px;
          font-weight: 700;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .back-link:hover {
          color: #b4ecff;

          text-shadow:
            0 0 12px rgba(75, 199, 255, 0.8);

          transform: translateX(-2px);
        }

        /* =========================
           CONTEÚDO
        ========================= */

        .content {
          width: min(900px, calc(100% - 32px));

          margin: 0 auto;

          padding: 68px 0 80px;
        }

        .hero {
          text-align: center;

          margin-bottom: 42px;
        }

        .hero-icon {
          font-size: 58px;

          margin-bottom: 12px;

          filter: drop-shadow(
            0 0 14px rgba(75, 199, 255, 0.75)
          );
        }

        .hero h1 {
          margin: 0;

          font-size: clamp(38px, 6vw, 56px);

          line-height: 1.1;

          font-weight: 800;

          letter-spacing: 0.3px;
        }

        .hero p {
          max-width: 680px;

          margin: 20px auto 0;

          color: #b8c8d8;

          font-size: clamp(17px, 2.4vw, 21px);

          line-height: 1.55;
        }

        /* =========================
           CARD
        ========================= */

        .contact-card {
          width: 100%;

          padding: 38px;

          border-radius: 24px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.97),
              rgba(14, 25, 40, 0.98)
            );

          border: 2px solid #58c9ff;

          box-shadow:
            0 0 8px rgba(70, 199, 255, 0.75),
            0 0 28px rgba(43, 167, 255, 0.32),
            inset 0 0 25px
              rgba(56, 174, 255, 0.06);
        }

        .card-title {
          margin: 0 0 8px;

          font-size: 27px;
          font-weight: 800;
        }

        .card-subtitle {
          margin: 0 0 30px;

          color: #aebdcd;

          font-size: 15px;

          line-height: 1.5;
        }

        /* =========================
           FORMULÁRIO
        ========================= */

        .form {
          width: 100%;
        }

        .row {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 20px;
        }

        .field {
          margin-bottom: 20px;
        }

        .label {
          display: block;

          margin-bottom: 8px;

          color: #d8e5f0;

          font-size: 14px;

          font-weight: 700;
        }

        .input,
        .textarea,
        .select {
          width: 100%;

          border-radius: 12px;

          border: 1px solid
            rgba(94, 203, 255, 0.38);

          outline: none;

          background: rgba(3, 13, 25, 0.82);

          color: #ffffff;

          font-family: Arial, Helvetica, sans-serif;

          font-size: 15px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .input,
        .select {
          height: 50px;

          padding: 0 15px;
        }

        .textarea {
          min-height: 155px;

          padding: 14px 15px;

          resize: vertical;

          line-height: 1.5;
        }

        .input::placeholder,
        .textarea::placeholder {
          color: #68798b;
        }

        .input:focus,
        .textarea:focus,
        .select:focus {
          border-color: #63d3ff;

          background: rgba(3, 16, 30, 0.95);

          box-shadow:
            0 0 12px
              rgba(70, 199, 255, 0.24),
            inset 0 0 10px
              rgba(56, 174, 255, 0.04);
        }

        .select {
          cursor: pointer;
        }

        .select option {
          background: #0d1c2d;

          color: #ffffff;
        }

        /* =========================
           SUCESSO
        ========================= */

        .success {
          margin-bottom: 20px;

          padding: 13px 15px;

          border-radius: 11px;

          background: rgba(34, 197, 94, 0.1);

          border: 1px solid
            rgba(74, 222, 128, 0.3);

          color: #86efac;

          font-size: 14px;

          line-height: 1.45;
        }

        /* =========================
           BOTÃO
        ========================= */

        .button {
          width: 100%;

          margin-top: 4px;

          padding: 16px;

          border: none;

          border-radius: 13px;

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
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 0 14px
              rgba(85, 211, 255, 1),
            0 0 32px
              rgba(43, 167, 255, 0.55);
        }

        .button:active {
          transform: scale(0.98);
        }

        .button:disabled {
          cursor: not-allowed;

          opacity: 0.6;

          transform: none;
        }

        /* =========================
           AVISO
        ========================= */

        .privacy-note {
          margin-top: 22px;

          padding-top: 20px;

          border-top: 1px solid
            rgba(100, 180, 255, 0.14);

          text-align: center;

          color: #8192a5;

          font-size: 12px;

          line-height: 1.5;
        }

        /* =========================
           RESPONSIVO
        ========================= */

        @media (max-width: 700px) {
          .topbar {
            padding: 0 20px;
          }

          .brand-name {
            font-size: 18px;
          }

          .back-link {
            font-size: 15px;
          }

          .content {
            padding-top: 52px;
          }

          .contact-card {
            padding: 28px 22px;
          }

          .row {
            grid-template-columns: 1fr;

            gap: 0;
          }
        }

        @media (max-width: 480px) {
          .topbar {
            min-height: 68px;

            padding: 0 15px;
          }

          .brand {
            gap: 7px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .brand-name {
            font-size: 15px;
          }

          .back-link {
            font-size: 13px;
          }

          .content {
            width: min(
              100% - 24px,
              900px
            );

            padding: 45px 0 60px;
          }

          .hero-icon {
            font-size: 50px;
          }

          .hero h1 {
            font-size: 38px;
          }

          .hero p {
            font-size: 16px;
          }

          .contact-card {
            padding: 25px 18px;

            border-radius: 20px;
          }

          .card-title {
            font-size: 23px;
          }

          .card-subtitle {
            font-size: 14px;
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

          <Link
            href="/dashboard"
            className="back-link"
          >
            ← Voltar ao Dashboard
          </Link>

        </header>

        {/* =========================
            CONTEÚDO
        ========================= */}

        <section className="content">

          <div className="hero">

            <div className="hero-icon">
              💬
            </div>

            <h1>
              Contato
            </h1>

            <p>
              Entre em contato com o CIEL IA STUDIO.
              Envie sua dúvida, sugestão ou mensagem
              para nossa equipe.
            </p>

          </div>

          {/* =========================
              FORMULÁRIO
          ========================= */}

          <section className="contact-card">

            <h2 className="card-title">
              Envie uma mensagem
            </h2>

            <p className="card-subtitle">
              Preencha o formulário abaixo e
              entraremos em contato assim que
              possível.
            </p>

            {enviado && (
              <div className="success">
                ✓ Mensagem enviada com sucesso!
                <br />
                Em breve entraremos em contato.
              </div>
            )}

            <form
              className="form"
              onSubmit={handleSubmit}
            >

              <div className="row">

                {/* NOME */}

                <div className="field">

                  <label className="label">
                    Nome
                  </label>

                  <input
                    className="input"
                    type="text"
                    value={nome}
                    onChange={(e) =>
                      setNome(e.target.value)
                    }
                    placeholder="Seu nome"
                    required
                  />

                </div>

                {/* E-MAIL */}

                <div className="field">

                  <label className="label">
                    E-mail
                  </label>

                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="seu@email.com"
                    required
                  />

                </div>

              </div>

              {/* ASSUNTO */}

              <div className="field">

                <label className="label">
                  Assunto
                </label>

                <select
                  className="select"
                  value={assunto}
                  onChange={(e) =>
                    setAssunto(e.target.value)
                  }
                  required
                >

                  <option value="">
                    Selecione um assunto
                  </option>

                  <option value="duvida">
                    Dúvida
                  </option>

                  <option value="problema">
                    Problema técnico
                  </option>

                  <option value="conta">
                    Minha conta
                  </option>

                  <option value="creditos">
                    Créditos
                  </option>

                  <option value="sugestao">
                    Sugestão
                  </option>

                  <option value="outro">
                    Outro assunto
                  </option>

                </select>

              </div>

              {/* MENSAGEM */}

              <div className="field">

                <label className="label">
                  Mensagem
                </label>

                <textarea
                  className="textarea"
                  value={mensagem}
                  onChange={(e) =>
                    setMensagem(e.target.value)
                  }
                  placeholder="Digite sua mensagem..."
                  required
                  minLength={10}
                />

              </div>

              {/* BOTÃO */}

              <button
                type="submit"
                className="button"
                disabled={loading}
              >
                {loading
                  ? "Enviando..."
                  : "ENVIAR MENSAGEM"}
              </button>

            </form>

            <div className="privacy-note">
              🔒 Suas informações serão tratadas
              com segurança e de acordo com a
              Política de Privacidade do CIEL IA
              STUDIO.
            </div>

          </section>

        </section>

      </main>
    </>
  );
}
