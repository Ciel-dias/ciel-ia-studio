"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Tool = {
  title: string;
  icon: string;
  description: string;
};

const tools: Tool[] = [
  {
    title: "Criar Prompts",
    icon: "✨",
    description: "Crie e aperfeiçoe prompts para suas criações.",
  },
  {
    title: "Texto → Imagem",
    icon: "📝",
    description: "Transforme suas ideias em imagens com IA.",
  },
  {
    title: "Texto → Vídeo",
    icon: "🎬",
    description: "Transforme suas ideias em vídeos com IA.",
  },
  {
    title: "Imagem → Imagem",
    icon: "🖼️",
    description: "Transforme suas imagens com IA.",
  },
  {
    title: "Imagem → Vídeo",
    icon: "🎞️",
    description: "Dê vida às suas imagens com IA.",
  },
  {
    title: "Meus Projetos",
    icon: "📁",
    description: "Acesse e gerencie suas criações.",
  },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

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
      <>
        <style>{`
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
            background: #0b0b0f;
          }
        `}</style>

        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0b0b0f",
            color: "#ffffff",
          }}
        >
          Carregando...
        </main>
      </>
    );
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          background: #0b0b0f;
        }

        body {
          overflow-x: hidden;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 48px;
        }

        .top-menu {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex-wrap: wrap;
        }

        .top-menu a,
        .top-menu button {
          white-space: nowrap;
        }

        .cards-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .dashboard-card {
          width: 100%;
          min-width: 0;
          min-height: 260px;
          padding: 24px;
          border-radius: 18px;
          background: #15151c;
          border: 1px solid #292936;
          overflow: hidden;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .dashboard-card:hover {
          border-color: #60a5fa;
          background: #191923;
          transform: translateY(-3px);
          box-shadow: 0 0 18px rgba(96, 165, 250, 0.18);
        }

        .dashboard-card:active {
          transform: scale(0.98);
          border-color: #60a5fa;
        }

        .card-description {
          color: #a1a1aa;
          line-height: 1.5;
        }

        /* TABLET */
        @media (max-width: 1024px) {
          .cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        /* CELULAR EM PÉ */
        @media (max-width: 599px) and (orientation: portrait) {
          .dashboard-container {
            padding: 20px 16px !important;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 32px;
          }

          .top-menu {
            width: 100%;
            justify-content: flex-start;
            gap: 8px;
          }

          .top-menu a,
          .top-menu button {
            padding: 9px 12px !important;
            font-size: 13px !important;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .dashboard-card {
            min-height: 230px;
            padding: 24px;
          }
        }

        /* CELULAR DEITADO */
        @media (max-width: 900px) and (orientation: landscape) {
          .dashboard-container {
            padding: 24px !important;
          }

          .cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .dashboard-card {
            min-height: 240px;
          }
        }

        /* JANELA DA FERRAMENTA */
        .tool-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(5px);
        }

        .tool-modal {
          width: 100%;
          max-width: 500px;
          padding: 30px;
          border-radius: 20px;
          background: #15151c;
          border: 1px solid #363642;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
          text-align: center;
        }

        .tool-modal-icon {
          font-size: 48px;
          margin-bottom: 14px;
        }

        .tool-modal-title {
          margin: 0 0 12px;
          font-size: 24px;
          color: #ffffff;
        }

        .tool-modal-text {
          margin: 0;
          color: #a1a1aa;
          line-height: 1.6;
        }

        .tool-modal-button {
          margin-top: 24px;
          padding: 12px 24px;
          border: 1px solid #363642;
          border-radius: 10px;
          background: #ffffff;
          color: #000000;
          font-weight: 600;
          cursor: pointer;
        }

        .tool-modal-button:hover {
          background: #e4e4e7;
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          width: "100%",
          maxWidth: "100%",
          background: "#0b0b0f",
          color: "#ffffff",
          padding: "32px",
          overflowX: "hidden",
        }}
      >
        <div
          className="dashboard-container"
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* CABEÇALHO */}
          <header className="dashboard-header">
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                CIEL IA STUDIO
              </h1>

              <p
                style={{
                  color: "#a1a1aa",
                  marginTop: "6px",
                  marginBottom: 0,
                }}
              >
                Seu estúdio de criação com inteligência artificial.
              </p>
            </div>

            {/* MENU SUPERIOR */}
            <div className="top-menu">
              <a
                href="/conta"
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #363642",
                  background: "#15151c",
                  color: "#ffffff",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Minha Conta
              </a>

              <a
                href="/projetos"
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #363642",
                  background: "#15151c",
                  color: "#ffffff",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Meus Projetos
              </a>

              <a
                href="/creditos"
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #363642",
                  background: "#15151c",
                  color: "#ffffff",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Créditos
              </a>

              <a
                href="/configuracoes"
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #363642",
                  background: "#15151c",
                  color: "#ffffff",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Configurações
              </a>

              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid #363642",
                  background: "#15151c",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                Sair
              </button>
            </div>
          </header>

          {/* USUÁRIO */}
          <section>
            <div
              style={{
                padding: "28px",
                borderRadius: "20px",
                background: "#15151c",
                border: "1px solid #292936",
                marginBottom: "24px",
              }}
            >
              <p
                style={{
                  color: "#a1a1aa",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                Usuário conectado
              </p>

              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  marginBottom: "6px",
                  wordBreak: "break-word",
                }}
              >
                {nome || "Usuário"}
              </h2>

              <p
                style={{
                  color: "#a1a1aa",
                  fontSize: "14px",
                  wordBreak: "break-word",
                  margin: 0,
                }}
              >
                {email}
              </p>
            </div>

            {/* 6 CARDS */}
            <div className="cards-grid">
              {tools.map((tool) => (
                <div
                  key={tool.title}
                  className="dashboard-card"
                  onClick={() => setSelectedTool(tool)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      setSelectedTool(tool);
                    }
                  }}
                >
                  <div
                    style={{
                      fontSize: "42px",
                      marginBottom: "18px",
                    }}
                  >
                    {tool.icon}
                  </div>

                  <h3
                    style={{
                      fontSize: "20px",
                      marginBottom: "10px",
                      marginTop: 0,
                    }}
                  >
                    {tool.title}
                  </h3>

                  <p className="card-description">
                    {tool.description}
                  </p>

                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "24px",
                      color: "#60a5fa",
                      fontWeight: 600,
                    }}
                  >
                    Abrir →
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* JANELA AO CLICAR NO CARD */}
      {selectedTool && (
        <div
          className="tool-overlay"
          onClick={() => setSelectedTool(null)}
        >
          <div
            className="tool-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="tool-modal-icon">
              {selectedTool.icon}
            </div>

            <h2 className="tool-modal-title">
              {selectedTool.title}
            </h2>

            <p className="tool-modal-text">
              Esta ferramenta fará parte do CIEL IA STUDIO.
              <br />
              Estamos preparando essa área para você.
            </p>

            <button
              className="tool-modal-button"
              onClick={() => setSelectedTool(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
