"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage(
        "Conta criada! Verifique seu e-mail para confirmar o cadastro."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao conectar ao Supabase."
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
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 20px;
          color: #ffffff;

          background:
            radial-gradient(
              circle at 80% 15%,
              rgba(20, 119, 190, 0.42),
              transparent 38%
            ),
            radial-gradient(
              circle at 15% 75%,
              rgba(15, 76, 125, 0.32),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #06101e 0%,
              #081a30 48%,
              #0b3556 100%
            );
        }

        .card {
          width: 100%;
          max-width: 440px;
          padding: 34px;

          border-radius: 24px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.96),
              rgba(14, 25, 40, 0.98)
            );

          border: 2px solid #58c9ff;

          box-shadow:
            0 0 8px rgba(70, 199, 255, 0.8),
            0 0 25px rgba(43, 167, 255, 0.35),
            inset 0 0 25px rgba(56, 174, 255, 0.07);
        }

        .logo {
          text-align: center;
          margin-bottom: 28px;
        }

        .logo-icon {
          font-size: 42px;
          margin-bottom: 10px;
          filter: drop-shadow(
            0 0 10px rgba(75, 199, 255, 0.8)
          );
        }

        .logo-title {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .logo-subtitle {
          margin: 9px 0 0;
          color: #aebdcd;
          font-size: 15px;
        }

        .form {
          width: 100%;
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

        .input {
          width: 100%;
          padding: 14px 15px;

          border-radius: 12px;
          border: 1px solid rgba(94, 203, 255, 0.4);

          outline: none;

          background: rgba(3, 13, 25, 0.82);
          color: #ffffff;

          font-size: 15px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .input::placeholder {
          color: #68798b;
        }

        .input:focus {
          border-color: #63d3ff;

          background: rgba(3, 16, 30, 0.95);

          box-shadow:
            0 0 12px rgba(70, 199, 255, 0.25),
            inset 0 0 10px rgba(56, 174, 255, 0.04);
        }

        .error {
          margin: 2px 0 16px;
          padding: 11px 13px;

          border-radius: 10px;

          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.3);

          color: #fca5a5;
          font-size: 13px;
          line-height: 1.4;
        }

        .success {
          margin: 2px 0 16px;
          padding: 11px 13px;

          border-radius: 10px;

          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.3);

          color: #86efac;
          font-size: 13px;
          line-height: 1.4;
        }

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
            0 0 10px rgba(70, 199, 255, 0.7),
            0 0 24px rgba(43, 167, 255, 0.35);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 0 14px rgba(85, 211, 255, 1),
            0 0 32px rgba(43, 167, 255, 0.55);
        }

        .button:active {
          transform: scale(0.98);
        }

        .button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
          transform: none;
        }

        .login-text {
          margin: 25px 0 0;

          text-align: center;

          color: #9eacbd;
          font-size: 14px;
        }

        .login-link {
          color: #68d2ff;
          font-weight: 700;
          text-decoration: none;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .login-link:hover {
          color: #a4e9ff;

          text-shadow:
            0 0 10px rgba(75, 199, 255, 0.8);
        }

        .security {
          margin-top: 24px;
          padding-top: 18px;

          border-top: 1px solid rgba(100, 180, 255, 0.14);

          text-align: center;

          color: #718297;
          font-size: 12px;
        }

        @media (max-width: 520px) {
          .page {
            padding: 22px 14px;
          }

          .card {
            padding: 25px 21px;
            border-radius: 20px;
          }

          .logo-title {
            font-size: 24px;
          }

          .logo-icon {
            font-size: 36px;
          }
        }
      `}</style>

      <main className="page">
        <section className="card">

          {/* LOGO */}

          <div className="logo">
            <div className="logo-icon">
              ✨
            </div>

            <h1 className="logo-title">
              CIEL IA STUDIO
            </h1>

            <p className="logo-subtitle">
              Crie sua conta para começar.
            </p>
          </div>

          {/* FORMULÁRIO */}

          <form
            className="form"
            onSubmit={handleCadastro}
          >

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

            {/* SENHA */}

            <div className="field">
              <label className="label">
                Senha
              </label>

              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Crie uma senha"
                required
                minLength={6}
              />
            </div>

            {/* ERRO */}

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {/* SUCESSO */}

            {message && (
              <div className="success">
                {message}
              </div>
            )}

            {/* BOTÃO */}

            <button
              type="submit"
              className="button"
              disabled={loading}
            >
              {loading
                ? "Criando..."
                : "CRIAR CONTA"}
            </button>

          </form>

          {/* LOGIN */}

          <p className="login-text">
            Já tem uma conta?{" "}

            <a
              href="/login"
              className="login-link"
            >
              Entrar
            </a>
          </p>

          <div className="security">
            🔒 Seus dados são protegidos com segurança.
          </div>

        </section>
      </main>
    </>
  );
}
