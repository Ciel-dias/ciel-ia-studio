"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CreditosPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const supabase = createClient();

  const carregarDiamantes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setCredits(0);
        setError("Usuário não autenticado.");
        return;
      }

      const { data, error: creditsError } = await supabase
        .from("créditos")
        .select("equilíbrio")
        .eq("usuario_id", user.id)
        .maybeSingle();

      if (creditsError) {
        console.error("Erro ao buscar Diamantes:", creditsError);

        setCredits(0);
        setError("Não foi possível carregar seu saldo.");
        return;
      }

      if (!data) {
        setCredits(0);
        return;
      }

      setCredits(Number(data["equilíbrio"] ?? 0));
    } catch (err) {
      console.error("Erro inesperado:", err);

      setCredits(0);
      setError("Não foi possível carregar seu saldo.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    carregarDiamantes();

    const atualizarAoVoltar = () => {
      carregarDiamantes();
    };

    window.addEventListener("focus", atualizarAoVoltar);

    return () => {
      window.removeEventListener("focus", atualizarAoVoltar);
    };
  }, [carregarDiamantes]);

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
              circle at 50% 20%,
              rgba(0, 140, 255, 0.13),
              transparent 35%
            ),
            radial-gradient(
              circle at 50% 70%,
              rgba(0, 90, 180, 0.12),
              transparent 40%
            ),
            linear-gradient(
              180deg,
              #06101e 0%,
              #071b2d 48%,
              #06101e 100%
            );
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
          padding: 0 42px;
          background: rgba(4, 12, 24, 0.92);
          border-bottom: 1px solid rgba(100, 180, 255, 0.18);
          backdrop-filter: blur(12px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon {
          font-size: 28px;
          line-height: 1;
        }

        .brand-name {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: 0.3px;
          color: #ffffff;
        }

        .back-link {
          color: #8fd5ff;
          text-decoration: none;
          font-size: 17px;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .back-link:hover {
          color: #ffffff;
          text-shadow: 0 0 12px rgba(80, 190, 255, 0.7);
        }

        /* =========================
           CONTEÚDO
        ========================= */

        .content {
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
          padding: 58px 0 76px;
        }

        .title-area {
          text-align: center;
          margin-bottom: 48px;
        }

        .title-area h1 {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          font-size: 56px;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: 1px;
          color: #a8e5ff;
          text-shadow:
            0 0 8px rgba(80, 200, 255, 0.75),
            0 0 22px rgba(40, 150, 255, 0.55),
            0 0 42px rgba(40, 130, 255, 0.28);
        }

        .title-diamond {
          width: 58px;
          height: 58px;
          object-fit: contain;
          filter:
            drop-shadow(0 0 5px rgba(180, 240, 255, 0.95))
            drop-shadow(0 0 14px rgba(80, 200, 255, 0.8));
          transform: scaleX(1.08);
        }

        .title-area p {
          max-width: 920px;
          margin: 28px auto 0;
          color: #a9bfd2;
          font-size: 21px;
          line-height: 1.65;
        }

        /* =========================
           SALDO
        ========================= */

        .balance-card {
          position: relative;
          overflow: hidden;
          margin-bottom: 56px;
          padding: 30px 38px;
          border: 1px solid rgba(0, 191, 255, 0.38);
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 85% 50%,
              rgba(0, 160, 255, 0.14),
              transparent 30%
            ),
            rgba(4, 22, 38, 0.88);
          box-shadow:
            0 0 25px rgba(0, 150, 255, 0.08),
            inset 0 0 30px rgba(0, 120, 255, 0.035);
        }

        .balance-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .balance-label {
          margin-bottom: 12px;
          color: #9db5c9;
          font-size: 19px;
        }

        .balance-number {
          font-size: 58px;
          line-height: 1;
          font-weight: 900;
          color: #ffffff;
        }

        .balance-number span {
          font-size: 25px;
          font-weight: 800;
          color: #75d1ff;
        }

        .balance-icon {
          width: 82px;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 68px;
          line-height: 1;
          filter:
            drop-shadow(0 0 7px rgba(210, 245, 255, 1))
            drop-shadow(0 0 18px rgba(60, 190, 255, 0.8));
          transform: scaleX(1.08);
        }

        /* =========================
           GRID
        ========================= */

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .card {
          min-width: 0;
          padding: 28px;
          border: 1px solid rgba(100, 180, 255, 0.17);
          border-radius: 22px;
          background: rgba(4, 21, 36, 0.86);
          box-shadow:
            0 12px 35px rgba(0, 0, 0, 0.18),
            inset 0 0 30px rgba(0, 110, 220, 0.025);
        }

        .card h2 {
          margin: 0 0 16px;
          color: #ffffff;
          font-size: 25px;
          font-weight: 800;
        }

        .card-description {
          margin: 0 0 26px;
          color: #91a9bd;
          font-size: 16px;
          line-height: 1.65;
        }

        /* =========================
           PACOTES
        ========================= */

        .packages {
          grid-column: span 3;
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .package {
          position: relative;
          text-align: center;
          padding: 30px 20px 24px;
          border: 1px solid rgba(70, 170, 255, 0.2);
          border-radius: 20px;
          background: rgba(5, 26, 43, 0.8);
          transition: 0.2s ease;
        }

        .package:hover {
          transform: translateY(-3px);
          border-color: rgba(50, 190, 255, 0.55);
          box-shadow: 0 10px 30px rgba(0, 140, 255, 0.12);
        }

        .package-icon {
          width: 82px;
          height: 82px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 66px;
          line-height: 1;
          filter:
            drop-shadow(0 0 5px rgba(220, 250, 255, 0.95))
            drop-shadow(0 0 15px rgba(50, 180, 255, 0.75));
          transform: scaleX(1.08);
        }

        .package h3 {
          margin: 0;
          font-size: 25px;
          font-weight: 900;
          color: #ffffff;
        }

        .package p {
          margin: 9px 0 22px;
          color: #94aabd;
          font-size: 16px;
        }

        .buy-button {
          width: 100%;
          min-height: 50px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            #009cff,
            #00bfff
          );
          color: #ffffff;
          font-size: 17px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(0, 160, 255, 0.18);
        }

        .buy-button:hover {
          filter: brightness(1.08);
        }

        /* =========================
           USO
        ========================= */

        .usage {
          grid-column: span 1;
        }

        .usage-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(100, 180, 255, 0.1);
        }

        .usage-item:last-child {
          border-bottom: 0;
        }

        .usage-name {
          color: #d9e8f5;
          font-size: 15px;
        }

        .usage-value {
          color: #73ceff;
          font-size: 14px;
          font-weight: 700;
        }

        /* =========================
           HISTÓRICO
        ========================= */

        .history {
          grid-column: span 1;
        }

        .history-empty {
          padding: 20px;
          border-radius: 15px;
          background: rgba(0, 100, 180, 0.055);
          color: #91a9bd;
          font-size: 15px;
          line-height: 1.65;
          text-align: center;
        }

        /* =========================
           INFORMAÇÕES
        ========================= */

        .info {
          grid-column: span 1;
        }

        .info-item {
          display: flex;
          gap: 13px;
          align-items: flex-start;
          padding: 13px 0;
          color: #a7bbcc;
          font-size: 15px;
          line-height: 1.55;
        }

        .info-item > span:first-child {
          flex-shrink: 0;
        }

        /* =========================
           AÇÕES
        ========================= */

        .actions {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 44px;
        }

        .action {
          min-width: 220px;
          padding: 15px 22px;
          border-radius: 12px;
          text-align: center;
          text-decoration: none;
          font-weight: 800;
          font-size: 16px;
        }

        .action-primary {
          color: #ffffff;
          background: linear-gradient(
            135deg,
            #008ff0,
            #00b9ff
          );
          box-shadow: 0 8px 25px rgba(0, 150, 255, 0.16);
        }

        .action-secondary {
          color: #9bdcff;
          border: 1px solid rgba(80, 190, 255, 0.28);
          background: rgba(5, 24, 41, 0.7);
        }

        /* =========================
           RODAPÉ COMPLETO
        ========================= */

        .footer {
          padding: 55px 42px 25px;
          border-top: 1px solid rgba(100, 180, 255, 0.12);
          background: rgba(3, 12, 23, 0.96);
        }

        .footer-inner {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .footer-brand {
          margin-bottom: 10px;
        }

        .footer-brand h2 {
          margin: 0;
          font-size: 22px;
          color: #ffffff;
          font-weight: 900;
          letter-spacing: 0.3px;
        }

        .footer-brand p {
          margin: 8px 0 30px;
          color: #7992a7;
          font-size: 14px;
        }

        .footer-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 35px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-column h3 {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
        }

        .footer-column a {
          color: #7892a7;
          text-decoration: none;
          font-size: 14px;
          line-height: 1.5;
          transition: 0.2s ease;
        }

        .footer-column a:hover {
          color: #8edbff;
          transform: translateX(2px);
          text-shadow: 0 0 10px rgba(60, 190, 255, 0.35);
        }

        .footer-bottom {
          margin-top: 35px;
          padding-top: 20px;
          border-top: 1px solid rgba(100, 180, 255, 0.1);
          color: #60788c;
          font-size: 13px;
          text-align: center;
        }

        /* =========================
           ESTADOS
        ========================= */

        .loading-balance {
          display: inline-block;
          min-width: 90px;
          color: #a9dfff;
          animation: pulseBalance 1.2s ease-in-out infinite;
        }

        @keyframes pulseBalance {
          0%,
          100% {
            opacity: 0.45;
          }

          50% {
            opacity: 1;
          }
        }

        .balance-error {
          margin-top: 10px;
          color: #ff9a9a;
          font-size: 13px;
        }

        /* =========================
           TABLET
        ========================= */

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

          .usage,
          .history,
          .info {
            grid-column: span 1;
          }
        }

        /* =========================
           MOBILE
        ========================= */

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

          .title-area {
            margin-bottom: 38px;
          }

          .title-area h1 {
            font-size: 40px;
            gap: 11px;
          }

          .title-diamond {
            width: 45px;
            height: 45px;
          }

          .title-area p {
            font-size: 16px;
            line-height: 1.7;
          }

          .balance-card {
            padding: 23px;
            border-radius: 19px;
          }

          .balance-content {
            align-items: center;
          }

          .balance-icon {
            width: 65px;
            height: 65px;
            font-size: 52px;
          }

          .balance-number {
            font-size: 48px;
          }

          .balance-number span {
            font-size: 20px;
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

          .usage,
          .history,
          .info {
            grid-column: span 1;
          }

          .actions {
            flex-direction: column;
          }

          .action {
            width: 100%;
          }

          .footer {
            padding: 42px 24px 22px;
          }

          .footer-columns {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        /* =========================
           MOBILE PEQUENO
        ========================= */

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
            width: 53px;
            height: 53px;
            font-size: 43px;
          }

          .balance-number {
            font-size: 42px;
          }

          .balance-number span {
            font-size: 18px;
          }

          .title-area h1 {
            font-size: 34px;
          }

          .title-diamond {
            width: 40px;
            height: 40px;
          }

          .footer {
            padding-left: 18px;
            padding-right: 18px;
          }

          .footer-brand h2 {
            font-size: 19px;
          }
        }
      `}</style>

      <main className="page">
        {/* =========================
            TOPO
        ========================= */}

        <header className="topbar">
          <div className="brand">
            <span className="brand-icon">✨</span>

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
              <span>💎</span>

              <span>
                DIAMANTES
              </span>
            </h1>

            <p>
              Gerencie seus Diamantes e acompanhe o uso das
              ferramentas de inteligência artificial do
              CIEL IA STUDIO.
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
                  {loading ? (
                    <span className="loading-balance">
                      ...
                    </span>
                  ) : (
                    <>
                      {credits ?? 0}{" "}

                      <span>
                        {credits === 1
                          ? "Diamante"
                          : "Diamantes"}
                      </span>
                    </>
                  )}
                </div>

                {error && (
                  <div className="balance-error">
                    {error}
                  </div>
                )}
              </div>

              <div className="balance-icon">
                💎
              </div>
            </div>
          </section>

          {/* =========================
              CARDS
          ========================= */}

          <div className="grid">
            {/* PACOTES */}

            <section className="card packages">
              <h2>
                ⚡ Adicionar Diamantes
              </h2>

              <p className="card-description">
                Escolha um pacote de Diamantes para utilizar
                nas ferramentas de criação do CIEL IA STUDIO.
              </p>

              <div className="packages-grid">
                {/* 100 */}

                <div className="package">
                  <div className="package-icon">
                    💎
                  </div>

                  <h3>
                    💎 100 Diamantes
                  </h3>

                  <p>
                    Pacote inicial
                  </p>

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

                {/* 500 */}

                <div className="package">
                  <div className="package-icon">
                    💎
                  </div>

                  <h3>
                    💎 500 Diamantes
                  </h3>

                  <p>
                    Pacote popular
                  </p>

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

                {/* 1000 */}

                <div className="package">
                  <div className="package-icon">
                    💎
                  </div>

                  <h3>
                    💎 1.000 Diamantes
                  </h3>

                  <p>
                    Pacote avançado
                  </p>

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

            {/* USO */}

            <section className="card usage">
              <h2>
                📊 Uso dos Diamantes
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
                📋 Nenhuma movimentação registrada ainda.
                <br />
                Quando você utilizar ou adicionar Diamantes,
                seu histórico aparecerá aqui.
              </div>
            </section>

            {/* INFORMAÇÕES */}

            <section className="card info">
              <h2>
                💡 Como funcionam os Diamantes
              </h2>

              <div className="info-item">
                <span>
                  💎
                </span>

                <span>
                  Seus Diamantes são utilizados para acessar
                  as ferramentas de inteligência artificial.
                </span>
              </div>

              <div className="info-item">
                <span>
                  ⚡
                </span>

                <span>
                  Cada ferramenta poderá ter um custo
                  diferente de Diamantes.
                </span>
              </div>

              <div className="info-item">
                <span>
                  🔒
                </span>

                <span>
                  Seu saldo fica associado à sua conta.
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

        {/* ==================================================
            RODAPÉ COMPLETO DO CIEL IA STUDIO
        ================================================== */}

        <footer className="footer">
          <div className="footer-inner">

            {/* MARCA */}

            <div className="footer-brand">
              <h2>
                CIEL IA STUDIO
              </h2>

              <p>
                Crie. Transforme. Inove com IA.
              </p>
            </div>

            {/* COLUNAS */}

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

                <Link href="/creditos">
                  💎 Diamantes
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

            {/* COPYRIGHT */}

            <div className="footer-bottom">
              © 2026 CIEL IA STUDIO. Todos os direitos reservados.
            </div>

          </div>
        </footer>
      </main>
    </>
  );
}
