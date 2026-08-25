"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Card = {
  icon: string;
  title: string;
  description: string;
  href?: string;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");

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
          background: "#0b0b0f",
          color: "#ffffff",
          fontSize: "18px",
        }}
      >
        Carregando...
      </main>
    );
  }

  const cards: Card[] = [
    {
      icon: "✨",
      title: "Criar Prompts",
      description: "Crie e aperfeiçoe prompts para suas criações.",
      href: "/criar-prompts",
    },
    {
      icon: "📝",
      title: "Texto → Imagem",
      description: "Transforme suas ideias em imagens com IA.",
      href: "/texto-imagem",
    },
    {
      icon: "🎥",
      title: "Texto → Vídeo",
      description: "Transforme suas ideias em vídeos com IA.",
      href: "/texto-video",
    },
    {
      icon: "🖼️",
      title: "Imagem → Imagem",
      description: "Transforme e recrie suas imagens com IA.",
      href: "/imagem-imagem",
    },
    {
      icon: "🎬",
      title: "Imagem → Vídeo",
      description: "Dê vida às suas imagens com IA.",
      href: "/imagem-video",
    },
    {
      icon: "📁",
      title: "Meus Projetos",
      description: "Acesse e organize todas as suas criações.",
      href: "/projetos",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0f",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* BARRA SUPERIOR */}
      <header
        style={{
          width: "100%",
          borderBottom: "1px solid #292936",
          background: "#0f0f14",
          padding: "18px 32px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* LOGO */}
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              CIEL IA STUDIO
            </h1>

            <p
              style={{
                margin: "4px 0 0",
                color: "#a1a1aa",
                fontSize: "13px",
              }}
            >
              Seu estúdio de criação com inteligência artificial.
            </p>
          </div>

          {/* MENU */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/conta"
              style={navLinkStyle}
            >
              Minha Conta
            </a>

            <a
              href="/projetos"
              style={navLinkStyle}
            >
              Meus Projetos
            </a>

            <a
              href="/creditos"
              style={navLinkStyle}
            >
              Créditos
            </a>

            <a
              href="/configuracoes"
              style={navLinkStyle}
            >
              Configurações
            </a>

            <button
              onClick={handleLogout}
              style={{
                ...navLinkStyle,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <section
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 32px 80px",
          flex: 1,
        }}
      >
        {/* TÍTULO */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "42px",
          }}
        >
          <p
            style={{
              color: "#a1a1aa",
              marginBottom: "10px",
              fontSize: "14px",
            }}
          >
            Bem-vindo{nome ? `, ${nome}` : ""}
          </p>

          <h2
            style={{
              margin: 0,
              fontSize: "38px",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            O que você quer criar hoje?
          </h2>

          <p
            style={{
              color: "#a1a1aa",
              marginTop: "12px",
              fontSize: "16px",
            }}
          >
            Crie imagens, vídeos e prompts com inteligência artificial.
          </p>
        </div>

        {/* CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "22px",
          }}
        >
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              style={{
                textDecoration: "none",
                color: "#ffffff",
                display: "block",
              }}
            >
              <div
                style={{
                  minHeight: "210px",
                  padding: "28px",
                  borderRadius: "20px",
                  background: "#15151c",
                  border: "1px solid #292936",
                  transition:
                    "transform 0.2s ease, border-color 0.2s ease, background 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "34px",
                      marginBottom: "18px",
                    }}
                  >
                    {card.icon}
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: "21px",
                      fontWeight: 600,
                    }}
                  >
                    {card.title}
                  </h3>

                  <p
                    style={{
                      color: "#a1a1aa",
                      marginTop: "10px",
                      lineHeight: 1.5,
                      fontSize: "14px",
                    }}
                  >
                    {card.description}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "22px",
                    color: "#60a5fa",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Abrir →
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* INFORMAÇÃO DA CONTA */}
        <div
          style={{
            marginTop: "36px",
            padding: "22px",
            borderRadius: "18px",
            background: "#15151c",
            border: "1px solid #292936",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#a1a1aa",
              fontSize: "13px",
            }}
          >
            Conta conectada
          </p>

          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              wordBreak: "break-word",
            }}
          >
            {email}
          </p>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer
        style={{
          borderTop: "1px solid #292936",
          background: "#0f0f14",
          padding: "42px 32px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "40px",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "20px",
              }}
            >
              CIEL IA STUDIO
            </h3>

            <p
              style={{
                color: "#a1a1aa",
                marginTop: "10px",
                lineHeight: 1.5,
                fontSize: "14px",
              }}
            >
              Crie. Transforme. Inove com inteligência artificial.
            </p>
          </div>

          <div>
            <h4 style={footerTitleStyle}>Produto</h4>

            <p style={footerTextStyle}>Criar Prompts</p>
            <p style={footerTextStyle}>Texto → Imagem</p>
            <p style={footerTextStyle}>Texto → Vídeo</p>
            <p style={footerTextStyle}>Imagem → Imagem</p>
            <p style={footerTextStyle}>Imagem → Vídeo</p>
          </div>

          <div>
            <h4 style={footerTitleStyle}>Suporte</h4>

            <p style={footerTextStyle}>Ajuda</p>
            <p style={footerTextStyle}>FAQ</p>
            <p style={footerTextStyle}>Contato</p>
          </div>

          <div>
            <h4 style={footerTitleStyle}>Legal</h4>

            <p style={footerTextStyle}>Termos de Uso</p>
            <p style={footerTextStyle}>Política de Privacidade</p>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "32px auto 0",
            paddingTop: "20px",
            borderTop: "1px solid #292936",
            textAlign: "center",
            color: "#71717a",
            fontSize: "13px",
          }}
        >
          © 2026 CIEL IA STUDIO. Todos os direitos reservados.
        </div>
      </footer>
    </main>
  );
}

const navLinkStyle = {
  padding: "9px 12px",
  borderRadius: "9px",
  border: "1px solid #292936",
  background: "#15151c",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: "13px",
};

const footerTitleStyle = {
  margin: "0 0 14px",
  fontSize: "14px",
  fontWeight: 600,
};

const footerTextStyle = {
  margin: "8px 0",
  color: "#a1a1aa",
  fontSize: "13px",
};
