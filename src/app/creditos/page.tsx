"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Diamond from "@/components/Diamond";

export const dynamic = "force-dynamic";

type Package = {
  id: string;
  name: string;
  diamonds: number;
  price: string;
  description: string;
  badge?: string;
  featured?: boolean;
};

const packages: Package[] = [
  {
    id: "essencial",
    name: "Essencial",
    diamonds: 100,
    price: "R$ 9,90",
    description: "Para começar suas criações com IA.",
  },
  {
    id: "profissional",
    name: "Profissional",
    diamonds: 500,
    price: "R$ 44,90",
    description: "Mais Diamantes para criar com liberdade.",
    badge: "MAIS POPULAR",
    featured: true,
  },
  {
    id: "avancado",
    name: "Avançado",
    diamonds: 1000,
    price: "R$ 79,90",
    description: "Para criadores que produzem com frequência.",
  },
  {
    id: "premium",
    name: "Premium",
    diamonds: 2500,
    price: "R$ 179,90",
    description: "Para criadores que precisam de mais.",
  },
];

export default function CreditosPage() {
  const [diamantes, setDiamantes] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [buying, setBuying] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const supabase = createClient();

  // =========================================================
  // CARREGAR SALDO REAL
  // =========================================================

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

        const { data, error: creditsError } = await supabase
          .from("créditos")
          .select("equilíbrio")
          .eq("usuario_id", user.id)
          .maybeSingle();

        if (creditsError) {
          console.error(
            "Erro ao carregar saldo de Diamantes:",
            creditsError
          );

          setDiamantes(0);
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
          "Erro ao carregar Diamantes:",
          err
        );

        setError(
          "Não foi possível carregar seu saldo."
        );

        setDiamantes(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [supabase]
  );

  // =========================================================
  // PRIMEIRO CARREGAMENTO
  // =========================================================

  useEffect(() => {
    carregarSaldo();
  }, [carregarSaldo]);

  // =========================================================
  // ATUALIZAÇÃO EM TEMPO REAL
  // =========================================================

  useEffect(() => {
    let channel: ReturnType<
      typeof supabase.channel
    > | null = null;

    async function iniciarRealtime() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      channel = supabase
        .channel(`diamantes-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "créditos",
            filter: `usuario_id=eq.${user.id}`,
          },
          () => {
            carregarSaldo(false);
          }
        )
        .subscribe();
    }

    iniciarRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [carregarSaldo, supabase]);

  // =========================================================
  // RECARREGAR SALDO MANUALMENTE
  // =========================================================

  async function handleRefresh() {
    await carregarSaldo(true);
  }

  // =========================================================
  // COMPRAR DIAMANTES
  // =========================================================

  async function handleBuy(pkg: Package) {
    setMessage("");
    setError("");

    setBuying(pkg.id);

    try {
      /*
       * O checkout real será conectado ao Mercado Pago
       * na etapa de pagamentos.
       *
       * IMPORTANTE:
       * clicar em Comprar NÃO adiciona Diamantes.
       * O saldo somente será liberado depois da
       * confirmação oficial do pagamento pelo webhook.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      setMessage(
        `O pacote de ${pkg.diamonds.toLocaleString(
          "pt-BR"
        )} Diamantes será disponibilizado no checkout.`
      );
    } catch (err) {
      console.error(
        "Erro ao iniciar compra:",
        err
      );

      setError(
        "Não foi possível iniciar a compra."
      );
    } finally {
      setBuying(null);
    }
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
          background: #06111f;
        }

        body {
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #ffffff;
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }

        button {
          font-family: inherit;
        }

        /* =====================================================
           PÁGINA
        ===================================================== */

        .page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at 50% 8%,
              rgba(22, 126, 190, 0.25),
              transparent 32%
            ),
            radial-gradient(
              circle at 8% 45%,
              rgba(14, 91, 145, 0.18),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 60%,
              rgba(10, 70, 120, 0.16),
              transparent 35%
            ),
            linear-gradient(
              135deg,
              #06101d 0%,
              #071a2c 48%,
              #061422 100%
            );

          overflow-x: hidden;
        }

        /* =====================================================
           CABEÇALHO PADRÃO
        ===================================================== */

        .topbar {
          position: relative;

          width: 100%;
          min-height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 24px;

          padding:
            0 42px;

          background:
            rgba(3, 12, 24, 0.94);

          border-bottom:
            1px solid
            rgba(76, 177, 237, 0.18);

          backdrop-filter: blur(14px);
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 10px;

          text-decoration: none;

          white-space: nowrap;
        }

        .brand-icon {
          font-size: 28px;

          line-height: 1;

          filter:
            drop-shadow(
              0 0 8px
              rgba(255, 215, 70, 0.45)
            );
        }

        .brand-name {
          color: #ffffff;

          font-size: 20px;
          font-weight: 800;

          letter-spacing: 0.3px;
        }

        .nav {
          display: flex;
          align-items: center;

          gap: 24px;
        }

        .nav a {
          color: #b9c9da;

          text-decoration: none;

          font-size: 14px;
          font-weight: 700;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .nav a:hover {
          color: #67d4ff;

          text-shadow:
            0 0 12px
            rgba(67, 201, 255, 0.55);
        }

        .nav-active {
          color: #69d6ff !important;

          text-shadow:
            0 0 12px
            rgba(68, 205, 255, 0.45);
        }

        /* =====================================================
           CONTEÚDO
        ===================================================== */

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

        /* =====================================================
           TÍTULO
        ===================================================== */

        .hero {
          text-align: center;

          margin-bottom: 44px;
        }

        .hero-title {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 18px;

          margin: 0;

          color: #ffffff;

          font-size:
            clamp(
              40px,
              6vw,
              64px
            );

          font-weight: 900;

          letter-spacing: 2px;

          text-shadow:
            0 0 18px
            rgba(71, 203, 255, 0.2);
        }

        .hero-diamond {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 76px;
          height: 76px;

          flex-shrink: 0;

          filter:
            drop-shadow(
              0 0 9px
              rgba(87, 218, 255, 0.85)
            )
            drop-shadow(
              0 0 22px
              rgba(35, 172, 255, 0.5)
            );
        }

        .hero-title-text {
          background:
            linear-gradient(
              90deg,
              #ffffff 0%,
              #c9f1ff 38%,
              #59caff 72%,
              #27a9f0 100%
            );

          -webkit-background-clip: text;
          background-clip: text;

          -webkit-text-fill-color: transparent;
        }

        .hero p {
          width:
            min(
              760px,
              100%
            );

          margin:
            18px auto 0;

          color: #9fb2c5;

          font-size: 18px;

          line-height: 1.65;
        }

        /* =====================================================
           SALDO
        ===================================================== */

        .balance-card {
          position: relative;

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 28px;

          min-height: 180px;

          padding:
            30px 38px;

          margin-bottom: 62px;

          border-radius: 24px;

          background:
            linear-gradient(
              135deg,
              rgba(8, 37, 59, 0.94),
              rgba(4, 24, 41, 0.98)
            );

          border:
            1px solid
            rgba(39, 190, 255, 0.42);

          box-shadow:
            0 0 12px
              rgba(28, 179, 255, 0.2),
            0 0 35px
              rgba(17, 119, 190, 0.12),
            inset 0 0 28px
              rgba(37, 173, 255, 0.045);
        }

        .balance-left {
          display: flex;
          align-items: center;

          gap: 24px;

          min-width: 0;
        }

        .balance-diamond {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 88px;
          height: 88px;

          flex-shrink: 0;

          filter:
            drop-shadow(
              0 0 8px
              rgba(90, 220, 255, 0.9)
            )
            drop-shadow(
              0 0 25px
              rgba(28, 177, 255, 0.52)
            );
        }

        .balance-info {
          min-width: 0;
        }

        .balance-label {
          margin-bottom: 6px;

          color: #8fa7bb;

          font-size: 13px;
          font-weight: 800;

          letter-spacing: 2px;

          text-transform: uppercase;
        }

        .balance-value {
          display: flex;

          align-items: baseline;

          gap: 10px;

          white-space: nowrap;
        }

        .balance-number {
          color: #ffffff;

          font-size:
            clamp(
              42px,
              6vw,
              58px
            );

          font-weight: 900;

          line-height: 1;
        }

        .balance-word {
          color: #5fd0ff;

          font-size:
            clamp(
              19px,
              3vw,
              27px
            );

          font-weight: 800;
        }

        .refresh-button {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 58px;
          height: 58px;

          flex-shrink: 0;

          border-radius: 17px;

          border:
            1px solid
            rgba(69, 202, 255, 0.32);

          background:
            rgba(17, 91, 135, 0.16);

          color: #62d4ff;

          font-size: 28px;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .refresh-button:hover {
          transform:
            translateY(-2px);

          background:
            rgba(25, 119, 170, 0.24);

          box-shadow:
            0 0 16px
            rgba(55, 198, 255, 0.25);
        }

        .refresh-button:disabled {
          opacity: 0.55;

          cursor: wait;
        }

        .refresh-spin {
          display: inline-block;

          animation:
            rotate 0.9s linear infinite;
        }

        @keyframes rotate {
          to {
            transform:
              rotate(360deg);
          }
        }

        /* =====================================================
           SEÇÃO PACOTES
        ===================================================== */

        .section-heading {
          margin-bottom: 30px;
        }

        .section-kicker {
          margin: 0 0 9px;

          color: #58c9ef;

          font-size: 13px;
          font-weight: 900;

          letter-spacing: 2.5px;

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
          margin:
            14px 0 0;

          color: #8fa3b7;

          font-size: 17px;

          line-height: 1.6;
        }

        /* =====================================================
           GRID DE PACOTES
        ===================================================== */

        .packages-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 24px;

          margin-bottom: 56px;
        }

        .package-card {
          position: relative;

          display: flex;
          flex-direction: column;

          min-height: 510px;

          padding:
            34px 30px 28px;

          border-radius: 26px;

          background:
            linear-gradient(
              145deg,
              rgba(7, 31, 49, 0.96),
              rgba(4, 20, 34, 0.98)
            );

          border:
            1px solid
            rgba(66, 160, 210, 0.2);

          box-shadow:
            0 14px 40px
              rgba(0, 0, 0, 0.2);

          overflow: hidden;

          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .package-card::before {
          content: "";

          position: absolute;

          width: 220px;
          height: 220px;

          top: -120px;
          right: -100px;

          border-radius: 50%;

          background:
            rgba(46, 181, 255, 0.09);

          filter:
            blur(30px);

          pointer-events: none;
        }

        .package-card:hover {
          transform:
            translateY(-5px);

          border-color:
            rgba(71, 194, 244, 0.42);

          box-shadow:
            0 15px 45px
              rgba(0, 0, 0, 0.26),
            0 0 22px
              rgba(35, 166, 225, 0.1);
        }

        .package-featured {
          border:
            1px solid
            rgba(67, 204, 255, 0.62);

          box-shadow:
            0 0 20px
              rgba(39, 176, 237, 0.12),
            inset 0 0 25px
              rgba(39, 176, 237, 0.035);
        }

        .popular-badge {
          position: absolute;

          top: 18px;
          right: 18px;

          padding:
            7px 12px;

          border-radius: 999px;

          color: #041522;

          background:
            linear-gradient(
              90deg,
              #5bd6ff,
              #9ceaff
            );

          font-size: 10px;
          font-weight: 900;

          letter-spacing: 0.7px;

          box-shadow:
            0 0 13px
            rgba(69, 204, 255, 0.35);
        }

        .package-diamond {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 120px;
          height: 120px;

          margin:
            8px auto 12px;

          filter:
            drop-shadow(
              0 0 9px
              rgba(91, 219, 255, 0.95)
            )
            drop-shadow(
              0 0 25px
              rgba(31, 168, 240, 0.58)
            );
        }

        .package-name {
          margin:
            4px 0 10px;

          text-align: center;

          color: #8fa8bc;

          font-size: 14px;
          font-weight: 900;

          letter-spacing: 2px;

          text-transform: uppercase;
        }

        .package-diamonds {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          margin-top: 2px;

          text-align: center;
        }

        .small-diamond {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 40px;
          height: 40px;

          filter:
            drop-shadow(
              0 0 7px
              rgba(78, 214, 255, 0.8)
            );
        }

        .package-number {
          color: #ffffff;

          font-size:
            clamp(
              31px,
              4vw,
              42px
            );

          font-weight: 900;

          line-height: 1;
        }

        .package-word {
          color: #5dcfff;

          font-size: 15px;

          font-weight: 800;

          align-self: flex-end;

          margin-bottom: 4px;
        }

        .package-price {
          margin:
            25px 0 12px;

          text-align: center;

          color: #ffffff;

          font-size:
            clamp(
              30px,
              4vw,
              38px
            );

          font-weight: 900;
        }

        .package-description {
          min-height: 50px;

          margin: 0 auto;

          max-width: 330px;

          text-align: center;

          color: #879caf;

          font-size: 15px;

          line-height: 1.6;
        }

        .buy-button {
          width: 100%;

          margin-top: auto;

          padding:
            16px 20px;

          border-radius: 14px;

          border:
            1px solid
            rgba(70, 201, 255, 0.45);

          color: #ffffff;

          background:
            linear-gradient(
              90deg,
              #0b91ed,
              #0bc1f3
            );

          font-size: 16px;
          font-weight: 900;

          cursor: pointer;

          box-shadow:
            0 0 18px
            rgba(21, 164, 235, 0.22);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .buy-button:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 0 25px
            rgba(25, 181, 247, 0.4);
        }

        .buy-button:disabled {
          opacity: 0.55;

          cursor: wait;

          transform: none;
        }

        /* =====================================================
           MENSAGENS
        ===================================================== */

        .notice {
          margin:
            0 auto 28px;

          padding:
            14px 18px;

          border-radius: 13px;

          font-size: 14px;

          line-height: 1.5;

          text-align: center;
        }

        .notice-success {
          color: #91f1c8;

          background:
            rgba(32, 170, 115, 0.09);

          border:
            1px solid
            rgba(73, 224, 162, 0.25);
        }

        .notice-error {
          color: #ffb3b3;

          background:
            rgba(220, 60, 60, 0.09);

          border:
            1px solid
            rgba(255, 90, 90, 0.25);
        }

        /* =====================================================
           COMO FUNCIONA
        ===================================================== */

        .info-card {
          display: grid;

          grid-template-columns:
            auto 1fr;

          gap: 24px;

          align-items: start;

          padding:
            30px;

          margin-bottom: 32px;

          border-radius: 23px;

          background:
            linear-gradient(
              145deg,
              rgba(8, 31, 49, 0.88),
              rgba(4, 20, 34, 0.96)
            );

          border:
            1px solid
            rgba(69, 164, 215, 0.2);
        }

        .info-icon {
          width: 58px;
          height: 58px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          border:
            1px solid
            rgba(73, 200, 255, 0.3);

          color: #61d3ff;

          background:
            rgba(45, 171, 225, 0.08);

          font-size: 27px;
          font-weight: 900;

          box-shadow:
            0 0 15px
            rgba(48, 188, 245, 0.1);
        }

        .info-card h3 {
          margin:
            0 0 10px;

          color: #ffffff;

          font-size: 21px;
        }

        .info-card p {
          margin: 0;

          color: #8ea3b7;

          font-size: 15px;

          line-height: 1.7;
        }

        .info-card strong {
          color: #c8eaff;
        }

        /* =====================================================
           RODAPÉ PADRÃO
        ===================================================== */

        .footer {
          border-top:
            1px solid
            rgba(76, 177, 237, 0.16);

          background:
            linear-gradient(
              180deg,
              rgba(3, 13, 25, 0.98),
              #020a14
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
          font-weight: 900;
        }

        .footer-brand p {
          margin: 0;

          color: #8fa1b3;

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
          font-weight: 800;
        }

        .footer-column a {
          display: block;

          width: fit-content;

          margin-bottom: 12px;

          color: #9eafc0;

          text-decoration: none;

          font-size: 14px;

          transition:
            color 0.2s ease;
        }

        .footer-column a:hover {
          color: #65d3ff;
        }

        .footer-diamond-link {
          color: #65d3ff !important;

          font-weight: 700;
        }

        .footer-bottom {
          margin-top: 36px;

          padding-top: 22px;

          border-top:
            1px solid
            rgba(76, 177, 237, 0.14);

          color: #77889a;

          text-align: center;

          font-size: 13px;
        }

        /* =====================================================
           LOADING
        ===================================================== */

        .loading {
          min-height: 300px;

          display: flex;

          align-items: center;
          justify-content: center;

          color: #91a7bb;

          font-size: 16px;

          animation:
            loadingPulse 1.2s infinite;
        }

        @keyframes loadingPulse {
          0%,
          100% {
            opacity: 0.45;
          }

          50% {
            opacity: 1;
          }
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 950px) {
          .topbar {
            padding:
              0 24px;
          }

          .nav {
            gap: 14px;
          }

          .nav a {
            font-size: 13px;
          }

          .packages-grid {
            grid-template-columns:
              1fr 1fr;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 700px) {
          .topbar {
            min-height: auto;

            padding:
              17px 16px;

            flex-direction: column;

            align-items: stretch;

            gap: 15px;
          }

          .brand {
            justify-content: center;
          }

          .nav {
            display: flex;

            justify-content: center;

            flex-wrap: wrap;

            gap:
              9px 15px;
          }

          .nav a {
            font-size: 12px;
          }

          .content {
            width:
              calc(100% - 28px);

            padding:
              40px 0 60px;
          }

          .hero {
            margin-bottom: 34px;
          }

          .hero-title {
            gap: 10px;

            font-size: 39px;

            letter-spacing: 1px;
          }

          .hero-diamond {
            width: 60px;
            height: 60px;
          }

          .hero p {
            font-size: 16px;

            line-height: 1.7;
          }

          .balance-card {
            min-height: 155px;

            padding:
              23px 20px;

            gap: 12px;

            border-radius: 21px;
          }

          .balance-left {
            gap: 14px;
          }

          .balance-diamond {
            width: 67px;
            height: 67px;
          }

          .balance-label {
            font-size: 11px;

            letter-spacing: 1.6px;
          }

          .balance-number {
            font-size: 42px;
          }

          .balance-word {
            font-size: 18px;
          }

          .refresh-button {
            width: 51px;
            height: 51px;

            border-radius: 15px;

            font-size: 24px;
          }

          .section-heading h2 {
            font-size: 30px;
          }

          .section-heading p {
            font-size: 15px;
          }

          .packages-grid {
            grid-template-columns: 1fr;

            gap: 20px;
          }

          .package-card {
            min-height: 495px;

            padding:
              30px 22px 24px;
          }

          .package-diamond {
            width: 105px;
            height: 105px;
          }

          .package-number {
            font-size: 34px;
          }

          .package-price {
            font-size: 32px;
          }

          .info-card {
            grid-template-columns: 1fr;

            gap: 18px;

            padding: 24px;
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
          .brand-name {
            font-size: 18px;
          }

          .hero-title {
            font-size: 34px;
          }

          .hero-diamond {
            width: 52px;
            height: 52px;
          }

          .balance-card {
            padding:
              21px 16px;
          }

          .balance-diamond {
            width: 60px;
            height: 60px;
          }

          .balance-number {
            font-size: 38px;
          }

          .balance-word {
            font-size: 16px;
          }

          .refresh-button {
            width: 47px;
            height: 47px;
          }
        }
      `}</style>

      <main className="page">

        {/* =====================================================
            CABEÇALHO
        ===================================================== */}

        <header className="topbar">

          <Link
            href="/dashboard"
            className="brand"
          >
            <span className="brand-icon">
              ✨
            </span>

            <span className="brand-name">
              CIEL IA STUDIO
            </span>
          </Link>

          <nav className="nav">

            <Link href="/minha-conta">
              Minha Conta
            </Link>

            <Link href="/projetos">
              Meus Projetos
            </Link>

            <Link
              href="/creditos"
              className="nav-active"
            >
              💎 Diamantes
            </Link>

            <Link href="/configuracoes">
              Configurações
            </Link>

            <Link href="/login">
              Sair
            </Link>

          </nav>

        </header>

        {/* =====================================================
            CONTEÚDO
        ===================================================== */}

        <section className="content">

          {/* ===================================================
              HERO
          =================================================== */}

          <div className="hero">

            <h1 className="hero-title">

              <span className="hero-diamond">
                <Diamond />
              </span>

              <span className="hero-title-text">
                DIAMANTES
              </span>

            </h1>

            <p>
              Gerencie seus Diamantes e
              acompanhe o uso das ferramentas
              de inteligência artificial do
              CIEL IA STUDIO.
            </p>

          </div>

          {/* ===================================================
              SALDO
          =================================================== */}

          {loading ? (

            <div className="balance-card loading">
              Carregando seu saldo de Diamantes...
            </div>

          ) : (

            <div className="balance-card">

              <div className="balance-left">

                <div className="balance-diamond">
                  <Diamond />
                </div>

                <div className="balance-info">

                  <div className="balance-label">
                    Seu saldo disponível
                  </div>

                  <div className="balance-value">

                    <span className="balance-number">
                      {diamantes ?? 0}
                    </span>

                    <span className="balance-word">
                      Diamantes
                    </span>

                  </div>

                </div>

              </div>

              <button
                type="button"
                className="refresh-button"
                onClick={handleRefresh}
                disabled={refreshing}
                aria-label="Atualizar saldo"
                title="Atualizar saldo"
              >
                <span
                  className={
                    refreshing
                      ? "refresh-spin"
                      : ""
                  }
                >
                  ↻
                </span>
              </button>

            </div>

          )}

          {/* ===================================================
              MENSAGENS
          =================================================== */}

          {message && (
            <div className="notice notice-success">
              {message}
            </div>
          )}

          {error && (
            <div className="notice notice-error">
              {error}
            </div>
          )}

          {/* ===================================================
              PACOTES
          =================================================== */}

          <div className="section-heading">

            <p className="section-kicker">
              Escolha seu pacote
            </p>

            <h2>
              Mais Diamantes para criar mais
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
                key={pkg.id}
                className={
                  pkg.featured
                    ? "package-card package-featured"
                    : "package-card"
                }
              >

                {pkg.badge && (
                  <div className="popular-badge">
                    {pkg.badge}
                  </div>
                )}

                {/* DIAMANTE SEM QUADRADO */}

                <div className="package-diamond">
                  <Diamond />
                </div>

                <div className="package-name">
                  {pkg.name}
                </div>

                <div className="package-diamonds">

                  <span className="small-diamond">
                    <Diamond />
                  </span>

                  <span className="package-number">
                    {pkg.diamonds.toLocaleString(
                      "pt-BR"
                    )}
                  </span>

                  <span className="package-word">
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
                  disabled={
                    buying === pkg.id
                  }
                >
                  {buying === pkg.id
                    ? "Preparando..."
                    : "Comprar Diamantes"}
                </button>

              </article>

            ))}

          </div>

          {/* ===================================================
              COMO FUNCIONAM
          =================================================== */}

          <div className="info-card">

            <div className="info-icon">
              i
            </div>

            <div>

              <h3>
                Como funcionam os Diamantes?
              </h3>

              <p>
                Os Diamantes são a unidade
                utilizada pelo CIEL IA STUDIO
                para realizar suas criações
                com inteligência artificial.
                Cada ferramenta possui um
                custo específico, que será
                apresentado antes da geração.
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            RODAPÉ PADRÃO
        ===================================================== */}

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
