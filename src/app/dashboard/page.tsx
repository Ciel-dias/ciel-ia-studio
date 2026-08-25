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
          }
        `}</style>

        <main
          style={{
            minHeight: "100vh",
            width: "100%",
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
          font-family: Arial, Helvetica, sans-serif;
        }

        .dashboard-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px;
        }

        .dashboard-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          margin-bottom: 48px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-shrink: 0;
        }

        .cards-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .dashboard-card {
          min-width: 0;
          width: 100%;
          min-height: 260px;
          padding: 24px;
          border-radius: 18px;
          background: #15151c;
          border: 1px solid #292936;
          display: flex;
          flex-direction: column;
        }

        .card-description {
          color: #a1a1aa;
          line-height: 1.5;
          margin: 0;
        }

        .card-link {
          display: inline-block;
          margin-top: auto;
          padding-top: 24px;
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
        }

        /* TABLET */
        @media (max-width: 1024px) {
          .dashboard-container {
            padding: 28px;
          }

          .cards-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        /* CELULAR EM PÉ */
        @media (max-width: 599px) {
          .dashboard-container {
            padding: 20px 16px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 32px;
          }

          .header-actions {
            width: 100%;
            flex-wrap: wrap;
          }

          .header-actions a,
          .header-actions button {
            flex: 1;
          }

          .cards-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .dashboard-card {
            min-height: 230px;
            padding: 22px;
          }
        }

        /* CELULAR DEITADO */
        @media (max-width: 900px) and (orientation: landscape) {
          .dashboard-container {
            padding: 24px;
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
          background: "#0b0b0f",
          color: "#ffffff",
        }}
      >
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  margin: 0,
                  wordBreak: "break-word",
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

            <div className="header-actions">
              <a
                href="/configuracoes"
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "1px solid #363642",
                  background: "#15151c",
                  color: "#ffffff",
                  textDecoration: "none",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                Configurações
              </a>

              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 16px",
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
                  margin: "0 0 6px 0",
                  wordBreak: "break-word",
                }}
              >
                {nome || "Usuário"}
              </h2>

              <p
                style={{
                  color: "#a1a1aa",
                  fontSize: "14px",
                  margin: 0,
                  wordBreak: "break-word",
                }}
              >
                {email}
              </p>
            </div>

            <div className="cards-grid">
              {/* 1 - CRIAR PROMPTS */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    margin: "0 0 10px 0",
                  }}
                >
                  ✨ Criar Prompts
                </h3>

                <p className="card-description">
                  Crie e aperfeiçoe prompts para suas criações.
                </p>

                <a href="#" className="card-link">
                  Abrir →
                </a>
              </div>

              {/* 2 - TEXTO PARA IMAGEM */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    margin: "0 0 10px 0",
                  }}
                >
                  📝 Texto → Imagem
                </h3>

                <p className="card-description">
                  Transforme suas ideias em imagens com IA.
                </p>

                <a href="#" className="card-link">
                  Abrir →
                </a>
              </div>

              {/* 3 - TEXTO PARA VÍDEO */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    margin: "0 0 10px 0",
                  }}
                >
                  🎬 Texto → Vídeo
                </h3>

                <p className="card-description">
                  Transforme suas ideias em vídeos com IA.
                </p>

                <a href="#" className="card-link">
                  Abrir →
                </a>
              </div>

              {/* 4 - IMAGEM PARA IMAGEM */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    margin: "0 0 10px 0",
                  }}
                >
                  🖼️ Imagem → Imagem
                </h3>

                <p className="card-description">
                  Transforme suas imagens com IA.
                </p>

                <a href="#" className="card-link">
                  Abrir →
                </a>
              </div>

              {/* 5 - IMAGEM PARA VÍDEO */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    margin: "0 0 10px 0",
                  }}
                >
                  🎞️ Imagem → Vídeo
                </h3>

                <p className="card-description">
                  Dê vida às suas imagens com IA.
                </p>

                <a href="#" className="card-link">
                  Abrir →
                </a>
              </div>

              {/* 6 - MEUS PROJETOS */}
              <div className="dashboard-card">
                <h3
                  style={{
                    fontSize: "20px",
                    margin: "0 0 10px 0",
                  }}
                >
                  📁 Meus Projetos
                </h3>

                <p className="card-description">
                  Acesse e gerencie suas criações.
                </p>

                <a href="#" className="card-link">
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
