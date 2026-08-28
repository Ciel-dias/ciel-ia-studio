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

const isDark = theme === "dark";

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

    .settings-page {
      min-height: 100vh;
      padding: 32px 20px 60px;
      color: ${isDark ? "#ffffff" : "#101827"};
      background:
        ${
          isDark
            ? `
          radial-gradient(
            circle at 80% 10%,
            rgba(20, 119, 190, 0.38),
            transparent 35%
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

    .back-link {
      display: inline-block;
      margin-bottom: 28px;
      color: ${isDark ? "#aebaca" : "#536577"};
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: #159ddd;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px;
    }

    .page-description {
      color: ${isDark ? "#aebaca" : "#536577"};
      margin: 0 0 32px;
      line-height: 1.5;
    }

    .section {
      background: ${
        isDark
          ? "linear-gradient(145deg, rgba(21, 30, 44, 0.96), rgba(12, 21, 34, 0.96))"
          : "linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(225, 241, 251, 0.96))"
      };
      border: 1px solid ${
        isDark
          ? "rgba(88, 201, 255, 0.22)"
          : "rgba(59, 184, 237, 0.35)"
      };
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 0 20px rgba(43, 167, 255, 0.08);
      transition:
        background 0.35s ease,
        border-color 0.35s ease,
        color 0.35s ease;
    }

    .section-title {
      font-size: 20px;
      margin: 0 0 20px;
    }

    .info-item {
      margin-bottom: 18px;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .info-label {
      color: ${isDark ? "#8f9eaf" : "#617487"};
      font-size: 13px;
      margin: 0 0 6px;
    }

    .info-value {
      font-size: 16px;
      margin: 0;
      word-break: break-word;
    }

    .appearance-description {
      color: ${isDark ? "#aebaca" : "#536577"};
      font-size: 14px;
      line-height: 1.5;
      margin: -8px 0 20px;
    }

    .theme-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    .theme-option {
      min-height: 82px;
      border-radius: 14px;
      border: 2px solid ${
        isDark
          ? "rgba(104, 207, 255, 0.22)"
          : "rgba(30, 130, 190, 0.2)"
      };
      background: ${
        isDark
          ? "rgba(7, 17, 31, 0.72)"
          : "rgba(255, 255, 255, 0.75)"
      };
      color: ${isDark ? "#ffffff" : "#142132"};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 600;
      transition:
        border-color 0.2s ease,
        background 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }

    .theme-option:hover {
      transform: translateY(-2px);
      border-color: #3bb8ed;
    }

    .theme-option.active {
      border-color: #58c9ff;
      box-shadow:
        0 0 10px rgba(70, 199, 255, 0.45),
        0 0 24px rgba(43, 167, 255, 0.2);
    }

    .theme-icon {
      font-size: 25px;
    }

    .security-text {
      color: ${isDark ? "#aebaca" : "#536577"};
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }

    .logout-button {
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      border: 1px solid ${
        isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(30, 60, 90, 0.2)"
      };
      background: ${
        isDark
          ? "rgba(10, 18, 30, 0.6)"
          : "rgba(255, 255, 255, 0.72)"
      };
      color: ${isDark ? "#ffffff" : "#172333"};
      font-weight: 600;
      cursor: pointer;
      transition:
        background 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
    }

    .logout-button:hover {
      border-color: #159ddd;
      color: #159ddd;
    }

    @media (max-width: 600px) {
      .settings-page {
        padding: 24px 16px 50px;
      }

      .page-title {
        font-size: 28px;
      }

      .section {
        padding: 20px;
      }

      .theme-options {
        grid-template-columns: 1fr;
      }
    }
  `}</style>

  <main className="settings-page">
    <div className="settings-container">

      <Link href="/dashboard" className="back-link">
        ← Voltar para o dashboard
      </Link>

      <h1 className="page-title">
        Configurações
      </h1>

      <p className="page-description">
        Gerencie sua conta e personalize sua experiência no CIEL IA STUDIO.
      </p>

      <section className="section">
        <h2 className="section-title">
          Sua conta
        </h2>

        <div className="info-item">
          <p className="info-label">
            Nome
          </p>

          <p className="info-value">
            {nome || "Não informado"}
          </p>
        </div>

        <div className="info-item">
          <p className="info-label">
            E-mail
          </p>

          <p className="info-value">
            {email}
          </p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">
          Aparência
        </h2>

        <p className="appearance-description">
          Escolha como o CIEL IA STUDIO será exibido.
          Sua preferência é salva automaticamente.
        </p>

        <div className="theme-options">

          <button
            type="button"
            className={`theme-option ${
              theme === "light" ? "active" : ""
            }`}
            onClick={() => setTheme("light")}
          >
            <span className="theme-icon">
              ☀️
            </span>

            <span>
              Claro
            </span>
          </button>

          <button
            type="button"
            className={`theme-option ${
              theme === "dark" ? "active" : ""
            }`}
            onClick={() => setTheme("dark")}
          >
            <span className="theme-icon">
              🌙
            </span>

            <span>
              Escuro
            </span>
          </button>

        </div>
      </section>

      <section className="section">
        <h2 className="section-title">
          Segurança
        </h2>

        <p className="security-text">
          Em breve você poderá alterar sua senha e gerenciar outras
          opções de segurança.
        </p>
      </section>

      <button
        onClick={handleLogout}
        className="logout-button"
      >
        Sair da conta
      </button>

    </div>
  </main>
</>

);
}
