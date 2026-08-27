"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const supabase = createClient();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
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

        a,
        button,
        input {
          -webkit-tap-highlight-color: transparent;
        }

        .login-page {
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
              rgba(15, 76, 125, 0.3),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #06101e 0%,
              #081a30 48%,
              #0b3556 100%
            );
          overflow: hidden;
        }

        .login-container {
          width: 100%;
          max-width: 450px;
        }

        /* LOGO */

        .brand {
          text-align: center;
          margin-bottom: 28px;
        }

        .brand-icon {
          display: block;
          font-size: 48px;
          line-height: 1;
          margin-bottom: 12px;
          filter: drop-shadow(
            0 0 12px rgba(82, 205, 255, 0.75)
          );
        }

        .brand-name {
          margin: 0;
          font-size: 27px;
          font-weight: 800;
          letter-spacing: 0.8px;
        }

        .brand-subtitle {
          margin: 8px 0 0;
          color: #9eb2c6;
          font-size: 14px;
        }

        /* CARD */

        .login-card {
          width: 100%;
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
            0 0 9px rgba(70, 199, 255, 0.85),
            0 0 28px rgba(43, 167, 255, 0.4),
            inset 0 0 25px rgba(56, 174, 255, 0.07);
        }

        .card-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .card-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }

        .card-header p {
          margin: 10px 0 0;
          color: #aebdcd;
          font-size: 15px;
          line-height: 1.5;
        }

        /* FORM */

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 9px;
          color: #d3deea;
          font-size: 14px;
          font-weight: 700;
        }

        .input {
          width: 100%;
          height: 50px;
          padding: 0 15px;
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
          color: #64788d;
        }

        .input:focus {
          border-color: #63d3ff;
          background: rgba(3, 13, 25, 0.95);
          box-shadow:
            0 0 10px rgba(70, 199, 255, 0.22),
            inset 0 0 10px rgba(56, 174, 255, 0.05);
        }

        /* ERROR */

        .error {
          margin: 0 0 18px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(248, 113, 113, 0.35);
          background: rgba(127, 29, 29, 0.18);
          color: #ff9b9b;
          font-size: 13px;
          line-height: 1.4;
        }

        /* BOTÃO */

        .login-button {
          width: 100%;
          height: 52px;
          margin-top: 3px;
          border: none;
          border-radius: 13px;
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
            0 0 25px rgba(43, 167, 255, 0.35);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 14px rgba(85, 211, 255, 1),
            0 0 32px rgba(43, 167, 255, 0.6);
        }

        .login-button:active {
          transform: scale(0.98);
        }

        .login-button:disabled {
          cursor: wait;
          opacity: 0.65;
          transform: none;
        }

        /* CADASTRO */

        .register {
          margin: 25px 0 0;
          padding-top: 22px;
          border-top: 1px solid rgba(100, 180, 255, 0.16);
          text-align: center;
          color: #9eacbd;
          font-size: 14px;
        }

        .register a {
          color: #68d2ff;
          font-weight: 700;
          text-decoration: none;
          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .register a:hover {
          color: #9be4ff;
          text-shadow: 0 0 10px rgba(75, 199, 255, 0.8);
        }

        /* RODAPÉ */

        .footer-text {
          margin-top: 24px;
          text-align: center;
          color: #718397;
          font-size: 12px;
        }

        /* MOBILE */

        @media (max-width: 520px) {
          .login-page {
            padding: 24px 16px;
          }

          .brand {
            margin-bottom: 22px;
          }

          .brand-icon {
            font-size: 42px;
          }

          .brand-name {
            font-size: 23px;
          }

          .login-card {
            padding: 27px 21px;
            border-radius: 20px;
          }

          .card-header h1 {
            font-size: 25px;
          }

          .card-header p {
            font-size: 14px;
          }
        }

        @media (max-width: 360px) {
          .login-page {
            padding: 20px 12px;
          }

          .login-card {
            padding: 24px 17px;
          }

          .brand-name {
            font-size: 21px;
          }
        }
      `}</style>

      <main className="login-page">
        <div className="login-container">

          {/* LOGO */}

          <div className="brand">
            <span className="brand-icon">✨</span>

            <h2 className="brand-name">
              CIEL IA STUDIO
            </h2>

            <p className="brand-subtitle">
              Crie. Transforme. Inove com IA.
            </p>
          </div>

          {/* CARD DE LOGIN */}

          <section className="login-card">

            <div className="card-header">
              <h1>
                Bem-vindo de volta
              </h1>

              <p>
                Entre na sua conta para continuar
                criando.
              </p>
            </div>

            <form onSubmit={handleLogin}>

              {/* E-MAIL */}

              <div className="form-group">
                <label className="form-label">
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
                  autoComplete="email"
                  required
                />
              </div>

              {/* SENHA */}

              <div className="form-group">
                <label className="form-label">
                  Senha
                </label>

                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* ERRO */}

              {error && (
                <p className="error">
                  {error}
                </p>
              )}

              {/* ENTRAR */}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Entrando..."
                  : "Entrar no CIEL IA STUDIO"}
              </button>

            </form>

            {/* CADASTRO */}

            <p className="register">
              Ainda não tem uma conta?{" "}

              <a href="/cadastro">
                Criar conta
              </a>
            </p>

          </section>

          <p className="footer-text">
            © 2026 CIEL IA STUDIO. Todos os direitos
            reservados.
          </p>

        </div>
      </main>
    </>
  );
}
