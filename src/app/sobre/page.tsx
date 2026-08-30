"use client";

import Link from "next/link";

export default function SobrePage() {
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
          background: #07111f;
          color: #ffffff;
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }

        .about-page {
          min-height: 100vh;

          background:
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
            );

          color: #ffffff;

          overflow-x: hidden;
        }

        /* =========================
           TOPO
        ========================= */

        .topbar {
          width: 100%;
          min-height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          padding: 0 42px;

          background: rgba(4, 12, 24, 0.88);

          border-bottom:
            1px solid rgba(100, 180, 255, 0.18);

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
          color: #8fdcff;

          text-decoration: none;

          font-size: 15px;

          font-weight: 700;

          white-space: nowrap;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .back:hover {
          color: #72d5ff;

          text-shadow:
            0 0 12px rgba(75, 199, 255, 0.8);
        }

        /* =========================
           CONTEÚDO
        ========================= */

        .content {
          width: min(
            1000px,
            calc(100% - 48px)
          );

          margin: 0 auto;

          padding:
            60px 0 80px;
        }

        .hero {
          text-align: center;

          margin-bottom: 42px;
        }

        .hero-icon {
          font-size: 54px;

          margin-bottom: 14px;

          filter:
            drop-shadow(
              0 0 14px
              rgba(75, 199, 255, 0.75)
            );
        }

        .hero h1 {
          margin: 0;

          font-size:
            clamp(34px, 5vw, 54px);

          line-height: 1.12;

          font-weight: 700;

          letter-spacing: 0.5px;
        }

        .hero p {
          max-width: 760px;

          margin:
            18px auto 0;

          color: #b9c5d4;

          font-size:
            clamp(16px, 2vw, 19px);

          line-height: 1.65;
        }

        /* =========================
           CARDS
        ========================= */

        .cards {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 22px;

          margin-bottom: 22px;
        }

        .card {
          padding: 30px;

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.96),
              rgba(14, 25, 40, 0.98)
            );

          border:
            1px solid rgba(88, 201, 255, 0.42);

          box-shadow:
            0 0 8px rgba(70, 199, 255, 0.18),
            0 0 22px rgba(43, 167, 255, 0.12),
            inset 0 0 22px rgba(56, 174, 255, 0.04);

          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .card:hover {
          transform: translateY(-3px);

          border-color:
            rgba(88, 201, 255, 0.72);

          box-shadow:
            0 0 12px rgba(70, 199, 255, 0.28),
            0 0 28px rgba(43, 167, 255, 0.18),
            inset 0 0 24px rgba(56, 174, 255, 0.06);
        }

        .card-icon {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 18px;

          border-radius: 15px;

          background:
            rgba(29, 130, 180, 0.16);

          border:
            1px solid rgba(94, 203, 255, 0.28);

          font-size: 25px;

          box-shadow:
            0 0 15px
            rgba(70, 199, 255, 0.12);
        }

        .card h2 {
          margin:
            0 0 12px;

          color: #ffffff;

          font-size: 22px;

          line-height: 1.3;
        }

        .card p {
          margin: 0;

          color: #c0cad6;

          font-size: 15px;

          line-height: 1.75;
        }

        /* =========================
           DESTAQUE
        ========================= */

        .highlight {
          margin-top: 22px;

          padding: 30px;

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              rgba(20, 119, 190, 0.18),
              rgba(14, 25, 40, 0.88)
            );

          border:
            2px solid rgba(88, 201, 255, 0.48);

          box-shadow:
            0 0 12px rgba(70, 199, 255, 0.18),
            inset 0 0 24px rgba(56, 174, 255, 0.05);

          text-align: center;
        }

        .highlight h2 {
          margin:
            0 0 12px;

          font-size: 25px;

          color: #ffffff;
        }

        .highlight p {
          max-width: 760px;

          margin: 0 auto;

          color: #c7d3df;

          font-size: 15px;

          line-height: 1.8;
        }

        /* =========================
           VISÃO
        ========================= */

        .vision {
          margin-top: 22px;

          padding: 32px;

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.96),
              rgba(14, 25, 40, 0.98)
            );

          border:
            1px solid rgba(88, 201, 255, 0.35);

          box-shadow:
            0 0 8px rgba(70, 199, 255, 0.14),
            0 0 22px rgba(43, 167, 255, 0.08);
        }

        .vision h2 {
          margin:
            0 0 16px;

          color: #68d2ff;

          font-size: 23px;
        }

        .vision p {
          margin:
            0 0 14px;

          color: #c0cad6;

          font-size: 15px;

          line-height: 1.8;
        }

        .vision p:last-child {
          margin-bottom: 0;
        }

        /* =========================
           RECURSOS
        ========================= */

        .features-title {
          margin:
            44px 0 20px;

          text-align: center;
        }

        .features-title h2 {
          margin: 0;

          font-size: 27px;
        }

        .features-title p {
          margin:
            10px auto 0;

          color: #9eacbd;

          font-size: 15px;
        }

        .features {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }

        .feature {
          padding: 24px;

          border-radius: 17px;

          background:
            rgba(8, 22, 38, 0.72);

          border:
            1px solid rgba(94, 203, 255, 0.22);

          text-align: center;
        }

        .feature-icon {
          font-size: 28px;

          margin-bottom: 12px;
        }

        .feature h3 {
          margin:
            0 0 8px;

          font-size: 17px;
        }

        .feature p {
          margin: 0;

          color: #aebaca;

          font-size: 13px;

          line-height: 1.6;
        }

        /* =========================
           NAVEGAÇÃO
        ========================= */

        .document-navigation {
          display: flex;

          justify-content: center;

          gap: 16px;

          margin-top: 36px;

          padding-top: 28px;

          border-top:
            1px solid rgba(100, 180, 255, 0.16);
        }

        .document-navigation a {
          display: inline-flex;

          align-items: center;

          justify-content: center;

          min-height: 44px;

          padding:
            0 20px;

          border-radius: 11px;

          color: #ffffff;

          background:
            rgba(29, 112, 157, 0.2);

          border:
            1px solid rgba(94, 203, 255, 0.4);

          text-decoration: none;

          font-size: 14px;

          font-weight: 700;

          transition:
            background 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .document-navigation a:hover {
          background:
            rgba(29, 130, 180, 0.35);

          box-shadow:
            0 0 15px rgba(70, 199, 255, 0.25);

          transform: translateY(-1px);
        }

        /* =========================
           RODAPÉ
        ========================= */

        .footer {
          border-top:
            1px solid rgba(100, 180, 255, 0.18);

          background:
            linear-gradient(
              180deg,
              rgba(4, 15, 29, 0.96),
              rgba(3, 11, 22, 1)
            );

          padding:
            52px 42px 24px;
        }

        .footer-inner {
          width: min(
            1180px,
            100%
          );

          margin: 0 auto;
        }

        .footer-brand {
          margin-bottom: 42px;
        }

        .footer-brand h2 {
          margin:
            0 0 8px;

          font-size: 24px;
        }

        .footer-brand p {
          margin: 0;

          color: #9eacbd;

          font-size: 15px;
        }

        .footer-columns {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 50px;
        }

        .footer-column h3 {
          margin:
            0 0 18px;

          font-size: 16px;
        }

        .footer-column a {
          display: block;

          width: fit-content;

          margin-bottom: 12px;

          color: #aebaca;

          text-decoration: none;

          font-size: 14px;

          transition:
            color 0.2s ease;
        }

        .footer-column a:hover {
          color: #68d2ff;
        }

        .footer-bottom {
          margin-top: 36px;

          padding-top: 22px;

          border-top:
            1px solid rgba(100, 180, 255, 0.16);

          text-align: center;

          color: #8997a9;

          font-size: 13px;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 900px) {
          .topbar {
            padding: 0 24px;
          }

          .content {
            width:
              min(
                760px,
                calc(100% - 40px)
              );
          }

          .cards {
            grid-template-columns: 1fr;
          }

          .features {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .footer-columns {
            gap: 30px;
          }
        }

        /* =========================
           CELULAR
        ========================= */

        @media (max-width: 650px) {
          .topbar {
            min-height: 68px;

            padding:
              0 16px;

            gap: 12px;

            flex-wrap: nowrap;
          }

          .brand {
            flex: 1;

            min-width: 0;

            justify-content: flex-start;

            gap: 7px;
          }

          .brand-name {
            font-size: 16px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .back {
            flex-shrink: 0;

            font-size: 13px;
          }

          .content {
            width:
              min(
                100% - 32px,
                430px
              );

            padding:
              42px 0 55px;
          }

          .hero {
            margin-bottom: 30px;
          }

          .hero-icon {
            font-size: 43px;
          }

          .hero h1 {
            font-size: 34px;
          }

          .hero p {
            font-size: 16px;
          }

          .card {
            padding: 24px;

            border-radius: 18px;
          }

          .card h2 {
            font-size: 20px;
          }

          .card p {
            font-size: 14px;

            line-height: 1.7;
          }

          .highlight {
            padding: 25px 21px;
          }

          .highlight h2 {
            font-size: 22px;
          }

          .highlight p {
            font-size: 14px;
          }

          .vision {
            padding: 25px 21px;
          }

          .vision h2 {
            font-size: 21px;
          }

          .vision p {
            font-size: 14px;
          }

          .features-title {
            margin-top: 38px;
          }

          .features-title h2 {
            font-size: 24px;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .document-navigation {
            flex-direction: column;
          }

          .document-navigation a {
            width: 100%;
          }

          .footer {
            padding:
              42px 24px 22px;
          }

          .footer-columns {
            grid-template-columns: 1fr;

            gap: 30px;
          }
        }

        /* =========================
           CELULAR PEQUENO
        ========================= */

        @media (max-width: 390px) {
          .topbar {
            padding:
              0 12px;

            gap: 8px;
          }

          .brand-name {
            font-size: 14px;
          }

          .brand-icon {
            font-size: 21px;
          }

          .back {
            font-size: 12px;
          }
        }
      `}</style>

      <main className="about-page">

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

        <section className="content">

          <div className="hero">

            <div className="hero-icon">
              ✨
            </div>

            <h1>
              SOBRE O CIEL IA STUDIO
            </h1>

            <p>
              Uma plataforma criada para tornar a
              criação com inteligência artificial mais
              simples, criativa, acessível e profissional.
            </p>

          </div>

          {/* =========================
              CARDS PRINCIPAIS
          ========================= */}

          <div className="cards">

            <article className="card">

              <div className="card-icon">
                🤖
              </div>

              <h2>
                O que é o CIEL IA STUDIO?
              </h2>

              <p>
                O CIEL IA STUDIO é uma plataforma de
                criação que reúne recursos de inteligência
                artificial em um único ambiente. A proposta
                é permitir que o usuário transforme ideias
                em conteúdos utilizando ferramentas
                modernas de IA de maneira prática e
                organizada.
              </p>

            </article>

            <article className="card">

              <div className="card-icon">
                💡
              </div>

              <h2>
                Nossa proposta
              </h2>

              <p>
                Queremos facilitar o acesso às ferramentas
                de inteligência artificial, permitindo que
                pessoas possam experimentar, criar e
                transformar suas ideias sem precisar
                trabalhar com várias ferramentas diferentes
                ao mesmo tempo.
              </p>

            </article>

          </div>

          {/* =========================
              DESTAQUE
          ========================= */}

          <div className="highlight">

            <h2>
              Crie. Transforme. Inove com IA.
            </h2>

            <p>
              O CIEL IA STUDIO está sendo desenvolvido
              para ser um espaço completo de criação,
              onde tecnologia e criatividade trabalham
              juntas para transformar ideias em resultados.
            </p>

          </div>

          {/* =========================
              VISÃO
          ========================= */}

          <div className="vision">

            <h2>
              🚀 Nossa visão
            </h2>

            <p>
              A inteligência artificial está mudando a
              maneira como as pessoas criam conteúdo,
              trabalham e desenvolvem novas ideias.
            </p>

            <p>
              Nossa visão é construir uma plataforma
              moderna e intuitiva que acompanhe essa
              evolução, oferecendo ferramentas cada vez
              melhores para criação de imagens, vídeos,
              prompts e outros conteúdos com inteligência
              artificial.
            </p>

            <p>
              O CIEL IA STUDIO continuará evoluindo com
              novos recursos, melhorias de desempenho,
              segurança e novas possibilidades de criação.
            </p>

          </div>

          {/* =========================
              RECURSOS
          ========================= */}

          <div className="features-title">

            <h2>
              Um espaço para criar
            </h2>

            <p>
              Alguns dos recursos que fazem parte da
              proposta do CIEL IA STUDIO.
            </p>

          </div>

          <div className="features">

            <article className="feature">

              <div className="feature-icon">
                ✍️
              </div>

              <h3>
                Criar Prompts
              </h3>

              <p>
                Desenvolva e aperfeiçoe ideias para
                utilização com ferramentas de IA.
              </p>

            </article>

            <article className="feature">

              <div className="feature-icon">
                🖼️
              </div>

              <h3>
                Texto → Imagem
              </h3>

              <p>
                Transforme descrições e ideias em
                imagens utilizando inteligência artificial.
              </p>

            </article>

            <article className="feature">

              <div className="feature-icon">
                🎬
              </div>

              <h3>
                Texto → Vídeo
              </h3>

              <p>
                Crie conceitos de vídeo a partir de
                descrições e prompts.
              </p>

            </article>

            <article className="feature">

              <div className="feature-icon">
                🔄
              </div>

              <h3>
                Imagem → Imagem
              </h3>

              <p>
                Transforme imagens e explore novas
                possibilidades criativas.
              </p>

            </article>

            <article className="feature">

              <div className="feature-icon">
                🎥
              </div>

              <h3>
                Imagem → Vídeo
              </h3>

              <p>
                Dê movimento às suas ideias e imagens
                utilizando recursos de IA.
              </p>

            </article>

            <article className="feature">

              <div className="feature-icon">
                📁
              </div>

              <h3>
                Meus Projetos
              </h3>

              <p>
                Organize e acompanhe seus projetos e
                criações dentro da plataforma.
              </p>

            </article>

          </div>

          {/* =========================
              NAVEGAÇÃO
          ========================= */}

          <div className="document-navigation">

            <Link href="/ajuda">
              ← Central de Ajuda
            </Link>

            <Link href="/contato">
              Fale Conosco →
            </Link>

          </div>

        </section>

        {/* =========================
            RODAPÉ
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

                <Link href="/reembolso">
                  Política de Reembolso
                </Link>

              </div>

            </div>

            <div className="footer-bottom">
              © 2026 CIEL IA STUDIO.
              Todos os direitos reservados.
            </div>

          </div>

        </footer>

      </main>
    </>
  );
}
