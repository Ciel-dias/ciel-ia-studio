"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Theme = "dark" | "light";

export default function DashboardPage() {
const [loading, setLoading] = useState(true);
const [theme, setTheme] = useState<Theme>("dark");

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

  const savedTheme = localStorage.getItem("ciel-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    setTheme(savedTheme);
  }

  setLoading(false);
}

loadUser();

}, []);

useEffect(() => {
if (!loading) {
localStorage.setItem("ciel-theme", theme);

  document.documentElement.setAttribute(
    "data-theme",
    theme
  );

  document.body.setAttribute(
    "data-theme",
    theme
  );
}

}, [theme, loading]);

function toggleTheme() {
setTheme((current) =>
current === "dark" ? "light" : "dark"
);
}

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
background: "#07111f",
color: "#ffffff",
fontFamily: "Arial, sans-serif",
}}
>
Carregando...
</main>
);
}

const cards = [
{
icon: "✨",
title: "CRIAR PROMPTS",
description: "Crie e melhore ideias em imagens",
href: "/criar-prompts",
},
{
icon: "📝",
title: "TEXTO → IMAGEM",
description: "Transforme suas ideias em imagens",
href: "/texto-imagem",
},
{
icon: "🎥",
title: "TEXTO → VÍDEO",
description: "Transforme suas ideias em vídeos",
href: "/texto-video",
},
{
icon: "🖼️",
title: "IMAGEM → IMAGEM",
description: "Transforme suas imagens com IA",
href: "/imagem-imagem",
},
{
icon: "🎬",
title: "IMAGEM → VÍDEO",
description: "Dê vida às suas imagens com IA",
href: "/imagem-video",
},
{
icon: "📁",
title: "MEUS PROJETOS",
description: "Acesse suas criações",
href: "/projetos",
},
];

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

    .dashboard-page {
      min-height: 100vh;

      color: ${theme === "dark" ? "#ffffff" : "#101827"};

      background:
        ${
          theme === "dark"
            ? `
              radial-gradient(
                circle at 75% 20%,
                rgba(20, 119, 190, 0.42),
                transparent 38%
              ),
              radial-gradient(
                circle at 15% 65%,
                rgba(15, 76, 125, 0.32),
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

      overflow-x: hidden;

      transition:
        background 0.35s ease,
        color 0.35s ease;
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
        theme === "dark"
          ? "rgba(4, 12, 24, 0.88)"
          : "rgba(255, 255, 255, 0.88)"
      };

      border-bottom: 1px solid ${
        theme === "dark"
          ? "rgba(100, 180, 255, 0.18)"
          : "rgba(40, 110, 160, 0.18)"
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
    }

    .brand-name {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.4px;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: 25px;
    }

    .nav a,
    .nav button {
      color: ${
        theme === "dark"
          ? "#e8eef7"
          : "#172333"
      };

      background: transparent;
      border: none;

      text-decoration: none;

      font-size: 15px;
      cursor: pointer;

      transition:
        color 0.2s ease,
        text-shadow 0.2s ease;

      white-space: nowrap;
    }

    .nav a:hover,
    .nav button:hover {
      color: #159ddd;

      text-shadow:
        0 0 12px
        rgba(75, 199, 255, 0.6);
    }

    .theme-button {
      width: 38px;
      height: 38px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      border: 1px solid ${
        theme === "dark"
          ? "rgba(104, 207, 255, 0.45)"
          : "rgba(30, 130, 190, 0.35)"
      } !important;

      background: ${
        theme === "dark"
          ? "rgba(20, 100, 150, 0.18)"
          : "rgba(255, 255, 255, 0.7)"
      } !important;

      font-size: 19px !important;

      box-shadow: ${
        theme === "dark"
          ? "0 0 12px rgba(70, 199, 255, 0.22)"
          : "0 0 12px rgba(70, 160, 220, 0.18)"
      };

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
    }

    .theme-button:hover {
      transform: scale(1.08);
    }

    /* =========================
       HERO
    ========================= */

    .hero {
      text-align: center;
      padding: 68px 20px 46px;
    }

    .hero h1 {
      margin: 0 auto;

      max-width: 720px;

      font-size: clamp(34px, 5vw, 58px);
      line-height: 1.12;

      font-weight: 700;
      letter-spacing: 0.5px;

      text-transform: uppercase;
    }

    .hero p {
      margin: 20px auto 0;

      color: ${
        theme === "dark"
          ? "#b9c5d4"
          : "#536579"
      };

      font-size: clamp(17px, 2vw, 22px);

      max-width: 650px;
    }

    /* =========================
       CARDS
    ========================= */

    .cards-container {
      width: min(
        1180px,
        calc(100% - 48px)
      );

      margin: 0 auto;

      display: grid;

      grid-template-columns:
        repeat(3, minmax(0, 1fr));

      gap: 28px;

      padding-bottom: 76px;
    }

    .card {
      min-width: 0;
      min-height: 260px;

      display: flex;
      flex-direction: column;

      justify-content: space-between;
      align-items: center;

      text-align: center;

      padding: 32px 24px;

      border-radius: 22px;

      text-decoration: none;

      border: 2px solid;

      transition:
        transform 0.22s ease,
        box-shadow 0.22s ease,
        background 0.35s ease,
        color 0.35s ease,
        border-color 0.35s ease;
    }

    .card-dark {
      color: #ffffff;

      background: linear-gradient(
        145deg,
        rgba(35, 47, 65, 0.96),
        rgba(14, 25, 40, 0.98)
      );

      border-color: #58c9ff;

      box-shadow:
        0 0 8px
          rgba(70, 199, 255, 0.9),
        0 0 22px
          rgba(43, 167, 255, 0.48),
        inset 0 0 22px
          rgba(56, 174, 255, 0.08);
    }

    .card-dark:hover {
      background: linear-gradient(
        145deg,
        rgba(42, 65, 89, 0.98),
        rgba(15, 31, 50, 0.98)
      );

      box-shadow:
        0 0 12px
          rgba(85, 211, 255, 1),
        0 0 32px
          rgba(43, 167, 255, 0.7),
        inset 0 0 25px
          rgba(56, 174, 255, 0.12);
    }

    .card-light {
      color: #142132;

      background: linear-gradient(
        145deg,
        #ffffff,
        #e1f1fb
      );

      border-color: #3bb8ed;

      box-shadow:
        0 0 8px
          rgba(70, 180, 235, 0.45),
        0 0 22px
          rgba(43, 167, 255, 0.2),
        inset 0 0 22px
          rgba(56, 174, 255, 0.04);
    }

    .card-light:hover {
      background: linear-gradient(
        145deg,
        #ffffff,
        #d6edf9
      );

      box-shadow:
        0 0 12px
          rgba(55, 180, 235, 0.65),
        0 0 32px
          rgba(43, 167, 255, 0.3),
        inset 0 0 25px
          rgba(56, 174, 255, 0.06);
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .card:active {
      transform: scale(0.98);
    }

    .card-icon {
      font-size: 50px;
      line-height: 1;
      margin-bottom: 18px;
    }

    .card-title {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.25;
      margin: 0;
    }

    .card-description {
      font-size: 15px;
      line-height: 1.45;
      margin: 12px 0 0;
      max-width: 230px;
    }

    .card-dark .card-description {
      color: #c0cad6;
    }

    .card-light .card-description {
      color: #58697a;
    }

    .card-arrow {
      margin-top: 22px;
      font-size: 15px;
      font-weight: 700;
    }

    .card-dark .card-arrow {
      color: #42c5ff;
    }

    .card-light .card-arrow {
      color: #159ddd;
    }

    /* =========================
       FOOTER
    ========================= */

    .footer {
      border-top: 1px solid ${
        theme === "dark"
          ? "rgba(100, 180, 255, 0.18)"
          : "rgba(40, 110, 160, 0.18)"
      };

      background:
        ${
          theme === "dark"
            ? `
              linear-gradient(
                180deg,
                rgba(4, 15, 29, 0.96),
                rgba(3, 11, 22, 1)
              )
            `
            : `
              linear-gradient(
                180deg,
                rgba(239, 248, 253, 0.98),
                rgba(218, 237, 247, 1)
              )
            `
        };

      padding:
        52px 42px 24px;
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

      color: ${
        theme === "dark"
          ? "#9eacbd"
          : "#5d7082"
      };

      font-size: 15px;
    }

    .footer-columns {
      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

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

      color: ${
        theme === "dark"
          ? "#aebaca"
          : "#536577"
      };

      text-decoration: none;

      font-size: 14px;
    }

    .footer-column a:hover {
      color: #159ddd;
    }

    .footer-bottom {
      margin-top: 36px;

      padding-top: 22px;

      border-top: 1px solid ${
        theme === "dark"
          ? "rgba(100, 180, 255, 0.16)"
          : "rgba(40, 110, 160, 0.16)"
      };

      text-align: center;

      color: ${
        theme === "dark"
          ? "#8997a9"
          : "#65788a"
      };

      font-size: 13px;
    }

    /* =========================
       TABLET
    ========================= */

    @media (max-width: 900px) {
      .topbar {
        padding: 0 24px;
      }

      .nav {
        gap: 16px;
      }

      .nav a,
      .nav button {
        font-size: 14px;
      }

      .cards-container {
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 24px;
      }
    }

    /* =========================
       MOBILE
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

      .nav {
        gap: 10px;
      }

      .nav a,
      .nav button {
        font-size: 12px;
      }

      .theme-button {
        width: 34px;
        height: 34px;
        font-size: 17px !important;
      }

      .hero {
        padding: 48px 18px 36px;
      }

      .cards-container {
        width:
          min(
            430px,
            calc(100% - 32px)
          );

        grid-template-columns: 1fr;

        gap: 20px;

        padding-bottom: 55px;
      }

      .card {
        min-height: 230px;
        padding: 30px 22px;
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

      .nav {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px 16px;
      }

      .hero h1 {
        font-size: 34px;
      }

      .hero p {
        font-size: 16px;
      }

      .card {
        min-height: 240px;
      }

      .card-title {
        font-size: 21px;
      }

      .card-description {
        font-size: 16px;
      }
    }
  `}</style>

  <div className="dashboard-page">

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

      <nav className="nav">

        {/* CORRIGIDO:
            Minha Conta agora aponta para
            /minha-conta
        */}

        <Link href="/minha-conta">
          Minha Conta
        </Link>

        <Link href="/projetos">
          Meus Projetos
        </Link>

        <Link href="/creditos">
          Créditos
        </Link>

        <Link href="/configuracoes">
          Configurações
        </Link>

        <button
          className="theme-button"
          onClick={toggleTheme}
          title={
            theme === "dark"
              ? "Mudar para tema claro"
              : "Mudar para tema escuro"
          }
          aria-label={
            theme === "dark"
              ? "Mudar para tema claro"
              : "Mudar para tema escuro"
          }
        >
          {theme === "dark"
            ? "☀️"
            : "🌙"}
        </button>

        <button onClick={handleLogout}>
          Sair
        </button>

      </nav>

    </header>

    {/* =========================
        HERO
    ========================= */}

    <section className="hero">

      <h1>
        O QUE VOCÊ QUER CRIAR HOJE?
      </h1>

      <p>
        Crie imagens, vídeos e prompts com IA.
      </p>

    </section>

    {/* =========================
        6 CARDS
    ========================= */}

    <section className="cards-container">

      {cards.map((card) => (

        <Link
          key={card.title}
          href={card.href}
          className={`card ${
            theme === "dark"
              ? "card-dark"
              : "card-light"
          }`}
        >

          <div>

            <div className="card-icon">
              {card.icon}
            </div>

            <h2 className="card-title">
              {card.title}
            </h2>

            <p className="card-description">
              {card.description}
            </p>

          </div>

          <span className="card-arrow">
            Abrir →
          </span>

        </Link>

      ))}

    </section>

    {/* =========================
        FOOTER
    ========================= */}

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

          </div>

        </div>

        <div className="footer-bottom">

          © 2026 CIEL IA STUDIO.
          Todos os direitos reservados.

        </div>

      </div>

    </footer>

  </div>
</>

);
}
