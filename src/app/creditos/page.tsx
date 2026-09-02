"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";
import Diamond from "@/components/Diamond";

export const dynamic = "force-dynamic";

type Package = {
  name: string;
  diamonds: number;
  price: string;
  description: string;
  popular?: boolean;
};

const packages: Package[] = [
  {
    name: "Essencial",
    diamonds: 100,
    price: "R$ 9,90",
    description:
      "Ideal para começar suas criações.",
  },
  {
    name: "Profissional",
    diamonds: 500,
    price: "R$ 44,90",
    description:
      "Para quem cria com frequência.",
    popular: true,
  },
  {
    name: "Avançado",
    diamonds: 1000,
    price: "R$ 79,90",
    description:
      "Mais liberdade para criar.",
  },
  {
    name: "Premium",
    diamonds: 2500,
    price: "R$ 179,90",
    description:
      "Para criadores que precisam de mais.",
  },
];

export default function CreditosPage() {
  const supabase = createClient();

  const [diamantes, setDiamantes] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [userId, setUserId] =
    useState<string | null>(null);

  // ==========================================
  // CARREGAR SALDO REAL
  // ==========================================

  const carregarSaldo = useCallback(
    async (mostrarLoading = false) => {
      try {
        if (mostrarLoading) {
          setRefreshing(true);
        }

        setError("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          window.location.replace("/login");
          return;
        }

        setUserId(user.id);

        const {
          data,
          error: creditsError,
        } = await supabase
          .from("créditos")
          .select("equilíbrio")
          .eq("usuario_id", user.id)
          .maybeSingle();

        if (creditsError) {
          console.error(
            "Erro ao carregar Diamantes:",
            creditsError
          );

          setDiamantes(0);
          setError(
            "Não foi possível atualizar o saldo."
          );

          return;
        }

        const saldo = data as {
          equilíbrio?: number | string | null;
        } | null;

        setDiamantes(
          Number(saldo?.equilíbrio) || 0
        );
      } catch (err) {
        console.error(
          "Erro ao carregar saldo:",
          err
        );

        setDiamantes(0);

        setError(
          "Não foi possível carregar seu saldo."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [supabase]
  );

  // ==========================================
  // CARREGAMENTO INICIAL
  // ==========================================

  useEffect(() => {
    carregarSaldo();
  }, [carregarSaldo]);

  // ==========================================
  // ATUALIZAÇÃO EM TEMPO REAL
  // ==========================================

  useEffect(() => {
    if (!userId) {
      return;
    }

    const channel = supabase
      .channel(
        `creditos-tempo-real-${userId}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "créditos",
          filter: `usuario_id=eq.${userId}`,
        },
        () => {
          carregarSaldo(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, carregarSaldo, supabase]);

  // ==========================================
  // COMPRAR
  // ==========================================

  function handleBuy(
    pacote: Package
  ) {
    alert(
      `Compra de ${pacote.diamonds.toLocaleString(
        "pt-BR"
      )} Diamantes será ativada em breve.`
    );
  }

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
          font-family:
            Arial,
            Helvetica,
            sans-serif;
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
              circle at 80% 12%,
              rgba(20, 119, 190, 0.28),
              transparent 34%
            ),
            radial-gradient(
              circle at 15% 48%,
              rgba(15, 76, 125, 0.2),
              transparent 38%
            ),
            linear-gradient(
              135deg,
              #06101e 0%,
              #081a30 48%,
              #0b3556 100%
            );

          overflow-x: hidden;
        }

        /* =====================================
           CABEÇALHO PADRÃO DAS PÁGINAS
        ====================================== */

        .topbar {
          width: 100%;
          min-height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 42px;

          gap: 20px;

          background:
            rgba(4, 12, 24, 0.9);

          border-bottom:
            1px solid
            rgba(100, 180, 255, 0.18);

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
          line-height: 1;
        }

        .brand-name {
          color: #ffffff;

          font-size: 20px;
          font-weight: 800;

          letter-spacing: 0.4px;
        }

        .back {
          display: flex;
          align-items: center;

          color: #8fd8ff;

          text-decoration: none;

          font-size: 15px;
          font-weight: 700;

          white-space: nowrap;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .back:hover {
          color: #c4efff;

          text-shadow:
            0 0 12px
            rgba(75, 199, 255, 0.75);

          transform:
            translateX(-2px);
        }

        /* =====================================
           CONTEÚDO
        ====================================== */

        .content {
          width:
            min(
              1180px,
              calc(100% - 48px)
            );

          margin: 0 auto;

          padding:
            58px 0 80px;
        }

        /* =====================================
           TÍTULO
        ====================================== */

        .title-area {
          text-align: center;

          margin-bottom: 48px;
        }

        .main-title {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 18px;

          margin: 0;

          font-size:
            clamp(
              38px,
              6vw,
              58px
            );

          font-weight: 900;

          letter-spacing: 2px;

          color: #ffffff;
        }

        .title-diamond {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 74px;
          height: 74px;

          filter:
            drop-shadow(
              0 0 10px
              rgba(80, 205, 255, 0.8)
            )
            drop-shadow(
              0 0 25px
              rgba(50, 180, 255, 0.45)
            );
        }

        .title-word {
          background:
            linear-gradient(
              90deg,
              #dff8ff 0%,
              #82dcff 45%,
              #24baff 100%
            );

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;

          text-shadow:
            0 0 18px
            rgba(70, 200, 255, 0.35);
        }

        .subtitle {
          max-width: 760px;

          margin:
            18px auto 0;

          color: #aebfd1;

          font-size: 18px;

          line-height: 1.65;
        }

        /* =====================================
           SALDO
        ====================================== */

        .balance-card {
          position: relative;

          padding: 28px 34px;

          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              rgba(10, 43, 68, 0.88),
              rgba(5, 25, 42, 0.95)
            );

          border:
            2px solid
            rgba(37, 185, 255, 0.45);

          box-shadow:
            0 0 10px
              rgba(36, 188, 255, 0.2),
            0 0 35px
              rgba(21, 134, 205, 0.15),
            inset 0 0 30px
              rgba(35, 185, 255, 0.04);

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 30px;

          margin-bottom: 62px;

          overflow: hidden;
        }

        .balance-card::before {
          content: "";

          position: absolute;

          width: 240px;
          height: 240px;

          right: 20px;
          top: 50%;

          transform:
            translateY(-50%);

          background:
            radial-gradient(
              circle,
              rgba(45, 190, 255, 0.14),
              transparent 70%
            );

          pointer-events: none;
        }

        .balance-content {
          position: relative;
          z-index: 1;
        }

        .balance-label {
          margin-bottom: 7px;

          color: #aebfd1;

          font-size: 16px;
        }

        .balance-value {
          display: flex;

          align-items: baseline;

          gap: 10px;
        }

        .balance-number {
          font-size: 52px;

          line-height: 1;

          font-weight: 900;

          color: #ffffff;
        }

        .balance-word {
          font-size: 23px;

          font-weight: 800;

          color: #66d5ff;
        }

        .balance-right {
          position: relative;

          z-index: 1;

          display: flex;

          align-items: center;

          gap: 22px;
        }

        .balance-diamond {
          width: 82px;
          height: 82px;

          display: flex;

          align-items: center;
          justify-content: center;

          filter:
            drop-shadow(
              0 0 12px
              rgba(70, 215, 255, 0.9)
            )
            drop-shadow(
              0 0 30px
              rgba(50, 180, 255, 0.5)
            );
        }

        .refresh-button {
          width: 56px;
          height: 56px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 15px;

          border:
            1px solid
            rgba(77, 204, 255, 0.28);

          background:
            rgba(40, 140, 190, 0.08);

          color: #69d7ff;

          font-size: 27px;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .refresh-button:hover {
          transform:
            rotate(25deg);

          background:
            rgba(60, 180, 235, 0.14);

          border-color:
            rgba(90, 215, 255, 0.55);
        }

        .refresh-button:disabled {
          opacity: 0.5;

          cursor: wait;

          transform: none;
        }

        .refreshing {
          animation:
            spin 0.8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* =====================================
           SEÇÃO DE PACOTES
        ====================================== */

        .section-heading {
          margin-bottom: 30px;
        }

        .section-label {
          margin-bottom: 10px;

          color: #54c9f4;

          font-size: 14px;
          font-weight: 900;

          letter-spacing: 2px;

          text-transform: uppercase;
        }

        .section-heading h2 {
          margin: 0;

          color: #ffffff;

          font-size:
            clamp(
              28px,
              4vw,
              38px
            );

          line-height: 1.2;
        }

        .section-heading p {
          max-width: 720px;

          margin:
            14px 0 0;

          color: #91a6ba;

          font-size: 17px;

          line-height: 1.6;
        }

        /* =====================================
           PACOTES
        ====================================== */

        .packages-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 22px;
        }

        .package-card {
          position: relative;

          min-height: 445px;

          display: flex;

          flex-direction: column;

          align-items: center;

          padding: 30px 24px 26px;

          border-radius: 22px;

          background:
            linear-gradient(
              145deg,
              rgba(10, 34, 55, 0.96),
              rgba(5, 22, 38, 0.98)
            );

          border:
            1px solid
            rgba(76, 184, 235, 0.22);

          box-shadow:
            0 12px 35px
              rgba(0, 0, 0, 0.18),
            inset 0 0 30px
              rgba(50, 175, 235, 0.025);

          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .package-card:hover {
          transform:
            translateY(-5px);

          border-color:
            rgba(76, 202, 255, 0.48);

          box-shadow:
            0 16px 40px
              rgba(0, 0, 0, 0.25),
            0 0 22px
              rgba(40, 170, 230, 0.12);
        }

        .package-card.popular {
          border:
            2px solid
            rgba(56, 197, 255, 0.72);

          box-shadow:
            0 0 15px
              rgba(40, 190, 255, 0.2),
            0 16px 45px
              rgba(0, 0, 0, 0.2);
        }

        .popular-badge {
          position: absolute;

          top: -13px;

          left: 50%;

          transform:
            translateX(-50%);

          padding:
            6px 15px;

          border-radius: 30px;

          background:
            linear-gradient(
              90deg,
              #169cf0,
              #20c4f5
            );

          color: #ffffff;

          font-size: 11px;
          font-weight: 900;

          letter-spacing: 0.7px;

          text-transform: uppercase;

          box-shadow:
            0 0 15px
            rgba(30, 190, 255, 0.45);

          white-space: nowrap;
        }

        .package-diamond {
          width: 104px;
          height: 104px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin:
            8px 0 17px;

          filter:
            drop-shadow(
              0 0 10px
              rgba(75, 210, 255, 0.8)
            )
            drop-shadow(
              0 0 25px
              rgba(45, 180, 255, 0.35)
            );
        }

        .package-name {
          margin: 0 0 12px;

          color: #9db0c3;

          font-size: 14px;
          font-weight: 900;

          letter-spacing: 2px;

          text-transform: uppercase;
        }

        .package-amount {
          display: flex;

          align-items: baseline;

          justify-content: center;

          gap: 7px;

          margin-bottom: 12px;

          text-align: center;
        }

        .package-amount-number {
          color: #ffffff;

          font-size: 31px;
          font-weight: 900;
        }

        .package-amount-word {
          color: #55cfff;

          font-size: 14px;
          font-weight: 800;
        }

        .package-price {
          margin:
            4px 0 12px;

          color: #ffffff;

          font-size: 29px;
          font-weight: 900;
        }

        .package-description {
          min-height: 52px;

          margin: 0;

          color: #8fa3b7;

          font-size: 14px;

          line-height: 1.55;

          text-align: center;
        }

        .buy-button {
          width: 100%;

          margin-top: auto;

          padding: 14px 18px;

          border-radius: 13px;

          border:
            1px solid
            rgba(51, 197, 255, 0.5);

          background:
            linear-gradient(
              90deg,
              #078ff0,
              #16c0ed
            );

          color: #ffffff;

          font-size: 15px;
          font-weight: 900;

          cursor: pointer;

          box-shadow:
            0 0 14px
            rgba(30, 178, 245, 0.2);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .buy-button:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 0 22px
            rgba(30, 190, 255, 0.35);
        }

        /* =====================================
           INFORMAÇÕES
        ====================================== */

        .info-card {
          margin-top: 52px;

          padding: 28px;

          display: flex;

          align-items: flex-start;

          gap: 22px;

          border-radius: 20px;

          background:
            rgba(7, 28, 46, 0.72);

          border:
            1px solid
            rgba(74, 174, 225, 0.2);
        }

        .info-icon {
          flex: 0 0 auto;

          width: 58px;
          height: 58px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          border:
            1px solid
            rgba(69, 198, 255, 0.3);

          background:
            rgba(35, 158, 215, 0.08);

          color: #61d3ff;

          font-size: 28px;
          font-weight: 900;
        }

        .info-content h3 {
          margin:
            2px 0 9px;

          color: #ffffff;

          font-size: 19px;
        }

        .info-content p {
          margin: 0;

          color: #8fa4b8;

          font-size: 14px;

          line-height: 1.7;
        }

        /* =====================================
           MENSAGEM DE ERRO
        ====================================== */

        .error-box {
          margin:
            -38px 0 38px;

          padding: 13px 16px;

          border-radius: 12px;

          background:
            rgba(220, 70, 70, 0.1);

          border:
            1px solid
            rgba(255, 100, 100, 0.28);

          color: #ffb5b5;

          font-size: 13px;

          text-align: center;
        }

        /* =====================================
           FOOTER PADRÃO
        ====================================== */

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

          color: #ffffff;

          font-size: 24px;
          font-weight: 800;
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

          color: #ffffff;

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

        .footer-diamond-link {
          display: flex !important;

          align-items: center;

          gap: 5px;
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

        /* =====================================
           TABLET
        ====================================== */

        @media (max-width: 1050px) {
          .packages-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 850px) {
          .topbar {
            padding: 0 22px;
          }

          .content {
            width:
              min(
                720px,
                calc(100% - 36px)
              );
          }

          .balance-card {
            padding: 24px;
          }

          .footer {
            padding-left: 28px;
            padding-right: 28px;
          }
        }

        /* =====================================
           MOBILE
        ====================================== */

        @media (max-width: 650px) {
          .topbar {
            min-height: 68px;

            padding:
              0 16px;

            gap: 12px;
          }

          .brand {
            gap: 8px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .brand-name {
            font-size: 16px;
          }

          .back {
            font-size: 13px;
          }

          .content {
            width:
              calc(100% - 28px);

            padding:
              42px 0 60px;
          }

          .title-area {
            margin-bottom: 35px;
          }

          .main-title {
            gap: 11px;

            font-size: 34px;

            letter-spacing: 1px;
          }

          .title-diamond {
            width: 56px;
            height: 56px;
          }

          .subtitle {
            margin-top: 15px;

            font-size: 16px;

            line-height: 1.7;
          }

          .balance-card {
            padding: 20px;

            border-radius: 19px;

            gap: 14px;
          }

          .balance-label {
            font-size: 14px;
          }

          .balance-number {
            font-size: 40px;
          }

          .balance-word {
            font-size: 19px;
          }

          .balance-right {
            gap: 10px;
          }

          .balance-diamond {
            width: 62px;
            height: 62px;
          }

          .refresh-button {
            width: 48px;
            height: 48px;

            border-radius: 13px;

            font-size: 23px;
          }

          .section-heading h2 {
            font-size: 29px;
          }

          .section-heading p {
            font-size: 16px;
          }

          .packages-grid {
            grid-template-columns: 1fr;

            gap: 18px;
          }

          .package-card {
            min-height: 430px;

            padding:
              30px 24px 25px;
          }

          .info-card {
            padding: 22px;

            gap: 16px;
          }

          .info-icon {
            width: 50px;
            height: 50px;

            font-size: 23px;
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

        @media (max-width: 430px) {
          .topbar {
            padding:
              14px 10px;
          }

          .brand-name {
            font-size: 15px;
          }

          .back {
            font-size: 12px;
          }

          .main-title {
            font-size: 31px;
          }

          .title-diamond {
            width: 50px;
            height: 50px;
          }

          .balance-card {
            align-items: center;
          }

          .balance-right {
            flex-direction: column;
          }

          .balance-number {
            font-size: 37px;
          }

          .balance-word {
            font-size: 17px;
          }
        }
      `}</style>

      <main className="page">

        {/* =====================================
            CABEÇALHO
        ====================================== */}

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

        {/* =====================================
            CONTEÚDO
        ====================================== */}

        <section className="content">

          {/* TÍTULO */}

          <div className="title-area">

            <h1 className="main-title">

              <span className="title-diamond">
                <Diamond size={74} />
              </span>

              <span className="title-word">
                DIAMANTES
              </span>

            </h1>

            <p className="subtitle">
              Gerencie seus Diamantes e
              acompanhe o uso das ferramentas
              de inteligência artificial do
              CIEL IA STUDIO.
            </p>

          </div>

          {/* ==================================
              SALDO
          =================================== */}

          <section className="balance-card">

            <div className="balance-content">

              <div className="balance-label">
                Seu saldo disponível
              </div>

              <div className="balance-value">

                <span className="balance-number">
                  {loading
                    ? "..."
                    : diamantes ?? 0}
                </span>

                <span className="balance-word">
                  Diamantes
                </span>

              </div>

            </div>

            <div className="balance-right">

              <div className="balance-diamond">
                <Diamond size={82} />
              </div>

              <button
                type="button"
                className="refresh-button"
                onClick={() =>
                  carregarSaldo(true)
                }
                disabled={
                  refreshing
                }
                aria-label="Atualizar saldo"
                title="Atualizar saldo"
              >
                <span
                  className={
                    refreshing
                      ? "refreshing"
                      : ""
                  }
                >
                  ↻
                </span>
              </button>

            </div>

          </section>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* ==================================
              PACOTES
          =================================== */}

          <div className="section-heading">

            <div className="section-label">
              ESCOLHA SEU PACOTE
            </div>

            <h2>
              Mais Diamantes para
              criar mais
            </h2>

            <p>
              Escolha a quantidade ideal
              para suas criações no
              CIEL IA STUDIO.
            </p>

          </div>

          <div className="packages-grid">

            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className={`package-card ${
                  pkg.popular
                    ? "popular"
                    : ""
                }`}
              >

                {pkg.popular && (
                  <div className="popular-badge">
                    ⭐ Mais Popular
                  </div>
                )}

                <div className="package-diamond">
                  <Diamond size={104} />
                </div>

                <div className="package-name">
                  {pkg.name}
                </div>

                <div className="package-amount">

                  <span className="package-amount-number">
                    {pkg.diamonds.toLocaleString(
                      "pt-BR"
                    )}
                  </span>

                  <span className="package-amount-word">
                    Diamantes
                  </span>

                </div>

                <div className="package-price">
                  {pkg.price}
                </div>

                <p className="package-description">
                  {pkg.description}
                </p>

                <button
                  type="button"
                  className="buy-button"
                  onClick={() =>
                    handleBuy(pkg)
                  }
                >
                  Comprar Diamantes
                </button>

              </article>
            ))}

          </div>

          {/* ==================================
              COMO FUNCIONAM
          =================================== */}

          <section className="info-card">

            <div className="info-icon">
              i
            </div>

            <div className="info-content">

              <h3>
                Como funcionam os Diamantes?
              </h3>

              <p>
                Os Diamantes são a unidade
                utilizada pelo CIEL IA STUDIO
                para realizar suas criações
                com inteligência artificial.
                Cada ferramenta possui um
                custo específico em Diamantes,
                que será informado antes da
                criação.
              </p>

            </div>

          </section>

        </section>

        {/* =====================================
            RODAPÉ PADRÃO
        ====================================== */}

        <footer className="footer">

          <div className="footer-inner">

            <div className="footer-brand">

              <h2>
                CIEL IA STUDIO
              </h2>

              <p>
                Crie. Transforme. Inove
                com IA.
              </p>

            </div>

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

                <Link
                  href="/creditos"
                  className="footer-diamond-link"
                >
                  <span>💎</span>
                  <span>Diamantes</span>
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
