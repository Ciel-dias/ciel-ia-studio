"use client";

import { useState } from "react";

type FilterType = "Todos" | "Imagens" | "Vídeos" | "Prompts";

export default function ProjetosPage() {
  const [filtro, setFiltro] = useState<FilterType>("Todos");

  const projetos = [
    {
      tipo: "Imagens",
      icon: "🖼️",
      titulo: "Minhas imagens",
      descricao: "Suas criações de Texto → Imagem e Imagem → Imagem aparecerão aqui.",
    },
    {
      tipo: "Vídeos",
      icon: "🎬",
      titulo: "Meus vídeos",
      descricao: "Seus vídeos gerados por IA aparecerão aqui.",
    },
    {
      tipo: "Prompts",
      icon: "✨",
      titulo: "Meus prompts",
      descricao: "Seus prompts criados e aprimorados com IA aparecerão aqui.",
    },
  ];

  const projetosFiltrados =
    filtro === "Todos"
      ? projetos
      : projetos.filter((projeto) => projeto.tipo === filtro);

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

        a {
          -webkit-tap-highlight-color: transparent;
        }

        button {
          font-family: inherit;
        }

        .page {
          min-height: 100vh;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 78% 16%,
              rgba(20, 119, 190, 0.42),
              transparent 38%
            ),
            radial-gradient(
              circle at 14% 68%,
              rgba(15, 76, 125, 0.3),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #06101e 0%,
              #081a30 48%,
              #0b3556 100%
            );
          overflow-x: hidden;
        }

        .topbar {
          width: 100%;
          min-height: 74px;
          padding: 0 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: rgba(4, 12, 24, 0.9);
          border-bottom: 1px solid rgba(100, 180, 255, 0.18);
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

        .back {
          color: #bfeaff;
          text-decoration: none;
          font-size: 14px;
          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .back:hover {
          color: #6ed7ff;
          text-shadow: 0 0 12px rgba(75, 199, 255, 0.8);
        }

        .content {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 55px 0 70px;
        }

        .title-area {
          text-align: center;
          margin-bottom: 34px;
        }

        .title-area h1 {
          margin: 0;
          font-size: clamp(32px, 5vw, 52px);
          line-height: 1.12;
          text-transform: uppercase;
        }

        .title-area p {
          margin: 15px auto 0;
          max-width: 650px;
          color: #b7c5d5;
          font-size: 17px;
          line-height: 1.5;
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
          padding: 18px 20px;
          border-radius: 18px;
          background: rgba(4, 15, 29, 0.65);
          border: 1px solid rgba(94, 203, 255, 0.22);
          backdrop-filter: blur(10px);
        }

        .toolbar-title {
          color: #c7d5e3;
          font-size: 14px;
          font-weight: 700;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .filter {
          padding: 9px 15px;
          border-radius: 11px;
          border: 1px solid rgba(94, 203, 255, 0.28);
          background: rgba(5, 20, 36, 0.8);
          color: #b9c8d7;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          transition:
            0.2s ease,
            box-shadow 0.2s ease;
        }

        .filter:hover {
          color: #ffffff;
          border-color: #58c9ff;
        }

        .filter.active {
          color: #04101b;
          background: linear-gradient(
            90deg,
            #5ed2ff,
            #75e0ff
          );
          border-color: #68d4ff;
          box-shadow:
            0 0 10px rgba(70, 199, 255, 0.55),
            0 0 20px rgba(43, 167, 255, 0.25);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }

        .project-card {
          min-height: 300px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: center;
          border-radius: 22px;
          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.95),
              rgba(14, 25, 40, 0.97)
            );
          border: 2px solid #58c9ff;
          box-shadow:
            0 0 8px rgba(70, 199, 255, 0.8),
            0 0 22px rgba(43, 167, 255, 0.35),
            inset 0 0 22px rgba(56, 174, 255, 0.07);
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease,
            background 0.22s ease;
        }

        .project-card:hover {
          transform: translateY(-5px);
          background:
            linear-gradient(
              145deg,
              rgba(42, 65, 89, 0.98),
              rgba(15, 31, 50, 0.98)
            );
          box-shadow:
            0 0 12px rgba(85, 211, 255, 1),
            0 0 32px rgba(43, 167, 255, 0.7),
            inset 0 0 25px rgba(56, 174, 255, 0.12);
        }

        .project-icon {
          width: 92px;
          height: 92px;
          margin: 0 auto 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 22px;
          font-size: 46px;
          background:
            radial-gradient(
              circle,
              rgba(43, 167, 255, 0.18),
              transparent 70%
            ),
            rgba(3, 13, 25, 0.72);
          border: 1px solid rgba(94, 203, 255, 0.3);
        }

        .project-card h2 {
          margin: 0;
          font-size: 21px;
        }

        .project-card p {
          margin: 13px auto 0;
          max-width: 280px;
          color: #aebdcc;
          font-size: 14px;
          line-height: 1.55;
        }

        .project-type {
          display: inline-block;
          margin-top: 18px;
          padding: 7px 12px;
          border-radius: 10px;
          color: #bfeaff;
          background: rgba(29, 112, 157, 0.15);
          border: 1px solid rgba(94, 203, 255, 0.2);
          font-size: 12px;
          font-weight: 700;
        }

        .empty {
          margin-top: 30px;
          padding: 55px 25px;
          text-align: center;
          border-radius: 22px;
          border: 1px dashed rgba(104, 207, 255, 0.35);
          background: rgba(2, 12, 24, 0.48);
        }

        .empty-icon {
          font-size: 55px;
          margin-bottom: 15px;
        }

        .empty h2 {
          margin: 0;
          font-size: 21px;
        }

        .empty p {
          margin: 10px auto 0;
          max-width: 500px;
          color: #8798aa;
          line-height: 1.5;
        }

        .create-button {
          display: inline-block;
          margin-top: 22px;
          padding: 13px 22px;
          border-radius: 13px;
          color: #04101b;
          background: linear-gradient(
            90deg,
            #5ed2ff,
            #75e0ff
          );
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          box-shadow:
            0 0 10px rgba(70, 199, 255, 0.65),
            0 0 22px rgba(43, 167, 255, 0.3);
          transition: 0.2s ease;
        }

        .create-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 14px rgba(85, 211, 255, 1),
            0 0 30px rgba(43, 167, 255, 0.5);
        }

        .footer {
          border-top: 1px solid rgba(100, 180, 255, 0.18);
          background:
            linear-gradient(
              180deg,
              rgba(4, 15, 29, 0.96),
              rgba(3, 11, 22, 1)
            );
          padding: 52px 42px 24px;
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
          color: #9eacbd;
          font-size: 15px;
        }

        .footer-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
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
          color: #aebaca;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .footer-column a:hover {
          color: #68d2ff;
        }

        .footer-bottom {
          margin-top: 36px;
          padding-top: 22px;
          border-top: 1px solid rgba(100, 180, 255, 0.16);
          text-align: center;
          color: #8997a9;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .topbar {
            padding: 0 24px;
          }

          .projects-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .toolbar {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 650px) {
          .topbar {
            min-height: 68px;
            padding: 0 16px;
          }

          .brand-name {
            font-size: 16px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .content {
            width: min(100% - 28px, 430px);
            padding-top: 38px;
          }

          .projects-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .project-card {
            min-height: 275px;
          }

          .toolbar {
            padding: 16px;
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

          .back {
            margin-top: 2px;
          }

          .title-area h1 {
            font-size: 34px;
          }

          .title-area p {
            font-size: 16px;
          }

          .filters {
            width: 100%;
          }

          .filter {
            flex: 1;
          }
        }
      `}</style>

      <main className="page">
        {/* CABEÇALHO */}
        <header className="topbar">
          <div className="brand">
            <span className="brand-icon">✨</span>

            <span className="brand-name">
              CIEL IA STUDIO
            </span>
          </div>

          <a href="/dashboard" className="back">
            ← Voltar ao Dashboard
          </a>
        </header>

        {/* CONTEÚDO */}
        <section className="content">
          <div className="title-area">
            <h1>Meus Projetos</h1>

            <p>
              Acesse, organize e acompanhe todas as suas
              criações feitas no CIEL IA STUDIO.
            </p>
          </div>

          {/* FILTROS */}
          <div className="toolbar">
            <div className="toolbar-title">
              📁 Minhas criações
            </div>

            <div className="filters">
              {(
                ["Todos", "Imagens", "Vídeos", "Prompts"] as FilterType[]
              ).map((item) => (
                <button
                  key={item}
                  className={`filter ${
                    filtro === item ? "active" : ""
                  }`}
                  onClick={() => setFiltro(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* PROJETOS */}
          <div className="projects-grid">
            {projetosFiltrados.map((projeto) => (
              <article
                key={projeto.tipo}
                className="project-card"
              >
                <div>
                  <div className="project-icon">
                    {projeto.icon}
                  </div>

                  <h2>{projeto.titulo}</h2>

                  <p>
                    {projeto.descricao}
                  </p>

                  <span className="project-type">
                    {projeto.tipo}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* ÁREA VAZIA */}
          <div className="empty">
            <div className="empty-icon">
              🚀
            </div>

            <h2>
              Suas criações aparecerão aqui
            </h2>

            <p>
              Quando você começar a gerar imagens,
              vídeos e prompts, eles serão organizados
              nesta área.
            </p>

            <a
              href="/criar-prompts"
              className="create-button"
            >
              ✨ Começar uma criação
            </a>
          </div>
        </section>

        {/* RODAPÉ */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <h2>CIEL IA STUDIO</h2>

              <p>
                Crie. Transforme. Inove com IA.
              </p>
            </div>

            <div className="footer-columns">
              <div className="footer-column">
                <h3>Produto</h3>

                <a href="/criar-prompts">
                  Criar Prompts
                </a>

                <a href="/texto-imagem">
                  Texto → Imagem
                </a>

                <a href="/texto-video">
                  Texto → Vídeo
                </a>

                <a href="/imagem-imagem">
                  Imagem → Imagem
                </a>

                <a href="/imagem-video">
                  Imagem → Vídeo
                </a>

                <a href="/projetos">
                  Meus Projetos
                </a>
              </div>

              <div className="footer-column">
                <h3>Suporte</h3>

                <a href="/ajuda">
                  Central de Ajuda
                </a>

                <a href="/contato">
                  Contato
                </a>

                <a href="/sobre">
                  Sobre o CIEL IA STUDIO
                </a>
              </div>

              <div className="footer-column">
                <h3>Legal</h3>

                <a href="/termos">
                  Termos de Uso
                </a>

                <a href="/privacidade">
                  Política de Privacidade
                </a>

                <a href="/reembolso">
                  Política de Reembolso
                </a>
              </div>
            </div>

            <div className="footer-bottom">
              © 2026 CIEL IA STUDIO. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
