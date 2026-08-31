"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreditosPage() {
  const [credits] = useState(30);

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
          background: #06101e;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
        }

        a,
        button {
          -webkit-tap-highlight-color: transparent;
        }

        .page {
          min-height: 100vh;
          color: #ffffff;

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

          padding: 0 42px;

          background: rgba(4, 12, 24, 0.92);

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

          filter:
            drop-shadow(
              0 0 10px
              rgba(75, 199, 255, 0.8)
            );
        }

        .brand-name {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .back-link {
          color: #7bd8ff;

          text-decoration: none;

          font-size: 17px;
          font-weight: 700;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .back-link:hover {
          color: #b4ecff;

          text-shadow:
            0 0 12px
            rgba(75, 199, 255, 0.8);

          transform: translateX(-2px);
        }

        /* =========================
           CONTEÚDO
        ========================= */

        .content {
          width:
            min(
              1180px,
              calc(100% - 48px)
            );

          margin: 0 auto;

          padding:
            58px 0 76px;
        }

        .title-area {
          text-align: center;

          margin-bottom: 38px;
        }

        .title-area h1 {
          margin: 0;

          font-size:
            clamp(
              34px,
              5vw,
              56px
            );

          line-height: 1.12;

          font-weight: 700;

          letter-spacing: 0.5px;

          text-transform: uppercase;
        }

        .title-area p {
          margin:
            20px auto 0;

          max-width: 680px;

          color: #b9c5d4;

          font-size:
            clamp(
              17px,
              2vw,
              20px
            );

          line-height: 1.5;
        }

        /* =========================
           SALDO
        ========================= */

        .balance-card {
          width: 100%;

          margin-bottom: 28px;

          padding: 34px;

          border-radius: 22px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.96),
              rgba(14, 25, 40, 0.98)
            );

          border:
            2px solid #58c9ff;

          box-shadow:
            0 0 10px
              rgba(70, 199, 255, 0.85),
            0 0 28px
              rgba(43, 167, 255, 0.4),
            inset 0 0 25px
              rgba(56, 174, 255, 0.08);
        }

        .balance-content {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 30px;
        }

        .balance-label {
          color: #aebdcc;

          font-size: 16px;

          margin-bottom: 8px;
        }

        .balance-number {
          font-size:
            clamp(
              42px,
              7vw,
              64px
            );

          line-height: 1;

          font-weight: 800;
        }

        .balance-number span {
          font-size: 24px;

          color: #9edfff;

          font-weight: 600;
        }

        .balance-icon {
          font-size: 70px;

          filter:
            drop-shadow(
              0 0 14px
              rgba(100, 220, 255, 0.75)
            );
        }

        /* =========================
           GRID
        ========================= */

        .grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 24px;
        }

        .card {
          padding: 28px;

          border-radius: 20px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.95),
              rgba(14, 25, 40, 0.97)
            );

          border:
            1px solid
            rgba(88, 201, 255, 0.55);

          box-shadow:
            0 0 15px
              rgba(43, 167, 255, 0.18),
            inset 0 0 18px
              rgba(56, 174, 255, 0.04);
        }

        .card h2 {
          margin:
            0 0 20px;

          font-size: 20px;
        }

        .card-description {
          margin:
            -8px 0 20px;

          color: #9eacbd;

          font-size: 14px;

          line-height: 1.5;
        }

        /* =========================
           PACOTES
        ========================= */

        .packages {
          grid-column: span 3;
        }

        .packages-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }

        .package {
          padding: 22px;

          border-radius: 16px;

          background:
            rgba(3, 13, 25, 0.65);

          border:
            1px solid
            rgba(94, 203, 255, 0.28);

          text-align: center;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .package:hover {
          transform:
            translateY(-4px);

          border-color:
            #58c9ff;

          box-shadow:
            0 0 20px
            rgba(70, 199, 255, 0.3);
        }

        .package-icon {
          font-size: 38px;

          margin-bottom: 12px;
        }

        .package h3 {
          margin:
            0 0 7px;

          font-size: 21px;
        }

        .package p {
          margin:
            0 0 18px;

          color: #9eacbd;

          font-size: 13px;
        }

        .buy-button {
          width: 100%;

          padding: 12px;

          border: none;

          border-radius: 11px;

          cursor: pointer;

          color: #04101b;

          background:
            linear-gradient(
              90deg,
              #5ed2ff,
              #75e0ff
            );

          font-size: 14px;

          font-weight: 800;

          box-shadow:
            0 0 10px
            rgba(70, 199, 255, 0.45);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .buy-button:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 0 18px
            rgba(70, 199, 255, 0.75);
        }

        /* =========================
           USO
        ========================= */

        .usage {
          min-height: 210px;
        }

        .usage-item {
          display: flex;

          align-items: center;

          justify-content: space-between;

          padding:
            13px 14px;

          margin-bottom: 10px;

          border-radius: 11px;

          background:
            rgba(3, 13, 25, 0.62);

          border:
            1px solid
            rgba(94, 203, 255, 0.16);
        }

        .usage-name {
          color: #b9c9d9;

          font-size: 13px;
        }

        .usage-value {
          color: #7bd8ff;

          font-size: 13px;

          font-weight: 800;
        }

        /* =========================
           HISTÓRICO
        ========================= */

        .history {
          min-height: 210px;
        }

        .history-empty {
          padding:
            25px 10px;

          text-align: center;

          color: #8293a7;

          font-size: 14px;

          line-height: 1.5;
        }

        /* =========================
           INFORMAÇÃO
        ========================= */

        .info {
          min-height: 210px;
        }

        .info-item {
          display: flex;

          gap: 12px;

          margin-bottom: 15px;

          color: #aebdcc;

          font-size: 14px;

          line-height: 1.5;
        }

        .info-item span:first-child {
          font-size: 20px;
        }

        /* =========================
           AÇÕES
        ========================= */

        .actions {
          display: flex;

          gap: 14px;

          margin-top: 28px;
        }

        .action {
          flex: 1;

          min-height: 48px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

          text-decoration: none;

          font-size: 14px;

          font-weight: 700;
        }

        .action-primary {
          color: #04101b;

          background:
            linear-gradient(
              90deg,
              #5ed2ff,
              #75e0ff
            );
        }

        .action-secondary {
          color: #bfeaff;

          background:
            rgba(94, 203, 255, 0.08);

          border:
            1px solid
            rgba(94, 203, 255, 0.3);
        }

        /* =========================
           RODAPÉ
        ========================= */

        .footer {
          border-top:
            1px solid
            rgba(100, 180, 255, 0.18);

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
          width:
            min(
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
            1px solid
            rgba(100, 180, 255, 0.16);

          text-align: center;

          color: #8997a9;

          font-size: 13px;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 900px) {
          .topbar {
            padding:
              0 24px;
          }

          .grid {
            grid-template-columns:
              1fr 1fr;
          }

          .packages {
            grid-column:
              span 2;
          }

          .packages-grid {
            grid-template-columns:
              1fr 1fr;
          }
        }

        /* =========================
           CELULAR
        ========================= */

        @media (max-width: 650px) {
          .topbar {
            min-height: 68px;

            padding:
              14px 16px;

            flex-wrap: wrap;

            justify-content: center;
          }

          .brand {
            width: 100%;

            justify-content: center;
          }

          .brand-name {
            font-size: 16px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .back-link {
            font-size: 13px;
          }

          .content {
            width:
              min(
                calc(100% - 32px),
                430px
              );

            padding:
              42px 0 55px;
          }

          .title-area h1 {
            font-size: 34px;
          }

          .title-area p {
            font-size: 16px;
          }

          .balance-card {
            padding: 23px;

            border-radius: 19px;
          }

          .balance-content {
            align-items: center;
          }

          .balance-icon {
            font-size: 48px;
          }

          .balance-number {
            font-size: 42px;
          }

          .balance-number span {
            font-size: 18px;
          }

          .grid {
            grid-template-columns:
              1fr;
          }

          .packages {
            grid-column:
              span 1;
          }

          .packages-grid {
            grid-template-columns:
              1fr;
          }

          .actions {
            flex-direction:
              column;
          }

          .footer {
            padding:
              42px 24px 22px;
          }

          .footer-columns {
            grid-template-columns:
              1fr;

            gap: 30px;
          }
        }

        @media (max-width: 430px) {
          .topbar {
            min-height: 68px;

            padding:
              0 15px;

            flex-wrap: nowrap;

            justify-content: space-between;
          }

          .brand {
            width: auto;

            justify-content:
              flex-start;
          }

          .brand-icon {
            font-size: 22px;
          }

          .brand-name {
            font-size: 14px;
          }

          .back-link {
            font-size: 12px;

            white-space: nowrap;
          }

          .balance-content {
            gap: 10px;
          }

          .balance-icon {
            font-size: 40px;
          }
        }
      `}</style>

      <main className="page">

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
            className="back-link"
          >
            ← Voltar ao Dashboard
          </Link>

        </header>


        {/* =========================
            CONTEÚDO
        ========================= */}

        <section className="content">

          <div className="title-area">

            <h1>
              💎 CRÉDITOS
            </h1>

            <p>
              Gerencie seus créditos e acompanhe
              o uso das ferramentas de inteligência
              artificial do CIEL IA STUDIO.
            </p>

          </div>


          {/* =========================
              SALDO
          ========================= */}

          <section className="balance-card">

            <div className="balance-content">

              <div>

                <div className="balance-label">
                  Seu saldo disponível
                </div>

                <div className="balance-number">

                  {credits}{" "}

                  <span>
                    créditos
                  </span>

                </div>

              </div>

              <div className="balance-icon">
                💎
              </div>

            </div>

          </section>


          {/* =========================
              GRID
          ========================= */}

          <div className="grid">

            {/* PACOTES */}

            <section className="card packages">

              <h2>
                ⚡ Adicionar créditos
              </h2>

              <p className="card-description">
                Escolha um pacote de créditos
                para utilizar nas ferramentas
                de criação do CIEL IA STUDIO.
              </p>

              <div className="packages-grid">

                <div className="package">

                  <div className="package-icon">
                    🌱
                  </div>

                  <h3>
                    100 créditos
                  </h3>

                  <p>
                    Pacote inicial
                  </p>

                  <button
                    className="buy-button"
                    onClick={() =>
                      alert(
                        "Compra de créditos será ativada em breve."
                      )
                    }
                  >
                    Comprar
                  </button>

                </div>


                <div className="package">

                  <div className="package-icon">
                    🚀
                  </div>

                  <h3>
                    500 créditos
                  </h3>

                  <p>
                    Pacote popular
                  </p>

                  <button
                    className="buy-button"
                    onClick={() =>
                      alert(
                        "Compra de créditos será ativada em breve."
                      )
                    }
                  >
                    Comprar
                  </button>

                </div>


                <div className="package">

                  <div className="package-icon">
                    🔥
                  </div>

                  <h3>
                    1.000 créditos
                  </h3>

                  <p>
                    Pacote avançado
                  </p>

                  <button
                    className="buy-button"
                    onClick={() =>
                      alert(
                        "Compra de créditos será ativada em breve."
                      )
                    }
                  >
                    Comprar
                  </button>

                </div>

              </div>

            </section>


            {/* USO */}

            <section className="card usage">

              <h2>
                📊 Uso dos créditos
              </h2>

              <div className="usage-item">

                <span className="usage-name">
                  🤖 Criar Prompts
                </span>

                <span className="usage-value">
                  Em breve
                </span>

              </div>

              <div className="usage-item">

                <span className="usage-name">
                  🖼️ Texto → Imagem
                </span>

                <span className="usage-value">
                  Em breve
                </span>

              </div>

              <div className="usage-item">

                <span className="usage-name">
                  🎬 Texto → Vídeo
                </span>

                <span className="usage-value">
                  Em breve
                </span>

              </div>

              <div className="usage-item">

                <span className="usage-name">
                  ✨ Outras ferramentas
                </span>

                <span className="usage-value">
                  Em breve
                </span>

              </div>

            </section>


            {/* HISTÓRICO */}

            <section className="card history">

              <h2>
                🧾 Histórico
              </h2>

              <div className="history-empty">

                📋 Nenhuma movimentação
                registrada ainda.

                <br />

                Quando você utilizar ou
                adicionar créditos, seu
                histórico aparecerá aqui.

              </div>

            </section>


            {/* INFORMAÇÕES */}

            <section className="card info">

              <h2>
                💡 Como funcionam os créditos
              </h2>

              <div className="info-item">

                <span>
                  💎
                </span>

                <span>
                  Seus créditos são utilizados
                  para acessar as ferramentas
                  de inteligência artificial.
                </span>

              </div>

              <div className="info-item">

                <span>
                  ⚡
                </span>

                <span>
                  Cada ferramenta poderá ter
                  um custo diferente de créditos.
                </span>

              </div>

              <div className="info-item">

                <span>
                  🔒
                </span>

                <span>
                  Seu saldo fica associado à
                  sua conta.
                </span>

              </div>

            </section>

          </div>


          {/* =========================
              AÇÕES
          ========================= */}

          <div className="actions">

            <Link
              href="/dashboard"
              className="action action-primary"
            >
              ← Voltar ao Dashboard
            </Link>

            <Link
              href="/minha-conta"
              className="action action-secondary"
            >
              👤 Minha Conta
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

                <Link href="/creditos">
                  💎 Créditos
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
