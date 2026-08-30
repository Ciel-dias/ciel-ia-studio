"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/ThemeProvider";

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setEmail(user.email ?? "");
      setNome(user.user_metadata?.nome ?? "");

      setLoading(false);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme === "dark" ? "#07111f" : "#eef8ff",
          color: theme === "dark" ? "#ffffff" : "#101827",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        Carregando...
      </main>
    );
  }

  const dark = theme === "dark";

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
          min-height: 100%;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }

        .settings-page {
          min-height: 100vh;

          color: ${dark ? "#ffffff" : "#101827"};

          background:
            ${
              dark
                ? `
              radial-gradient(
                circle at 80% 10%,
                rgba(20, 119, 190, 0.35),
                transparent 38%
              ),
              radial-gradient(
                circle at 10% 70%,
                rgba(15, 76, 125, 0.25),
                transparent 40%
              ),
              linear-gradient(
                135deg,
                #06101e 0%,
                #081a30 48%,
                #0b3556 100%
              )
            `
                : `
              radial-gradient(
                circle at 80% 10%,
                rgba(91, 190, 255, 0.28),
                transparent 35%
              ),
              radial-gradient(
                circle at 10% 70%,
                rgba(80, 150, 220, 0.18),
                transparent 40%
              ),
              linear-gradient(
                135deg,
                #eef8ff 0%,
                #e6f3fc 48%,
                #d8edf9 100%
              )
            `
            };

          transition:
            background 0.35s ease,
            color 0.35s ease;

          overflow-x: hidden;
        }

        /* =========================
           CABEÇALHO
        ========================= */

        .topbar {
          width: 100%;
          min-height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          padding: 0 42px;

          background: ${
            dark
              ? "rgba(4, 12, 24, 0.88)"
              : "rgba(245, 251, 255, 0.90)"
          };

          border-bottom:
            1px solid
            ${
              dark
                ? "rgba(100, 180, 255, 0.18)"
                : "rgba(40, 130, 180, 0.18)"
            };

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
            0 0 9px rgba(75, 199, 255, 0.75)
          );
        }

        .brand-name {
          font-size: 20px;

          font-weight: 700;

          letter-spacing: 0.4px;

          color: ${dark ? "#ffffff" : "#102033"};
        }

        .back {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          color: ${dark ? "#e8eef7" : "#34485c"};

          text-decoration: none;

          font-size: 15px;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .back:hover {
          color: #159ddd;

          text-shadow:
            0 0 12px rgba(75, 199, 255, 0.7);
        }

        /* =========================
           CONTEÚDO
        ========================= */

        .settings-container {
          width: min(700px, calc(100% - 48px));

          margin: 0 auto;

          padding:
            55px 0 70px;
        }

        .header {
          margin-bottom: 30px;
        }

        .header h1 {
          margin:
            0 0 8px;

          font-size: 34px;

          font-weight: 700;
        }

        .header p {
          margin: 0;

          color: ${dark ? "#aebaca" : "#536579"};

          font-size: 16px;

          line-height: 1.5;
        }

        .section {
          margin-bottom: 20px;

          padding: 26px;

          border-radius: 20px;

          background:
            ${
              dark
                ? `
              linear-gradient(
                145deg,
                rgba(35, 47, 65, 0.94),
                rgba(14, 25, 40, 0.96)
              )
            `
                : `
              linear-gradient(
                145deg,
                rgba(255, 255, 255, 0.96),
                rgba(225, 241, 251, 0.96)
              )
            `
            };

          border:
            1px solid
            ${
              dark
                ? "rgba(88, 201, 255, 0.35)"
                : "rgba(59, 184, 237, 0.35)"
            };

          box-shadow:
            0 0 15px
            ${
              dark
                ? "rgba(43, 167, 255, 0.16)"
                : "rgba(43, 167, 255, 0.10)"
            };

          transition:
            background 0.35s ease,
            border-color 0.35s ease;
        }

        .section h2 {
          margin:
            0 0 20px;

          font-size: 20px;

          font-weight: 700;
        }

        /* =========================
           CONTA
        ========================= */

        .info {
          margin-bottom: 18px;
        }

        .info:last-child {
          margin-bottom: 0;
        }

        .label {
          margin:
            0 0 6px;

          color: ${dark ? "#8f9eaf" : "#637587"};

          font-size: 13px;
        }

        .value {
          margin: 0;

          color: ${dark ? "#ffffff" : "#142132"};

          font-size: 16px;

          word-break: break-word;
        }

        /* =========================
           TEMA
        ========================= */

        .theme-options {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 14px;
        }

        .theme-option {
          min-height: 90px;

          padding: 18px;

          border-radius: 14px;

          border:
            2px solid
            ${
              dark
                ? "rgba(100, 180, 255, 0.20)"
                : "rgba(40, 110, 160, 0.20)"
            };

          background:
            ${
              dark
                ? "rgba(8, 20, 34, 0.75)"
                : "rgba(255, 255, 255, 0.65)"
            };

          color: ${dark ? "#ffffff" : "#142132"};

          cursor: pointer;

          text-align: left;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .theme-option:hover {
          transform: translateY(-2px);

          border-color: #159ddd;
        }

        .theme-option.active {
          border-color: #159ddd;

          box-shadow:
            0 0 15px
            ${
              dark
                ? "rgba(21, 157, 221, 0.35)"
                : "rgba(21, 157, 221, 0.20)"
            };
        }

        .theme-icon {
          font-size: 25px;

          margin-bottom: 8px;
        }

        .theme-title {
          display: block;

          font-size: 15px;

          font-weight: 700;
        }

        .theme-description {
          display: block;

          margin-top: 4px;

          color: ${dark ? "#9eacbd" : "#607285"};

          font-size: 12px;
        }

        /* =========================
           SEGURANÇA
        ========================= */

        .security-text {
          margin:
            0 0 18px;

          color: ${dark ? "#aebaca" : "#5d7082"};

          font-size: 14px;

          line-height: 1.6;
        }

        .security-button {
          width: 100%;

          padding: 13px 15px;

          border-radius: 12px;

          border:
            1px solid
            ${
              dark
                ? "rgba(100, 180, 255, 0.25)"
                : "rgba(40, 110, 160, 0.25)"
            };

          background:
            ${
              dark
                ? "rgba(5, 16, 30, 0.65)"
                : "rgba(255, 255, 255, 0.65)"
            };

          color: ${dark ? "#ffffff" : "#142132"};

          font-size: 14px;

          font-weight: 600;

          cursor: not-allowed;

          opacity: 0.65;
        }

        /* =========================
           SAIR
        ========================= */

        .logout-button {
          width: 100%;

          padding: 14px;

          border-radius: 12px;

          border:
            1px solid
            ${
              dark
                ? "rgba(100, 180, 255, 0.25)"
                : "rgba(40, 110, 160, 0.25)"
            };

          background:
            ${
              dark
                ? "rgba(5, 16, 30, 0.65)"
                : "rgba(255, 255, 255, 0.65)"
            };

          color: ${dark ? "#ffffff" : "#142132"};

          font-size: 15px;

          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .logout-button:hover {
          color: #159ddd;

          border-color: #159ddd;
        }

        .dashboard-button {
          display: block;

          margin-top: 20px;

          text-align: center;

          color: ${dark ? "#aebaca" : "#536577"};

          text-decoration: none;

          font-size: 14px;

          transition: color 0.2s ease;
        }

        .dashboard-button:hover {
          color: #159ddd;
        }

        /* =========================
           CELULAR
        ========================= */

        @media (max-width: 650px) {
          .topbar {
            min-height: 68px;

            padding:
              14px 16px;
          }

          .brand {
            gap: 7px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .brand-name {
            font-size: 16px;
          }

          .back {
            font-size: 13px;
          }

          .settings-container {
            width:
              min(
                calc(100% - 32px),
                430px
              );

            padding:
              42px 0 55px;
          }

          .header h1 {
            font-size: 30px;
          }

          .header p {
            font-size: 15px;
          }

          .section {
            padding: 21px;
          }

          .theme-options {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 430px) {
          .topbar {
            gap: 10px;
          }

          .brand-name {
            font-size: 15px;
          }

          .back {
            font-size: 12px;
          }
        }
      `}</style>

      <main className="settings-page">

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
            className="back"
          >
            ← Voltar ao Dashboard
          </Link>

        </header>

        {/* =========================
            CONTEÚDO
        ========================= */}

        <div className="settings-container">

          <header className="header">

            <h1>
              Configurações
            </h1>

            <p>
              Gerencie sua conta e personalize o
              CIEL IA STUDIO.
            </p>

          </header>

          {/* =========================
              CONTA
          ========================= */}

          <section className="section">

            <h2>
              Sua conta
            </h2>

            <div className="info">

              <p className="label">
                Nome
              </p>

              <p className="value">
                {nome || "Não informado"}
              </p>

            </div>

            <div className="info">

              <p className="label">
                E-mail
              </p>

              <p className="value">
                {email}
              </p>

            </div>

          </section>

          {/* =========================
              APARÊNCIA
          ========================= */}

          <section className="section">

            <h2>
              Aparência
            </h2>

            <div className="theme-options">

              <button
                type="button"
                className={`theme-option ${
                  theme === "dark"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTheme("dark")
                }
              >

                <div className="theme-icon">
                  🌙
                </div>

                <span className="theme-title">
                  Tema escuro
                </span>

                <span className="theme-description">
                  Visual futurista escuro
                </span>

              </button>

              <button
                type="button"
                className={`theme-option ${
                  theme === "light"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTheme("light")
                }
              >

                <div className="theme-icon">
                  ☀️
                </div>

                <span className="theme-title">
                  Tema claro
                </span>

                <span className="theme-description">
                  Visual claro e moderno
                </span>

              </button>

            </div>

          </section>

          {/* =========================
              SEGURANÇA
          ========================= */}

          <section className="section">

            <h2>
              Segurança
            </h2>

            <p className="security-text">
              Mantenha sua conta protegida e
              acompanhe as opções de segurança
              disponíveis no CIEL IA STUDIO.
            </p>

            <button
              type="button"
              className="security-button"
              disabled
            >
              🔐 Alterar senha — Em breve
            </button>

          </section>

          {/* =========================
              SAIR
          ========================= */}

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Sair da conta
          </button>

          <Link
            href="/dashboard"
            className="dashboard-button"
          >
            Voltar para o dashboard
          </Link>

        </div>

      </main>
    </>
  );
}
