"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CreditosPage() {
  const [diamantes, setDiamantes] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDiamantes() {
      try {
        setCarregando(true);
        setErro("");

        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Erro ao identificar usuário:", userError);
          setErro("Não foi possível identificar sua conta.");
          setDiamantes(0);
          return;
        }

        if (!user) {
          setErro("Você precisa estar conectado para visualizar seus Diamantes.");
          setDiamantes(0);
          return;
        }

        const { data, error } = await supabase
          .from("créditos")
          .select("equilíbrio")
          .eq("uuid", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar Diamantes:", error);
          setErro("Não foi possível carregar seu saldo.");
          setDiamantes(0);
          return;
        }

        setDiamantes(Number(data?.["equilíbrio"] ?? 0));
      } catch (error) {
        console.error("Erro inesperado ao carregar Diamantes:", error);
        setErro("Não foi possível carregar seu saldo.");
        setDiamantes(0);
      } finally {
        setCarregando(false);
      }
    }

    carregarDiamantes();
  }, []);

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
              circle at 50% 18%,
              rgba(0, 174, 255, 0.12),
              transparent 34%
            ),
            radial-gradient(
              circle at 15% 80%,
              rgba(0, 94, 255, 0.1),
              transparent 32%
            ),
            linear-gradient(135deg, #06101e 0%, #071b30 50%, #06101e 100%);
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
          min-width: 0;
        }

        .brand-icon {
          font-size: 28px;
          filter: drop-shadow(0 0 10px rgba(0, 204, 255, 0.55));
        }

        .brand-name {
          color: #ffffff;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: 0.4px;
          white-space: nowrap;
        }

        .back-link {
          color: #9bdcff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 700;
          white-space: nowrap;
          transition: 0.2s ease;
        }

        .back-link:hover {
          color: #ffffff;
          text-shadow: 0 0 12px rgba(0, 200, 255, 0.55);
        }

        .content {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
          padding: 58px 0 76px;
        }

        .title-area {
          text-align: center;
          margin-bottom: 42px;
        }

        .title-area h1 {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          font-size: 62px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 1.5px;
          color: #a9e4ff;
          text-shadow:
            0 0 8px rgba(92, 207, 255, 0.95),
            0 0 22px rgba(0, 174, 255, 0.72),
            0 0 42px rgba(0, 132, 255, 0.45);
        }

        .title-diamond {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 58px;
          line-height: 1;
          transform: scaleX(1.08) scaleY(1.04);
          filter:
            drop-shadow(0 0 7px rgba(255, 255, 255, 0.85))
            drop-shadow(0 0 16px rgba(0, 190, 255, 0.85));
        }

        .title-area p {
          max-width: 900px;
          margin: 30px auto 0;
          color: #a9c5db;
          font-size: 20px;
          line-height: 1.7;
        }

        .balance-card {
          position: relative;
          overflow: hidden;
          margin-bottom: 56px;
          padding: 30px 42px;
          border: 1px solid rgba(0, 196, 255, 0.45);
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 85% 50%,
              rgba(0, 178, 255, 0.18),
              transparent 30%
            ),
            rgba(3, 19, 34, 0.78);
          box-shadow:
            0 0 28px rgba(0, 162, 255, 0.12),
            inset 0 0 35px rgba(0, 112, 255, 0.05);
        }

        .balance-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .balance-label {
          color: #a9c5da;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .balance-number {
          display: flex;
          align-items: baseline;
          gap: 12px;
          color: #ffffff;
          font-size: 56px;
          line-height: 1;
          font-weight: 900;
        }

        .balance-number span {
          color: #8edcff;
          font-size: 25px;
          font-weight: 800;
        }

        .balance-icon {
          flex-shrink: 0;
          font-size: 66px;
          line-height: 1;
          transform: scaleX(1.08) scaleY(1.04);
          filter:
            drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))
            drop-shadow(0 0 22px rgba(0, 190, 255, 0.85));
        }

        .balance-loading {
          color: #8edcff;
          font-size: 22px;
          font-weight: 700;
        }

        .balance-error {
          margin-top: 8px;
          color: #ffb5b5;
          font-size: 13px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .card {
          min-width: 0;
          padding: 30px;
          border: 1px solid rgba(92, 181, 255, 0.18);
          border-radius: 24px;
          background: rgba(3, 19, 34, 0.78);
          box-shadow:
            0 12px 35px rgba(0, 0, 0, 0.2),
            inset 0 0 25px rgba(0, 126, 255, 0.025);
        }

        .card h2 {
          margin: 0 0 16px;
          color: #ffffff;
          font-size: 25px;
          font-weight: 800;
        }

        .card-description {
          margin: 0 0 25px;
          color: #9eb9cf;
          font-size: 16px;
          line-height: 1.65;
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
          padding: 28px 20px;
          border: 1px solid rgba(83, 180, 255, 0.2);
          border-radius: 22px;
          background: rgba(5, 26, 45, 0.7);
          transition: 0.25s ease;
        }

        .package:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 200, 255, 0.5);
          box-shadow: 0 0 25px rgba(0, 174, 255, 0.1);
        }

        .package-icon {
          height: 78px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          line-height: 1;
          transform: scaleX(1.08) scaleY(1.04);
          filter:
            drop-shadow(0 0 7px rgba(255, 255, 255, 0.8))
            drop-shadow(0 0 17px rgba(0, 190, 255, 0.8));
        }

        .package h3 {
          margin: 16px 0 8px;
          color: #ffffff;
          font-size: 25px;
          font-weight: 900;
        }

        .package p {
          margin: 0 0 22px;
          color: #91aec5;
          font-size: 16px;
        }

        .buy-button {
          width: 100%;
          border: 0;
          border-radius: 14px;
          padding: 14px 18px;
          background: linear-gradient(135deg, #0799ff, #00c8ff);
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 0 18px rgba(0, 181, 255, 0.2);
          transition: 0.2s ease;
        }

        .buy-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(0, 181, 255, 0.4);
        }

        .usage,
        .history,
        .info {
          min-height: 280px;
        }

        .usage-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid rgba(125, 190, 230, 0.12);
        }

        .usage-item:last-child {
          border-bottom: 0;
        }

        .usage-name {
          color: #c4d8e8;
          font-size: 15px;
        }

        .usage-value {
          color: #77d8ff;
          font-size: 13px;
          font-weight: 700;
        }

        .history-empty {
          padding: 22px 0;
          color: #91aec5;
          font-size: 15px;
          line-height: 1.7;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          color: #a9c3d7;
          font-size: 15px;
          line-height: 1.55;
        }

        .info-item span:first-child {
          flex-shrink: 0;
          font-size: 19px;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 42px;
        }

        .action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 22px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 800;
          transition: 0.2s ease;
        }

        .action-primary {
          color: #ffffff;
          background: linear-gradient(135deg, #078fff, #00c7ff);
          box-shadow: 0 0 20px rgba(0, 174, 255, 0.18);
        }

        .action-secondary {
          color: #9bdcff;
          border: 1px solid rgba(102, 190, 255, 0.25);
          background: rgba(4, 20, 36, 0.65);
        }

        .action:hover {
          transform: translateY(-2px);
        }

        .footer {
          padding: 58px 42px 25px;
          border-top: 1px solid rgba(100, 180, 255, 0.13);
          background: rgba(2, 10, 20, 0.7);
        }

        .footer-inner {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .footer-brand h2 {
          margin: 0 0 8px;
          font-size: 20px;
          color: #ffffff;
        }

        .footer-brand p {
          margin: 0;
          color: #7793a9;
          font-size: 14px;
        }

        .footer-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-top: 38px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-column h3 {
          margin: 0 0 6px;
          color: #ffffff;
          font-size: 15px;
        }

        .footer-column a {
          width: fit-content;
          color: #7896ad;
          text-decoration: none;
          font-size: 14px;
          transition: 0.2s ease;
        }

        .footer-column a:hover {
          color: #a9e5ff;
        }

        .footer-bottom {
          margin-top: 42px;
          padding-top: 20px;
          border-top: 1px solid rgba(125, 190, 230, 0.1);
          color: #5f788d;
          font-size: 13px;
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
            font-size: 42px;
            gap: 10px;
          }

          .title-diamond {
            font-size: 40px;
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

          .title-area h1 {
            font-size: 34px;
            letter-spacing: 1px;
          }

          .title-diamond {
            font-size: 34px;
          }

          .balance-content {
            gap: 10px;
          }

          .balance-icon {
            font-size: 40px;
          }

          .balance-number {
            font-size: 39px;
          }

          .balance-number span {
            font-size: 17px;
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
            <h1>
              <span className="title-diamond">💎</span>
              DIAMANTES
            </h1>

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

                {carregando ? (
                  <div className="balance-loading">
                    Carregando...
                  </div>
                ) : (
                  <div className="balance-number">
                    {diamantes ?? 0}
                    <span>Diamantes</span>
                  </div>
                )}

                {erro && (
                  <div className="balance-error">
                    {erro}
                  </div>
                )}
              </div>

              <div className="balance-icon">💎</div>
            </div>
          </section>

          <div className="grid">
            <section className="card packages">
              <h2>⚡ Adicionar Diamantes</h2>

              <p className="card-description">
                Escolha um pacote de Diamantes para utilizar nas
                ferramentas de criação do CIEL IA STUDIO.
              </p>

              <div className="packages-grid">
                <div className="package">
                  <div className="package-icon">💎</div>

                  <h3>💎 100 Diamantes</h3>

                  <p>Pacote inicial</p>

                  <button
                    className="buy-button"
                    onClick={() =>
                      alert(
                        "A compra de Diamantes será ativada em breve."
                      )
                    }
                  >
                    Comprar
                  </button>
                </div>

                <div className="package">
                  <div className="package-icon">💎</div>

                  <h3>💎 500 Diamantes</h3>

                  <p>Pacote popular</p>

                  <button
                    className="buy-button"
                    onClick={() =>
                      alert(
                        "A compra de Diamantes será ativada em breve."
                      )
                    }
                  >
                    Comprar
                  </button>
                </div>

                <div className="package">
                  <div className="package-icon">💎</div>

                  <h3>💎 1.000 Diamantes</h3>

                  <p>Pacote avançado</p>

                  <button
                    className="buy-button"
                    onClick={() =>
                      alert(
                        "A compra de Diamantes será ativada em breve."
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
              <p>Crie. Transforme. Inove com IA.</p>
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
