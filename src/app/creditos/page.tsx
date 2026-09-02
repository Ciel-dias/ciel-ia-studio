"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Diamond from "@/components/Diamond";

type Package = {
  name: string;
  diamonds: number;
  price: string;
  description: string;
  popular?: boolean;
  iconSize?: number;
};

export default function CreditosPage() {
  const [diamantes, setDiamantes] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const packages: Package[] = [
    {
      name: "Essencial",
      diamonds: 100,
      price: "R$ 9,90",
      description: "Ideal para começar a criar",
      iconSize: 42,
    },
    {
      name: "Profissional",
      diamonds: 500,
      price: "R$ 44,90",
      description: "Mais Diamantes para suas criações",
      popular: true,
      iconSize: 46,
    },
    {
      name: "Criador",
      diamonds: 1000,
      price: "R$ 79,90",
      description: "Para quem cria com frequência",
      iconSize: 50,
    },
    {
      name: "Premium",
      diamonds: 2500,
      price: "R$ 179,90",
      description: "Para criadores que precisam de mais",
      iconSize: 54,
    },
  ];

  const carregarDiamantes = useCallback(async () => {
    try {
      setLoading(true);

      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setDiamantes(0);
        return;
      }

      const { data, error } = await supabase
        .from("créditos")
        .select("equilíbrio")
        .eq("usuario_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar Diamantes:", error);
        setDiamantes(0);
        return;
      }

      /*
       * Tipagem explícita para evitar o erro do TypeScript
       * causado pelo acesso à coluna "equilíbrio".
       */
      const saldo = data as {
        equilíbrio?: number | string | null;
      } | null;

      setDiamantes(Number(saldo?.equilíbrio) || 0);
    } catch (error) {
      console.error("Erro inesperado ao carregar Diamantes:", error);
      setDiamantes(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDiamantes();
  }, [carregarDiamantes]);

  function comprarDiamantes() {
    alert("A compra de Diamantes será ativada em breve.");
  }

  function formatarNumero(valor: number) {
    return new Intl.NumberFormat("pt-BR").format(valor);
  }

  return (
    <main className="credits-page">
      <div className="page-background" />

      {/* HEADER */}
      <header className="top-header">
        <div className="header-container">
          <Link href="/dashboard" className="brand">
            <span className="brand-icon">✦</span>
            <span>CIEL IA STUDIO</span>
          </Link>

          <nav className="header-nav">
            <Link href="/minha-conta">Minha Conta</Link>

            <Link href="/projetos">Meus Projetos</Link>

            <Link href="/creditos" className="active">
              <Diamond size={22} />
              <span>Diamantes</span>
            </Link>

            <Link href="/configuracoes">Configurações</Link>

            <Link href="/login">Sair</Link>
          </nav>
        </div>
      </header>

      {/* CONTEÚDO */}
      <section className="content">
        {/* TÍTULO */}
        <div className="title-area">
          <div className="title-icon">
            <Diamond size={62} />
          </div>

          <div>
            <h1>
              <span className="title-diamantes">DIAMANTES</span>
            </h1>

            <p>
              Use seus Diamantes para transformar suas ideias em criações com
              inteligência artificial.
            </p>
          </div>
        </div>

        {/* SALDO */}
        <section className="balance-card">
          <div className="balance-left">
            <div className="balance-icon">
              <Diamond size={58} />
            </div>

            <div>
              <span className="balance-label">SEU SALDO</span>

              <div className="balance-value">
                {loading ? (
                  <span className="loading-value">...</span>
                ) : (
                  <>
                    <span>{formatarNumero(diamantes ?? 0)}</span>

                    <span className="balance-unit">Diamantes</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={carregarDiamantes}
            disabled={loading}
            aria-label="Atualizar saldo"
            title="Atualizar saldo"
          >
            ↻
          </button>
        </section>

        {/* PACOTES */}
        <section className="packages-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">ESCOLHA SEU PACOTE</span>

              <h2>Mais Diamantes para criar mais</h2>
            </div>

            <p>
              Escolha a quantidade ideal para suas criações no CIEL IA STUDIO.
            </p>
          </div>

          <div className="packages-grid">
            {packages.map((pkg) => (
              <article
                key={pkg.diamonds}
                className={`package-card ${
                  pkg.popular ? "popular-package" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="popular-badge">MAIS POPULAR</div>
                )}

                <div className="package-icon">
                  <Diamond size={pkg.iconSize ?? 46} />
                </div>

                <span className="package-name">{pkg.name}</span>

                <h3>
                  <span className="package-diamond">
                    <Diamond size={30} />
                  </span>

                  <span>{formatarNumero(pkg.diamonds)}</span>

                  <span className="package-unit">Diamantes</span>
                </h3>

                <div className="package-price">{pkg.price}</div>

                <p className="package-description">{pkg.description}</p>

                <button
                  type="button"
                  className="buy-button"
                  onClick={comprarDiamantes}
                >
                  Comprar Diamantes
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* INFORMAÇÕES */}
        <section className="info-card">
          <div className="info-icon">
            <span>i</span>
          </div>

          <div className="info-content">
            <h3>Como funcionam os Diamantes?</h3>

            <p>
              Os Diamantes são a unidade utilizada pelo CIEL IA STUDIO para
              realizar suas criações com inteligência artificial. Cada
              ferramenta possui um custo diferente, de acordo com o tipo de
              geração e seus recursos.
            </p>

            <p>
              Antes de realizar uma geração, você poderá visualizar o custo
              correspondente e acompanhar seu saldo.
            </p>
          </div>
        </section>

        {/* HISTÓRICO */}
        <section className="usage-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">SEU CONSUMO</span>

              <h2>Histórico de utilização</h2>
            </div>
          </div>

          <div className="empty-history">
            <div className="empty-history-icon">
              <Diamond size={42} />
            </div>

            <h3>Seu histórico aparecerá aqui</h3>

            <p>
              Quando você utilizar Diamantes em suas criações, o histórico de
              utilização ficará disponível nesta área.
            </p>
          </div>
        </section>

        {/* OBSERVAÇÃO */}
        <section className="bottom-note">
          <Diamond size={28} />

          <p>
            Seus Diamantes são vinculados à sua conta e podem ser utilizados nas
            ferramentas disponíveis no CIEL IA STUDIO.
          </p>
        </section>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          {/* MARCA */}
          <div className="footer-brand">
            <Link href="/dashboard" className="footer-logo">
              <span className="footer-logo-icon">✦</span>

              <span>CIEL IA STUDIO</span>
            </Link>

            <p>Crie. Transforme. Inove com IA.</p>
          </div>

          {/* PRODUTO */}
          <div className="footer-column">
            <h3>Produto</h3>

            <Link href="/criar-prompts">Criar Prompts</Link>

            <Link href="/texto-imagem">Texto → Imagem</Link>

            <Link href="/texto-video">Texto → Vídeo</Link>

            <Link href="/imagem-imagem">Imagem → Imagem</Link>

            <Link href="/imagem-video">Imagem → Vídeo</Link>

            <Link href="/projetos">Meus Projetos</Link>

            <Link href="/creditos" className="footer-diamantes">
              <Diamond size={20} />

              <span>Diamantes</span>
            </Link>
          </div>

          {/* SUPORTE */}
          <div className="footer-column">
            <h3>Suporte</h3>

            <Link href="/ajuda">Central de Ajuda</Link>

            <Link href="/contato">Contato</Link>

            <Link href="/sobre">Sobre o CIEL IA STUDIO</Link>
          </div>

          {/* LEGAL */}
          <div className="footer-column">
            <h3>Legal</h3>

            <Link href="/termos">Termos de Uso</Link>

            <Link href="/privacidade">Política de Privacidade</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 CIEL IA STUDIO. Todos os direitos reservados.</span>
        </div>
      </footer>

      <style jsx>{`
        .credits-page {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          background: #07111f;
          color: #ffffff;
        }

        .page-background {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(0, 174, 255, 0.12),
              transparent 34%
            ),
            radial-gradient(
              circle at 0% 50%,
              rgba(0, 110, 255, 0.08),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #07111f 0%,
              #081827 45%,
              #050b15 100%
            );
        }

        /* HEADER */

        .top-header {
          position: relative;
          z-index: 5;
          border-bottom: 1px solid rgba(100, 210, 255, 0.1);
          background: rgba(4, 12, 24, 0.78);
          backdrop-filter: blur(16px);
        }

        .header-container {
          width: min(1180px, calc(100% - 40px));
          min-height: 76px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .brand-icon,
        .footer-logo-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          color: #d9f9ff;
          background: linear-gradient(
            135deg,
            rgba(55, 214, 255, 0.95),
            rgba(41, 91, 255, 0.85)
          );
          box-shadow:
            0 0 18px rgba(0, 191, 255, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.35);
        }

        .header-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex-wrap: wrap;
        }

        .header-nav a {
          min-height: 38px;
          padding: 8px 12px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: rgba(222, 239, 255, 0.72);
          text-decoration: none;
          font-size: 14px;
          transition:
            color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .header-nav a:hover {
          color: #ffffff;
          background: rgba(57, 193, 255, 0.08);
        }

        .header-nav a.active {
          color: #dffaff;
          background: rgba(38, 185, 255, 0.1);
          box-shadow: inset 0 0 0 1px rgba(70, 210, 255, 0.12);
        }

        /* CONTEÚDO */

        .content {
          position: relative;
          z-index: 1;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 58px 0 80px;
        }

        /* TÍTULO */

        .title-area {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 34px;
        }

        .title-icon {
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 20px;
          background: rgba(30, 154, 255, 0.08);
          border: 1px solid rgba(81, 211, 255, 0.14);
          box-shadow:
            0 0 30px rgba(0, 172, 255, 0.1),
            inset 0 0 22px rgba(0, 180, 255, 0.04);
        }

        .title-diamantes {
          display: inline-block;
          font-size: clamp(30px, 4vw, 48px);
          line-height: 1;
          font-weight: 900;
          letter-spacing: 2px;
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #a8f0ff 30%,
            #39cfff 62%,
            #398cff 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 28px rgba(35, 199, 255, 0.25);
        }

        .title-area p {
          max-width: 700px;
          margin: 10px 0 0;
          color: rgba(218, 236, 251, 0.66);
          font-size: 15px;
          line-height: 1.65;
        }

        /* SALDO */

        .balance-card {
          min-height: 150px;
          padding: 28px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-radius: 22px;
          border: 1px solid rgba(85, 211, 255, 0.18);
          background: linear-gradient(
            135deg,
            rgba(12, 43, 70, 0.8),
            rgba(7, 21, 38, 0.88)
          );
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .balance-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .balance-icon {
          width: 82px;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: rgba(24, 164, 255, 0.07);
          border: 1px solid rgba(82, 210, 255, 0.12);
        }

        .balance-label,
        .section-kicker {
          display: block;
          margin-bottom: 6px;
          color: rgba(128, 218, 255, 0.68);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        .balance-value {
          display: flex;
          align-items: baseline;
          gap: 10px;
          font-size: clamp(34px, 5vw, 48px);
          font-weight: 900;
          line-height: 1;
          color: #ffffff;
        }

        .balance-unit {
          font-size: 15px;
          font-weight: 700;
          color: #73dfff;
        }

        .loading-value {
          color: #72dfff;
          animation: pulse 1.2s infinite ease-in-out;
        }

        .refresh-button {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(86, 211, 255, 0.16);
          border-radius: 12px;
          background: rgba(27, 162, 255, 0.07);
          color: #75ddff;
          font-size: 25px;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            background 0.2s ease;
        }

        .refresh-button:hover {
          transform: rotate(25deg);
          background: rgba(27, 162, 255, 0.14);
        }

        .refresh-button:disabled {
          cursor: wait;
          opacity: 0.5;
        }

        /* SEÇÕES */

        .packages-section,
        .usage-section {
          margin-top: 58px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 24px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 28px;
          line-height: 1.2;
          color: #ffffff;
        }

        .section-heading p {
          max-width: 390px;
          margin: 0;
          color: rgba(211, 232, 249, 0.58);
          font-size: 14px;
          line-height: 1.6;
          text-align: right;
        }

        /* PACOTES */

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .package-card {
          position: relative;
          min-height: 390px;
          padding: 30px 18px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border: 1px solid rgba(101, 199, 255, 0.1);
          border-radius: 22px;
          background: linear-gradient(
            145deg,
            rgba(12, 30, 49, 0.88),
            rgba(6, 16, 29, 0.92)
          );
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .package-card:hover {
          transform: translateY(-5px);
          border-color: rgba(76, 211, 255, 0.28);
          box-shadow:
            0 28px 70px rgba(0, 0, 0, 0.28),
            0 0 35px rgba(0, 174, 255, 0.07);
        }

        .popular-package {
          border-color: rgba(68, 211, 255, 0.28);
          box-shadow:
            0 24px 65px rgba(0, 0, 0, 0.25),
            0 0 40px rgba(0, 188, 255, 0.08);
        }

        .popular-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 5px 9px;
          border-radius: 999px;
          background: rgba(35, 192, 255, 0.11);
          border: 1px solid rgba(71, 213, 255, 0.18);
          color: #72ddff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .package-icon {
          width: 82px;
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          border-radius: 22px;
          background: rgba(21, 160, 255, 0.06);
          border: 1px solid rgba(86, 211, 255, 0.1);
        }

        .package-name {
          color: rgba(211, 234, 249, 0.66);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .package-card h3 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          margin: 12px 0 4px;
          color: #ffffff;
          font-size: 27px;
          line-height: 1;
          font-weight: 900;
          white-space: nowrap;
        }

        .package-diamond {
          display: inline-flex;
          align-items: center;
        }

        .package-unit {
          align-self: flex-end;
          margin-bottom: 2px;
          color: #69d9ff;
          font-size: 9px;
          font-weight: 800;
        }

        .package-price {
          margin-top: 15px;
          color: #ffffff;
          font-size: 24px;
          font-weight: 900;
        }

        .package-description {
          min-height: 42px;
          margin: 10px 0 22px;
          color: rgba(211, 232, 249, 0.55);
          font-size: 12px;
          line-height: 1.6;
        }

        .buy-button {
          width: 100%;
          min-height: 46px;
          margin-top: auto;
          border: 1px solid rgba(73, 210, 255, 0.22);
          border-radius: 12px;
          background: linear-gradient(
            135deg,
            rgba(29, 177, 255, 0.2),
            rgba(44, 104, 255, 0.17)
          );
          color: #dffaff;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .buy-button:hover {
          transform: translateY(-1px);
          background: linear-gradient(
            135deg,
            rgba(29, 177, 255, 0.28),
            rgba(44, 104, 255, 0.25)
          );
          box-shadow: 0 8px 25px rgba(0, 169, 255, 0.12);
        }

        /* INFORMAÇÕES */

        .info-card {
          margin-top: 34px;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
          border: 1px solid rgba(101, 199, 255, 0.09);
          border-radius: 18px;
          background: rgba(9, 27, 44, 0.62);
        }

        .info-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(74, 207, 255, 0.2);
          background: rgba(31, 181, 255, 0.08);
          color: #6edcff;
          font-size: 18px;
          font-weight: 900;
        }

        .info-content h3 {
          margin: 1px 0 7px;
          color: #ffffff;
          font-size: 16px;
        }

        .info-content p {
          margin: 0 0 8px;
          color: rgba(211, 232, 249, 0.58);
          font-size: 13px;
          line-height: 1.65;
        }

        .info-content p:last-child {
          margin-bottom: 0;
        }

        /* HISTÓRICO */

        .empty-history {
          min-height: 250px;
          padding: 35px 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          border: 1px dashed rgba(102, 204, 255, 0.12);
          border-radius: 20px;
          background: rgba(7, 20, 34, 0.45);
        }

        .empty-history-icon {
          width: 68px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          border-radius: 18px;
          background: rgba(27, 166, 255, 0.06);
          border: 1px solid rgba(80, 208, 255, 0.1);
        }

        .empty-history h3 {
          margin: 0 0 7px;
          color: #ffffff;
          font-size: 17px;
        }

        .empty-history p {
          max-width: 520px;
          margin: 0;
          color: rgba(211, 232, 249, 0.52);
          font-size: 13px;
          line-height: 1.65;
        }

        /* OBSERVAÇÃO */

        .bottom-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 30px;
          color: rgba(210, 234, 250, 0.48);
          font-size: 12px;
          text-align: center;
        }

        .bottom-note p {
          margin: 0;
        }

        /* FOOTER */

        .footer {
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(100, 210, 255, 0.08);
          background: rgba(3, 10, 19, 0.82);
        }

        .footer-container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 55px 0 45px;
          display: grid;
          grid-template-columns: 1.4fr repeat(3, 1fr);
          gap: 40px;
        }

        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          text-decoration: none;
          font-size: 15px;
          font-weight: 900;
        }

        .footer-logo-icon {
          width: 28px;
          height: 28px;
          font-size: 13px;
        }

        .footer-brand p {
          max-width: 220px;
          margin: 13px 0 0;
          color: rgba(210, 233, 250, 0.48);
          font-size: 13px;
          line-height: 1.6;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 9px;
        }

        .footer-column h3 {
          margin: 0 0 7px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
        }

        .footer-column a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(210, 233, 250, 0.52);
          text-decoration: none;
          font-size: 12px;
          line-height: 1.4;
          transition: color 0.2s ease;
        }

        .footer-column a:hover {
          color: #72ddff;
        }

        .footer-diamantes {
          color: #72ddff !important;
        }

        .footer-bottom {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          padding: 20px 0 25px;
          border-top: 1px solid rgba(100, 210, 255, 0.07);
          color: rgba(210, 233, 250, 0.35);
          font-size: 11px;
          text-align: center;
        }

        /* ANIMAÇÃO */

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.35;
          }

          50% {
            opacity: 1;
          }
        }

        /* TABLET */

        @media (max-width: 1050px) {
          .packages-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .package-card {
            min-height: 380px;
          }
        }

        @media (max-width: 900px) {
          .header-container {
            padding: 14px 0;
            align-items: flex-start;
            flex-direction: column;
          }

          .header-nav {
            width: 100%;
            justify-content: flex-start;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .section-heading p {
            text-align: left;
          }

          .footer-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* CELULAR */

        @media (max-width: 600px) {
          .header-container,
          .content,
          .footer-container,
          .footer-bottom {
            width: min(100% - 28px, 1180px);
          }

          .content {
            padding-top: 35px;
            padding-bottom: 55px;
          }

          .title-area {
            align-items: flex-start;
            gap: 14px;
          }

          .title-icon {
            width: 62px;
            height: 62px;
            border-radius: 17px;
          }

          .title-diamantes {
            font-size: 30px;
            letter-spacing: 1px;
          }

          .title-area p {
            font-size: 13px;
          }

          .balance-card {
            min-height: auto;
            padding: 22px 18px;
          }

          .balance-left {
            gap: 13px;
          }

          .balance-icon {
            width: 62px;
            height: 62px;
            border-radius: 16px;
          }

          .balance-value {
            font-size: 31px;
          }

          .balance-unit {
            font-size: 12px;
          }

          .refresh-button {
            width: 40px;
            height: 40px;
          }

          .packages-grid {
            grid-template-columns: 1fr;
          }

          .package-card {
            min-height: 350px;
          }

          .section-heading h2 {
            font-size: 23px;
          }

          .info-card {
            padding: 18px;
          }

          .bottom-note {
            align-items: flex-start;
          }

          .footer-container {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 40px 0;
          }

          .footer-column {
            gap: 10px;
          }

          .header-nav {
            gap: 3px;
          }

          .header-nav a {
            padding: 7px 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </main>
  );
}
