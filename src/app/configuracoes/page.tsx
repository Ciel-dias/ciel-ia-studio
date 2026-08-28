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
background:
theme === "dark"
? "#07111f"
: "#eef8ff",
color:
theme === "dark"
? "#ffffff"
: "#101827",
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
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
    }

    a {
      -webkit-tap-highlight-color: transparent;
    }

    .settings-page {
      min-height: 100vh;
      padding: 40px 20px 60px;

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
    }

    .settings-container {
      width: min(700px, 100%);
      margin: 0 auto;
    }

    .back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 30px;

      color: ${dark ? "#aebaca" : "#536577"};

      text-decoration: none;
      font-size: 14px;

      transition: color 0.2s ease;
    }

    .back:hover {
      color: #159ddd;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0 0 8px;
      font-size: 34px;
      font-weight: 700;
    }

    .header p {
      margin: 0;

      color: ${dark ? "#aebaca" : "#536579"};

      font-size: 16px;
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

      border: 1px solid
        ${dark
          ? "rgba(88, 201, 255, 0.35)"
          : "rgba(59, 184, 237, 0.35)"};

      box-shadow:
        0 0 15px
          ${dark
            ? "rgba(43, 167, 255, 0.16)"
            : "rgba(43, 167, 255, 0.10)"};

      transition:
        background 0.35s ease,
        border-color 0.35s ease;
    }

    .section h2 {
      margin: 0 0 20px;

      font-size: 20px;
      font-weight: 700;
    }

    .info {
      margin-bottom: 18px;
    }

    .info:last-child {
      margin-bottom: 0;
    }

    .label {
      margin: 0 0 6px;

      color: ${dark ? "#8f9eaf" : "#637587"};

      font-size: 13px;
    }

    .value {
      margin: 0;

      color: ${dark ? "#ffffff" : "#142132"};

      font-size: 16px;

      word-break: break-word;
    }

    .theme-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .theme-option {
      min-height: 90px;

      padding: 18px;

      border-radius: 14px;

      border: 2px solid
        ${dark
          ? "rgba(100, 180, 255, 0.20)"
          : "rgba(40, 110, 160, 0.20)"};

      background:
        ${dark
          ? "rgba(8, 20, 34, 0.75)"
          : "rgba(255, 255, 255, 0.65)"};

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
          ${dark
            ? "rgba(21, 157, 221, 0.35)"
            : "rgba(21, 157, 221, 0.20)"};
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

    .security-text {
      margin: 0;

      color: ${dark ? "#aebaca" : "#5d7082"};

      font-size: 14px;
      line-height: 1.5;
    }

    .logout-button {
      width: 100%;

      padding: 14px;

      border-radius: 12px;

      border: 1px solid
        ${dark
          ? "rgba(100, 180, 255, 0.25)"
          : "rgba(40, 110, 160, 0.25)"};

      background:
        ${dark
          ? "rgba(5, 16, 30, 0.65)"
          : "rgba(255, 255, 255, 0.65)"};

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

    @media (max-width: 600px) {
      .settings-page {
        padding: 28px 16px 45px;
      }

      .header h1 {
        font-size: 30px;
      }

      .section {
        padding: 21px;
      }

      .theme-options {
        grid-template-columns: 1fr;
      }
    }
  `}</style>

  <main className="settings-page">
    <div className="settings-container">

      <Link href="/dashboard" className="back">
        ← Voltar para o dashboard
      </Link>

      <header className="header">
        <h1>Configurações</h1>

        <p>
          Gerencie sua conta e personalize o CIEL IA STUDIO.
        </p>
      </header>

      <section className="section">
        <h2>Sua conta</h2>

        <div className="info">
          <p className="label">Nome</p>

          <p className="value">
            {nome || "Não informado"}
          </p>
        </div>

        <div className="info">
          <p className="label">E-mail</p>

          <p className="value">
            {email}
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Aparência</h2>

        <div className="theme-options">

          <button
            type="button"
            className={`theme-option ${
              theme === "dark" ? "active" : ""
            }`}
            onClick={() => setTheme("dark")}
          >
            <div className="theme-icon">🌙</div>

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
              theme === "light" ? "active" : ""
            }`}
            onClick={() => setTheme("light")}
          >
            <div className="theme-icon">☀️</div>

            <span className="theme-title">
              Tema claro
            </span>

            <span className="theme-description">
              Visual claro e moderno
            </span>
          </button>

        </div>
      </section>

      <section className="section">
        <h2>Segurança</h2>

        <p className="security-text">
          Em breve você poderá alterar sua senha e
          gerenciar outras opções de segurança.
        </p>
      </section>

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
