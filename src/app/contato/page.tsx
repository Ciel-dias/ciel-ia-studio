"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContatoPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Formulário preparado para futura integração
    // com sistema de suporte / banco de dados.

    setEnviado(true);

    setNome("");
    setEmail("");
    setAssunto("");
    setMensagem("");
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
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          background: #06101e;
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }

        .page {
          min-height: 100vh;
          color: #ffffff;

          background:
            radial-gradient(
              circle at 80% 10%,
              rgba(20, 119, 190, 0.38),
              transparent 36%
            ),
            radial-gradient(
              circle at 10% 70%,
              rgba(15, 76, 125, 0.28),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #06101e 0%,
              #081a30 48%,
              #0b3556 100%
            );

          padding: 45px 20px 70px;
        }

        .container {
          width: min(900px, 100%);
          margin: 0 auto;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 30px;

          color: #78d9ff;
          text-decoration: none;

          font-size: 14px;
          font-weight: 700;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .back-button:hover {
          color: #b5ecff;
          transform: translateX(-3px);
        }

        .header {
          text-align: center;
          margin-bottom: 38px;
        }

        .icon {
          font-size: 48px;
          margin-bottom: 12px;

          filter: drop-shadow(
            0 0 12px rgba(75, 199, 255, 0.75)
          );
        }

        h1 {
          margin: 0;

          font-size: clamp(32px, 5vw, 46px);
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .subtitle {
          margin: 13px auto 0;

          max-width: 620px;

          color: #aebdcd;

          font-size: 17px;
          line-height: 1.6;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;

          margin-bottom: 28px;
        }

        .info-card {
          padding: 25px;

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.96),
              rgba(14, 25, 40, 0.98)
            );

          border: 1px solid rgba(88, 201, 255, 0.55);

          box-shadow:
            0 0 10px rgba(70, 199, 255, 0.16),
            inset 0 0 20px rgba(56, 174, 255, 0.04);
        }

        .info-icon {
          font-size: 30px;
          margin-bottom: 12px;
        }

        .info-card h2 {
          margin: 0 0 8px;

          font-size: 18px;
        }

        .info-card p {
          margin: 0;

          color: #aebdcd;

          font-size: 14px;
          line-height: 1.55;
        }

        .placeholder {
          display: inline-block;
          margin-top: 8px;

          color: #68d2ff;

          font-weight: 700;
        }

        .form-card {
          padding: 32px;

          border-radius: 22px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.97),
              rgba(14, 25, 40, 0.99)
            );

          border: 2px solid #58c9ff;

          box-shadow:
            0 0 9px rgba(70, 199, 255, 0.42),
            0 0 28px rgba(43, 167, 255, 0.18),
            inset 0 0 24px rgba(56, 174, 255, 0.05);
        }

        .form-title {
          margin: 0 0 7px;

          font-size: 24px;
          font-weight: 800;
        }

        .form-description {
          margin: 0 0 25px;

          color: #9eacbd;

          font-size: 14px;
          line-height: 1.5;
        }

        .field {
          margin-bottom: 18px;
        }

        .label {
          display: block;

          margin-bottom: 8px;

          color: #d5e1ec;

          font-size: 14px;
          font-weight: 700;
        }

        .input,
        .textarea,
        .select {
          width: 100%;

          border-radius: 11px;
          border: 1px solid rgba(94, 203, 255, 0.35);

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
          height: 48px;
          padding: 0 14px;
        }

        .textarea {
          min-height: 145px;
          padding: 13px 14px;
          resize: vertical;
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
            0 0 12px rgba(70, 199, 255, 0.2);
        }

        .button {
          width: 100%;

          padding: 15px;

          border: none;
          border-radius: 12px;

          cursor: pointer;

          color: #04101b;

          background:
            linear-gradient(
              90deg,
              #5ed2ff,
              #75e0ff
            );

          font-size: 15px;
          font-weight: 800;

          box-shadow:
            0 0 10px rgba(70, 199, 255, 0.55),
            0 0 22px rgba(43, 167, 255, 0.25);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 0 14px rgba(85, 211, 255, 0.9),
            0 0 28px rgba(43, 167, 255, 0.45);
        }

        .button:active {
          transform: scale(0.98);
        }

        .success {
          margin-bottom: 18px;

          padding: 13px 15px;

          border-radius: 10px;

          background: rgba(34, 197, 94, 0.1);

          border: 1px solid rgba(74, 222, 128, 0.3);

          color: #86efac;

          font-size: 14px;
          line-height: 1.45;
        }

        .footer-note {
          margin-top: 25px;

          text-align: center;

          color: #718297;

          font-size: 12px;
          line-height: 1.5;
        }

        @media (max-width: 650px) {
          .page {
            padding: 30px 15px 50px;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .form-card {
            padding: 24px 20px;
          }

          .info-card {
            padding: 22px;
          }

          .header {
            margin-bottom: 30px;
          }

          .subtitle {
            font-size: 15px;
          }
        }
      `}</style>

      <main className="page">
        <div className="container">

          <Link
            href="/dashboard"
            className="back-button"
          >
            ← Voltar ao Dashboard
          </Link>

          <header className="header">
            <div className="icon">
              💬
            </div>

            <h1>
              Contato
            </h1>

            <p className="subtitle">
              Estamos aqui para ajudar. Entre em contato
              com a equipe do CIEL IA STUDIO sempre que
              precisar.
            </p>
          </header>

          <section className="contact-grid">

            <div className="info-card">
              <div className="info-icon">
                📧
              </div>

              <h2>
                E-mail
              </h2>

              <p>
                Nosso canal oficial de contato será
                disponibilizado aqui.
              </p>

              <span className="placeholder">
                Seu e-mail aqui
              </span>
            </div>

            <div className="info-card">
              <div className="info-icon">
                🛟
              </div>

              <h2>
                Suporte
              </h2>

              <p>
                Precisa de ajuda com sua conta,
                créditos ou alguma funcionalidade?
                Envie uma mensagem pelo formulário.
              </p>
            </div>

          </section>

          <section className="form-card">

            <h2 className="form-title">
              Envie uma mensagem
            </h2>

            <p className="form-description">
              Preencha os campos abaixo. Este formulário
              já está preparado para receber a integração
              do sistema de suporte posteriormente.
            </p>

            {enviado && (
              <div className="success">
                ✓ Mensagem preparada com sucesso.
                O envio real será conectado ao sistema
                de suporte posteriormente.
              </div>
            )}

            <form onSubmit={handleSubmit}>

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

                  <option value="conta">
                    Minha conta
                  </option>

                  <option value="creditos">
                    Créditos
                  </option>

                  <option value="geracao">
                    Problema com geração
                  </option>

                  <option value="bug">
                    Relatar um problema
                  </option>

                  <option value="sugestao">
                    Sugestão
                  </option>

                  <option value="outro">
                    Outro assunto
                  </option>
                </select>
              </div>

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
                />
              </div>

              <button
                type="submit"
                className="button"
              >
                ENVIAR MENSAGEM
              </button>

            </form>

          </section>

          <p className="footer-note">
            CIEL IA STUDIO — Crie. Transforme. Inove com IA.
          </p>

        </div>
      </main>
    </>
  );
}
