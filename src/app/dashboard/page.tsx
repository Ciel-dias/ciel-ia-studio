"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

              {/* 1 */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  ✨ Criar Prompts
                </h3>

                <p
                  style={{
                    color: "#a1a1aa",
                    lineHeight: 1.5,
                  }}
                >
                  Crie e aperfeiçoe prompts para suas criações.
                </p>

                <a
                  href="#"
                  style={{
                    display: "inline-block",
                    marginTop: "24px",
                    color: "#60a5fa",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Abrir →
                </a>
              </div>

              {/* 2 */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  📝 Texto → Imagem
                </h3>

                <p
                  style={{
                    color: "#a1a1aa",
                    lineHeight: 1.5,
                  }}
                >
                  Transforme suas ideias em imagens com IA.
                </p>

                <a
                  href="#"
                  style={{
                    display: "inline-block",
                    marginTop: "24px",
                    color: "#60a5fa",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Abrir →
                </a>
              </div>

              {/* 3 */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  🎬 Texto → Vídeo
                </h3>

                <p
                  style={{
                    color: "#a1a1aa",
                    lineHeight: 1.5,
                  }}
                >
                  Transforme suas ideias em vídeos com IA.
                </p>

                <a
                  href="#"
                  style={{
                    display: "inline-block",
                    marginTop: "24px",
                    color: "#60a5fa",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Abrir →
                </a>
              </div>

              {/* 4 */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  🖼️ Imagem → Imagem
                </h3>

                <p
                  style={{
                    color: "#a1a1aa",
                    lineHeight: 1.5,
                  }}
                >
                  Transforme suas imagens com IA.
                </p>

                <a
                  href="#"
                  style={{
                    display: "inline-block",
                    marginTop: "24px",
                    color: "#60a5fa",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Abrir →
                </a>
              </div>

              {/* 5 */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  🎞️ Imagem → Vídeo
                </h3>

                <p
                  style={{
                    color: "#a1a1aa",
                    lineHeight: 1.5,
                  }}
                >
                  Dê vida às suas imagens com IA.
                </p>

                <a
                  href="#"
                  style={{
                    display: "inline-block",
                    marginTop: "24px",
                    color: "#60a5fa",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Abrir →
                </a>
              </div>

              {/* 6 */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    marginBottom: "10px",
                  }}
                >
                  📁 Meus Projetos
                </h3>

                <p
                  style={{
                    color: "#a1a1aa",
                    lineHeight: 1.5,
                  }}
                >
                  Acesse e gerencie suas criações.
                </p>

                <a
                  href="#"
                  style={{
                    display: "inline-block",
                    marginTop: "24px",
                    color: "#60a5fa",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Abrir →
                </a>
              </div>

            </div>
          </section>
        </div>
      </main>
    </>
  );
}
