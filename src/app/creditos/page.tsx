"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreditosPage() {
  const [diamantes] = useState(30);

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
          color: #fff;
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(0, 170, 255, 0.13),
              transparent 30%
            ),
            radial-gradient(
              circle at 85% 20%,
              rgba(0, 100, 255, 0.1),
              transparent 28%
            ),
            linear-gradient(135deg, #06101e 0%, #081a2e 50%, #04101e 100%);
          overflow-x: hidden;
        }

        .topbar {
          width: 100%;
          min-height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 42px;
          background: rgba(4, 12, 24, 0.92);
          border-bottom: 1px solid rgba(100, 180, 255, 0.18);
          backdrop-filter: blur(12px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
        }

        .brand-icon {
          font-size: 27px;
          filter: drop-shadow(0 0 10px rgba(0, 200, 255, 0.55));
        }

        .brand-name {
          font-size: 18px;
          letter-spacing: 0.5px;
          color: #ffffff;
        }

        .back-link {
          color: #9edcff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .back-link:hover {
          color: #ffffff;
          text-shadow: 0 0 12px rgba(0, 200, 255, 0.8);
        }

        .content {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
          padding: 58px 0 76px;
        }

        .title-area {
          text-align: center;
          margin-bottom: 34px;
        }

        .title-area h1 {
          margin: 0 0 12px;
          font-size: 42px;
          font-weight: 900;
          letter-spacing: 0.5px;
          background: linear-gradient(90deg, #ffffff, #8ddfff, #ffffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-area p {
          margin: 0 auto;
          max-width: 760px;
          color: #9db5c9;
          font-size: 17px;
          line-height: 1.6;
        }

        .balance-card {
          margin-bottom: 28px;
          padding: 28px 32px;
          border-radius: 22px;
          border: 1px solid rgba(0, 204, 255, 0.28);
          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(0, 204, 255, 0.12),
              transparent 35%
            ),
            rgba(7, 25, 43, 0.9);
          box-shadow:
            0 0 35px rgba(0, 150, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .balance-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .balance-label {
          color: #8ea8bd;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .balance-number {
          font-size: 48px;
          line-height: 1;
          font-weight: 900;
          color: #ffffff;
        }

        .balance-number span {
          font-size: 21px;
          font-weight: 700;
          color: #8edcff;
        }

        .balance-icon {
          font-size: 58px;
          filter: drop-shadow(0 0 18px rgba(0, 200, 255, 0.5));
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .card {
          border: 1px solid rgba(112, 187, 235, 0.14);
          border-radius: 20px;
          padding: 25px;
          background: rgba(7, 23, 40, 0.78);
          box-shadow:
            0 15px 45px rgba(0, 0, 0, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
        }

        .card h2 {
          margin: 0 0 10px;
          font-size: 20px;
          color: #ffffff;
        }

        .card-description {
          margin: 0 0 22px;
          color: #8fa7bb;
          font-size: 14px;
          line-height: 1.6;
        }

        .packages {
          grid-column: span 3;
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .package {
          text-align: center;
          padding: 24px 18px;
          border-radius: 17px;
          border: 1px solid rgba(90, 181, 235, 0.16);
          background: rgba(8, 29, 48, 0.72);
          transition: 0.25s ease;
        }

        .package:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 207, 255, 0.42);
          box-shadow: 0 12px 30px rgba(0, 160, 255, 0.08);
        }

        .package-icon {
          font-size: 34px;
          margin-bottom: 10px;
        }

        .package h3 {
          margin: 0 0 7px;
          font-size: 20px;
          color: #ffffff;
        }

        .package p {
          margin: 0 0 17px;
          color: #819bb0;
          font-size: 13px;
        }

        .buy-button {
          width: 100%;
          border: 0;
          border-radius: 11px;
          padding: 12px 16px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          background: linear-gradient(135deg, #008cff, #00c8ff);
          box-shadow: 0 7px 20px rgba(0, 157, 255, 0.2);
          transition: 0.2s ease;
        }

        .buy-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 9px 25px rgba(0, 180, 255, 0.32);
        }

        .usage-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(120, 180, 220, 0.1);
        }

        .usage-item:last-child {
          border-bottom: 0;
        }

        .usage-name {
          color: #d7e8f5;
          font-size: 14px;
        }

        .usage-value {
          color: #73d8ff;
          font-size: 13px;
          font-weight: 700;
        }

        .history-empty {
          padding: 22px 10px;
          text-align: center;
          color: #8199ad;
          font-size: 14px;
          line-height: 1.7;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 11px 0;
          color: #9bb1c3;
          font-size: 14px;
          line-height: 1.5;
        }

        .info-item > span:first-child {
          font-size: 18px;
          flex-shrink: 0;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 14px;
          margin-top: 34px;
        }

        .action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 22px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          transition: 0.2s ease;
        }

        .action-primary {
          color: #ffffff;
          background: linear-gradient(135deg, #008cff, #00bfff);
          box-shadow: 0 8px 24px rgba(0, 157, 255, 0.18);
        }

        .action-secondary {
          color: #9edcff;
          border: 1px solid rgba(83, 185, 240, 0.2);
          background: rgba(10, 30, 48, 0.7);
        }

        .action:hover {
          transform: translateY(-2px);
        }

        .footer {
          padding: 52px 42px 24px;
          border-top: 1px solid rgba(100, 180, 255, 0.12);
          background: rgba(3, 11, 21, 0.88);
        }

        .footer-inner {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .footer-brand h2 {
          margin: 0 0 6px;
          font-size: 18px;
        }

        .footer-brand p {
          margin: 0;
          color: #71899d;
          font-size: 13px;
        }

        .footer-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 34px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-column h3 {
          margin: 0 0 5px;
          font-size: 14px;
          color: #d9f3ff;
        }

        .footer-column a {
          color: #71899d;
          text-decoration: none;
          font-size: 13px;
          transition: 0.2s ease;
        }

        .footer-column a:hover {
          color: #8edfff;
        }

        .footer-bottom {
          margin-top: 38px;
          padding-top: 20px;
          border-top: 1px solid rgba(100, 180, 255, 0.08);
          color: #5e7487;
          text-align: center;
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .topbar {
            padding: 0 24px;
          }

          .grid {
            grid-template-columns: 1fr 1fr;
          }

          .packages {
            grid-column: span 2;
          }

          .packages-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 650px) {
          .topbar {
            min-height: 68px;
            padding: 14px 16px;
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
            width: min(calc(100% - 32px), 430px);
            padding: 42px 0 55px;
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
            grid-template-columns: 1fr;
          }

          .packages {
            grid-column: span 1;
          }

          .packages-grid {
            grid-template-columns: 1fr;
          }

          .actions {
            flex-direction: column;
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
            min-height: 68px;
            padding: 0 15px;
            flex-wrap: nowrap;
            justify-content: space-between;
          }

          .brand {
            width: auto;
            justify-content: flex-start;
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
        <header className="topbar">
          <div className="brand">
            <span className="brand-icon">✨</span>
            <span className="brand-name">CIEL IA STUDIO</span>
          </div>

          <Link href="/dashboard" className="back-link">
            ← Voltar ao Dashboard
          </Link>
        </header>

        <section className="content">
          <div className="title-area">
            <h1>💎 DIAMANTES</h1>

            <p>
              Gerencie seus Diamantes e acompanhe o uso das ferramentas de
              inteligência artificial do CIEL IA STUDIO.
            </p>
          </div>

          <section className="balance-card">
            <div className="balance-content">
              <div>
                <div className="balance-label">
                  Seu saldo disponível
                </div>

                <div className="balance-number">
                  {diamantes} <span>Diamantes</span>
                </div>
              </div>

              <div className="balance-icon">💎</div>
            </div>
          </section>

          <div className="grid">
            <section className="card packages">
              <h2>⚡ Adicionar Diamantes</h2>

              <p className="card-description">
                Escolha um pacote de Diamantes para utilizar nas ferramentas
                de criação do CIEL IA STUDIO.
              </p>

              <div className="packages-grid">
                <div className="package">
                  <div className="package-icon">🌱</div>

                  <h3>100 Diamantes</h3>

                  <p>Pacote inicial</p>

                  <button
                    className="buy-button"
                    onClick={() =>
                      alert(
                        "Compra de Diamantes será ativada em breve."
                      )
                    }
                  >
                    Comprar
                  </button>
                </div>

                <div className="package">
                  <div className="package-icon">🚀</div>

                  <h3>500 Diamantes</h3>

                  <p>Pacote popular</p>

                  <button
                    className="buy-button"
                    onClick={() =>
                      alert(
                        "Compra de Diamantes será ativada em breve."
                      )
                    }
                  >
                    Comprar
                  </button>
                </div>

                <div className="package">
                  <div className="package-icon">🔥</div>

                  <h3>1.000 Diamantes</h3>

                  <p>Pacote avançado</p>

                  <button
                    className="buy-button"
                    onClick={() =>
                      alert(
                        "Compra de Diamantes será ativada em breve."
                      )
                    }
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </section>

            <section className="card usage">
              <h2>📊 Uso dos Diamantes</h2>

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

            <section className="card history">
              <h2>🧾 Histórico</h2>

              <div className="history-empty">
                📋 Nenhuma movimentação registrada ainda.
                <br />
                Quando você utilizar ou adicionar Diamantes,
                seu histórico aparecerá aqui.
              </div>
            </section>

            <section className="card info">
              <h2>💡 Como funcionam os Diamantes</h2>

              <div className="info-item">
                <span>💎</span>

                <span>
                  Seus Diamantes são utilizados para acessar
                  as ferramentas de inteligência artificial.
                </span>
              </div>

              <div className="info-item">
                <span>⚡</span>

                <span>
                  Cada ferramenta poderá ter um custo diferente
                  de Diamantes.
                </span>
              </div>

              <div className="info-item">
                <span>🔒</span>

                <span>
                  Seu saldo fica associado à sua conta.
                </span>
              </div>
            </section>
          </div>

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
                  💎 Diamantes
                </Link>
              </div>

              <div className="footer-column">
                <h3>Suporte</h3>

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
                <h3>Legal</h3>

                <Link href="/termos">
                  Termos de Uso
                </Link>

                <Link href="/privacidade">
                  Política de Privacidade
                </Link>
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
