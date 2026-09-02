"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CreditosPage() {
  const [diamantes, setDiamantes] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [error, setError] = useState("");

  const carregarSaldo = useCallback(
    async (mostrarCarregamento = true) => {
      if (mostrarCarregamento) {
        setCarregando(true);
      } else {
        setAtualizando(true);
      }

      setError("");

      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Erro ao obter usuário:", userError);
          setError("Não foi possível atualizar o saldo.");
          return;
        }

        const { data, error: creditsError } = await supabase
          .from("credits")
          .select("balance")
          .eq("user_id", user.id)
          .maybeSingle();

        if (creditsError) {
          console.error("Erro ao carregar Diamantes:", creditsError);
          setError("Não foi possível atualizar o saldo.");
          return;
        }

        const saldo = data as {
          balance?: number | string | null;
        } | null;

        setDiamantes(Number(saldo?.balance) || 0);
      } catch (err) {
        console.error("Erro inesperado ao carregar saldo:", err);
        setError("Não foi possível atualizar o saldo.");
      } finally {
        if (mostrarCarregamento) {
          setCarregando(false);
        } else {
          setAtualizando(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    let canal: ReturnType<ReturnType<typeof createClient>["channel"]> | null =
      null;

    const iniciar = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCarregando(false);
        setError("Não foi possível atualizar o saldo.");
        return;
      }

      await carregarSaldo(true);

      canal = supabase
        .channel(`creditos-tempo-real-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "credits",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            carregarSaldo(false);
          }
        )
        .subscribe();
    };

    iniciar();

    return () => {
      if (canal) {
        const supabase = createClient();
        supabase.removeChannel(canal);
      }
    };
  }, [carregarSaldo]);

  const atualizarSaldo = async () => {
    await carregarSaldo(false);
  };

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
          background: #07111f;
          color: #ffffff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .creditos-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(
              circle at 50% 15%,
              rgba(0, 140, 255, 0.12),
              transparent 32%
            ),
            radial-gradient(
              circle at 20% 80%,
              rgba(0, 217, 255, 0.07),
              transparent 30%
            ),
            linear-gradient(145deg, #020711 0%, #07111f 48%, #020712 100%);
          overflow-x: hidden;
        }

        .creditos-header {
          width: 100%;
          padding: 22px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(0, 174, 255, 0.13);
          background: rgba(2, 9, 20, 0.62);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: 0.2px;
          color: #ffffff;
          text-shadow: 0 0 18px rgba(0, 183, 255, 0.25);
        }

        .logo-star {
          font-size: 23px;
          filter: drop-shadow(0 0 8px rgba(0, 183, 255, 0.5));
        }

        .voltar {
          color: #8bdcff;
          font-size: 14px;
          font-weight: 600;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .voltar:hover {
          color: #ffffff;
          transform: translateX(-2px);
        }

        .creditos-main {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 70px 24px 90px;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .titulo-area {
          text-align: center;
          margin-bottom: 38px;
        }

        .titulo-area h1 {
          margin: 0;
          font-size: clamp(28px, 5vw, 44px);
          font-weight: 800;
          letter-spacing: -1px;
          color: #ffffff;
          text-shadow: 0 0 30px rgba(0, 180, 255, 0.16);
        }

        .titulo-area p {
          margin: 12px 0 0;
          color: #8ea6bc;
          font-size: 15px;
        }

        .saldo-card {
          width: min(100%, 540px);
          padding: 38px 28px 34px;
          border-radius: 28px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(57, 190, 255, 0.28);
          background:
            linear-gradient(
              145deg,
              rgba(10, 28, 50, 0.95),
              rgba(4, 14, 28, 0.97)
            );
          box-shadow:
            0 24px 80px rgba(0, 0, 0, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 0 45px rgba(0, 154, 255, 0.07);
          text-align: center;
        }

        .saldo-card::before {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          top: -130px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: rgba(0, 183, 255, 0.15);
          filter: blur(50px);
          pointer-events: none;
        }

        .saldo-label {
          position: relative;
          z-index: 1;
          color: #8fa8be;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .diamante-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 155px;
          margin-bottom: 12px;
        }

        .diamante {
          width: 92px;
          height: 92px;
          position: relative;
          transform: rotate(45deg);
          border-radius: 12px;
          background:
            linear-gradient(
              135deg,
              #dffaff 0%,
              #69dfff 22%,
              #159ee9 48%,
              #0871c7 68%,
              #063d91 100%
            );
          border: 1px solid rgba(194, 247, 255, 0.8);
          box-shadow:
            0 0 24px rgba(0, 193, 255, 0.62),
            0 0 60px rgba(0, 115, 255, 0.24),
            inset -10px -12px 20px rgba(0, 34, 105, 0.38),
            inset 9px 9px 17px rgba(255, 255, 255, 0.42);
          animation: brilhoDiamante 3s ease-in-out infinite;
        }

        .diamante::before,
        .diamante::after {
          content: "";
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(220, 250, 255, 0.42);
          transform: rotate(0deg);
        }

        .diamante::after {
          inset: 24px;
          border-color: rgba(220, 250, 255, 0.28);
        }

        @keyframes brilhoDiamante {
          0%,
          100% {
            filter: brightness(1);
          }

          50% {
            filter: brightness(1.18);
          }
        }

        .saldo-valor {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 8px;
          margin-top: 4px;
        }

        .numero {
          font-size: clamp(40px, 8vw, 58px);
          line-height: 1;
          font-weight: 900;
          letter-spacing: -2px;
          color: #ffffff;
          text-shadow: 0 0 24px rgba(0, 187, 255, 0.25);
        }

        .nome-moeda {
          font-size: 17px;
          font-weight: 700;
          color: #69d9ff;
        }

        .atualizar {
          position: relative;
          z-index: 1;
          margin-top: 24px;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(76, 198, 255, 0.24);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(16, 42, 69, 0.6);
          color: #80ddff;
          cursor: pointer;
          font-size: 22px;
          transition:
            background 0.2s ease,
            transform 0.2s ease,
            border-color 0.2s ease;
        }

        .atualizar:hover {
          background: rgba(20, 65, 100, 0.75);
          border-color: rgba(76, 198, 255, 0.5);
          transform: scale(1.06);
        }

        .atualizar:disabled {
          cursor: default;
          opacity: 0.7;
        }

        .girando {
          animation: girar 0.8s linear infinite;
        }

        @keyframes girar {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .erro {
          position: relative;
          z-index: 1;
          margin: 18px auto 0;
          max-width: 380px;
          padding: 11px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 90, 90, 0.2);
          background: rgba(120, 20, 20, 0.12);
          color: #ff9b9b;
          font-size: 13px;
        }

        .carregando {
          position: relative;
          z-index: 1;
          color: #81a5bd;
          font-size: 14px;
          margin-top: 10px;
        }

        .acoes {
          width: min(100%, 540px);
          margin-top: 22px;
          display: flex;
          justify-content: center;
        }

        .botao-comprar {
          width: 100%;
          min-height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 750;
          color: #ffffff;
          border: 1px solid rgba(50, 190, 255, 0.34);
          background:
            linear-gradient(
              135deg,
              rgba(0, 153, 255, 0.25),
              rgba(0, 93, 190, 0.17)
            );
          box-shadow:
            0 10px 30px rgba(0, 104, 190, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .botao-comprar:hover {
          transform: translateY(-2px);
          border-color: rgba(50, 205, 255, 0.6);
          background:
            linear-gradient(
              135deg,
              rgba(0, 170, 255, 0.32),
              rgba(0, 105, 210, 0.22)
            );
        }

        .informacao {
          width: min(100%, 760px);
          margin-top: 55px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .info-card {
          min-height: 150px;
          padding: 22px 18px;
          border-radius: 20px;
          border: 1px solid rgba(75, 170, 220, 0.12);
          background: rgba(7, 21, 38, 0.64);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025);
          text-align: center;
        }

        .info-icon {
          font-size: 26px;
          margin-bottom: 10px;
        }

        .info-card h3 {
          margin: 0 0 8px;
          font-size: 14px;
          color: #d9f4ff;
        }

        .info-card p {
          margin: 0;
          color: #8299ad;
          font-size: 12px;
          line-height: 1.55;
        }

        .creditos-footer {
          width: 100%;
          padding: 22px 24px;
          display: flex;
          justify-content: center;
          border-top: 1px solid rgba(0, 174, 255, 0.1);
          background: rgba(2, 8, 17, 0.7);
        }

        .footer-link {
          color: #6fdcff;
          font-size: 13px;
          font-weight: 650;
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: #ffffff;
        }

        @media (max-width: 700px) {
          .creditos-header {
            padding: 18px 18px;
          }

          .logo {
            font-size: 18px;
          }

          .logo-star {
            font-size: 20px;
          }

          .voltar {
            font-size: 12px;
          }

          .creditos-main {
            padding: 50px 16px 70px;
          }

          .titulo-area {
            margin-bottom: 28px;
          }

          .titulo-area h1 {
            font-size: 30px;
          }

          .saldo-card {
            padding: 30px 20px 28px;
            border-radius: 24px;
          }

          .informacao {
            grid-template-columns: 1fr;
            margin-top: 38px;
          }

          .info-card {
            min-height: auto;
          }
        }

        @media (max-width: 430px) {
          .creditos-header {
            gap: 10px;
          }

          .logo {
            font-size: 16px;
          }

          .voltar {
            font-size: 11px;
          }

          .diamante {
            width: 82px;
            height: 82px;
          }

          .numero {
            font-size: 46px;
          }
        }
      `}</style>

      <div className="creditos-page">
        <header className="creditos-header">
          <div className="logo">
            <span className="logo-star">✨</span>
            <span>CIEL IA STUDIO</span>
          </div>

          <Link href="/dashboard" className="voltar">
            ← Voltar ao Dashboard
          </Link>
        </header>

        <main className="creditos-main">
          <div className="titulo-area">
            <h1>💎 Diamantes</h1>
            <p>Use seus Diamantes para criar conteúdos com IA.</p>
          </div>

          <section className="saldo-card">
            <div className="saldo-label">Seu saldo disponível</div>

            <div className="diamante-wrapper">
              <div className="diamante" />
            </div>

            <div className="saldo-valor">
              {carregando ? (
                <span className="carregando">Carregando...</span>
              ) : (
                <>
                  <span className="numero">{diamantes}</span>
                  <span className="nome-moeda">Diamantes</span>
                </>
              )}
            </div>

            <button
              type="button"
              className="atualizar"
              onClick={atualizarSaldo}
              disabled={carregando || atualizando}
              aria-label="Atualizar saldo"
              title="Atualizar saldo"
            >
              <span className={atualizando ? "girando" : ""}>↻</span>
            </button>

            {error && <div className="erro">{error}</div>}
          </section>

          <div className="acoes">
            <Link href="/creditos/comprar" className="botao-comprar">
              💎 Comprar Diamantes
            </Link>
          </div>

          <section className="informacao">
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <h3>Criações com IA</h3>
              <p>
                Utilize seus Diamantes para gerar imagens, vídeos e outros
                conteúdos.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">🔒</div>
              <h3>Saldo seguro</h3>
              <p>
                Seu saldo fica vinculado à sua conta e é atualizado diretamente
                pelo sistema.
              </p>
            </div>

            <div className="info-card">
              <div className="info-icon">🔄</div>
              <h3>Atualização em tempo real</h3>
              <p>
                Alterações no seu saldo podem aparecer automaticamente nesta
                página.
              </p>
            </div>
          </section>
        </main>

        <footer className="creditos-footer">
          <Link href="/creditos" className="footer-link">
            💎 Diamantes
          </Link>
        </footer>
      </div>
    </>
  );
}
