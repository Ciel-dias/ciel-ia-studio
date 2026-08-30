"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function TermosPage() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("ciel-theme");

    const initialTheme: Theme =
      savedTheme === "light" ? "light" : "dark";

    setTheme(initialTheme);

    document.documentElement.setAttribute(
      "data-theme",
      initialTheme
    );

    document.body.setAttribute(
      "data-theme",
      initialTheme
    );
  }, []);

  useEffect(() => {
    localStorage.setItem("ciel-theme", theme);

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    document.body.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  function toggleTheme() {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
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
          min-height: 100%;
        }

        body {
          font-family:
            Arial,
            Helvetica,
            sans-serif;

          transition:
            background 0.35s ease,
            color 0.35s ease;
        }

        a,
        button {
          -webkit-tap-highlight-color: transparent;
        }

        /* =========================
           PÁGINA
        ========================= */

        .terms-page {
          min-height: 100vh;

          color:
            ${theme === "dark"
              ? "#ffffff"
              : "#101827"};

          background:
            ${theme === "dark"
              ? `
                radial-gradient(
                  circle at 78% 8%,
                  rgba(20, 119, 190, 0.28),
                  transparent 32%
                ),
                radial-gradient(
                  circle at 10% 55%,
                  rgba(15, 76, 125, 0.20),
                  transparent 38%
                ),
                linear-gradient(
                  135deg,
                  #06101e 0%,
                  #081a30 48%,
                  #0b3556 100%
                )
              `
              : `
                radial-gradient(
                  circle at 80% 10%,
                  rgba(91, 190, 255, 0.20),
                  transparent 32%
                ),
                radial-gradient(
                  circle at 10% 65%,
                  rgba(80, 150, 220, 0.12),
                  transparent 38%
                ),
                linear-gradient(
                  135deg,
                  #eef8ff 0%,
                  #e6f3fc 48%,
                  #d8edf9 100%
                )
              `};

          overflow-x: hidden;

          transition:
            background 0.35s ease,
            color 0.35s ease;
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

          background:
            ${theme === "dark"
              ? "rgba(4, 12, 24, 0.88)"
              : "rgba(255, 255, 255, 0.88)"};

          border-bottom:
            1px solid
            ${theme === "dark"
              ? "rgba(100, 180, 255, 0.18)"
              : "rgba(40, 110, 160, 0.18)"};

          backdrop-filter: blur(12px);

          transition:
            background 0.35s ease,
            border-color 0.35s ease;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 10px;

          white-space: nowrap;
        }

        .brand-icon {
          font-size: 27px;
        }

        .brand-name {
          font-size: 20px;

          font-weight: 700;

          letter-spacing: 0.4px;
        }

        .top-actions {
          display: flex;
          align-items: center;

          gap: 14px;
        }

        .back-button {
          color:
            ${theme === "dark"
              ? "#e8eef7"
              : "#172333"};

          text-decoration: none;

          font-size: 14px;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .back-button:hover {
          color: #159ddd;

          text-shadow:
            0 0 12px
            rgba(75, 199, 255, 0.6);
        }

        .theme-button {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          border:
            1px solid
            ${theme === "dark"
              ? "rgba(104, 207, 255, 0.45)"
              : "rgba(30, 130, 190, 0.35)"};

          background:
            ${theme === "dark"
              ? "rgba(20, 100, 150, 0.18)"
              : "rgba(255, 255, 255, 0.70)"};

          color:
            ${theme === "dark"
              ? "#ffffff"
              : "#172333"};

          font-size: 18px;

          cursor: pointer;

          box-shadow:
            ${theme === "dark"
              ? "0 0 12px rgba(70, 199, 255, 0.18)"
              : "0 0 12px rgba(70, 160, 220, 0.14)"};

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .theme-button:hover {
          transform: scale(1.06);
        }

        /* =========================
           CABEÇALHO
        ========================= */

        .hero {
          width:
            min(900px, calc(100% - 40px));

          margin: 0 auto;

          text-align: center;

          padding:
            64px 0 42px;
        }

        .hero-icon {
          font-size: 48px;

          line-height: 1;

          margin-bottom: 18px;
        }

        .hero h1 {
          margin: 0;

          font-size:
            clamp(34px, 5vw, 54px);

          line-height: 1.12;

          font-weight: 700;

          letter-spacing: 0.4px;

          text-transform: uppercase;
        }

        .hero p {
          max-width: 680px;

          margin:
            18px auto 0;

          color:
            ${theme === "dark"
              ? "#b9c5d4"
              : "#536579"};

          font-size:
            clamp(16px, 2vw, 19px);

          line-height: 1.55;
        }

        .updated {
          margin-top: 16px;

          color:
            ${theme === "dark"
              ? "#7f91a5"
              : "#687b8d"};

          font-size: 13px;
        }

        /* =========================
           DOCUMENTO
        ========================= */

        .content {
          width:
            min(920px, calc(100% - 40px));

          margin: 0 auto;

          padding-bottom: 80px;
        }

        .document {
          padding:
            42px 46px;

          border-radius: 22px;

          background:
            ${theme === "dark"
              ? `
                linear-gradient(
                  145deg,
                  rgba(20, 34, 52, 0.96),
                  rgba(10, 22, 37, 0.98)
                )
              `
              : `
                linear-gradient(
                  145deg,
                  rgba(255, 255, 255, 0.98),
                  rgba(235, 246, 252, 0.98)
                )
              `};

          border:
            1px solid
            ${theme === "dark"
              ? "rgba(88, 201, 255, 0.28)"
              : "rgba(59, 184, 237, 0.35)"};

          box-shadow:
            ${theme === "dark"
              ? `
                0 0 18px rgba(43, 167, 255, 0.12),
                inset 0 0 25px rgba(56, 174, 255, 0.025)
              `
              : `
                0 8px 30px rgba(30, 100, 150, 0.08)
              `};

          transition:
            background 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease;
        }

        .intro {
          padding-bottom: 28px;

          margin-bottom: 30px;

          border-bottom:
            1px solid
            ${theme === "dark"
              ? "rgba(100, 180, 255, 0.14)"
              : "rgba(40, 110, 160, 0.14)"};
        }

        .intro p {
          margin: 0;

          color:
            ${theme === "dark"
              ? "#c5d0dc"
              : "#536577"};

          font-size: 15px;

          line-height: 1.75;
        }

        .section {
          margin-top: 34px;
        }

        .section:first-of-type {
          margin-top: 0;
        }

        .section h2 {
          margin:
            0 0 15px;

          color:
            ${theme === "dark"
              ? "#ffffff"
              : "#142132"};

          font-size: 20px;

          line-height: 1.35;

          font-weight: 700;
        }

        .section p {
          margin:
            0 0 13px;

          color:
            ${theme === "dark"
              ? "#b9c7d5"
              : "#526577"};

          font-size: 15px;

          line-height: 1.75;
        }

        .section p:last-child {
          margin-bottom: 0;
        }

        .subsection {
          margin:
            13px 0 0;

          padding-left: 18px;

          border-left:
            2px solid
            ${theme === "dark"
              ? "rgba(88, 201, 255, 0.24)"
              : "rgba(59, 184, 237, 0.28)"};
        }

        .subsection p {
          margin-bottom: 12px;
        }

        .warning {
          margin-top: 18px;

          padding: 18px 20px;

          border-radius: 14px;

          background:
            ${theme === "dark"
              ? "rgba(180, 75, 75, 0.08)"
              : "rgba(220, 90, 90, 0.07)"};

          border:
            1px solid
            ${theme === "dark"
              ? "rgba(255, 120, 120, 0.25)"
              : "rgba(200, 80, 80, 0.22)"};
        }

        .warning p {
          color:
            ${theme === "dark"
              ? "#d9c8c8"
              : "#6d4f4f"};

          margin: 0;

          font-size: 14px;

          line-height: 1.65;
        }

        .important {
          margin-top: 18px;

          padding: 18px 20px;

          border-radius: 14px;

          background:
            ${theme === "dark"
              ? "rgba(35, 160, 210, 0.08)"
              : "rgba(50, 160, 210, 0.07)"};

          border:
            1px solid
            ${theme === "dark"
              ? "rgba(88, 201, 255, 0.22)"
              : "rgba(59, 184, 237, 0.25)"};
        }

        .important p {
          margin: 0;

          color:
            ${theme === "dark"
              ? "#c7d7e5"
              : "#4e6578"};

          font-size: 14px;

          line-height: 1.65;
        }

        /* =========================
           LINKS
        ========================= */

        .document-link {
          color:
            ${theme === "dark"
              ? "#62d0ff"
              : "#159ddd"};

          text-decoration: none;

          font-weight: 600;
        }

        .document-link:hover {
          text-decoration: underline;
        }

        /* =========================
           RODAPÉ
        ========================= */

        .footer {
          border-top:
            1px solid
            ${theme === "dark"
              ? "rgba(100, 180, 255, 0.18)"
              : "rgba(40, 110, 160, 0.18)"};

          background:
            ${theme === "dark"
              ? `
                linear-gradient(
                  180deg,
                  rgba(4, 15, 29, 0.96),
                  rgba(3, 11, 22, 1)
                )
              `
              : `
                linear-gradient(
                  180deg,
                  rgba(239, 248, 253, 0.98),
                  rgba(218, 237, 247, 1)
                )
              `};

          padding:
            48px 42px 24px;

          transition:
            background 0.35s ease,
            border-color 0.35s ease;
        }

        .footer-inner {
          width:
            min(1180px, 100%);

          margin: 0 auto;
        }

        .footer-brand {
          margin-bottom: 38px;
        }

        .footer-brand h2 {
          margin:
            0 0 8px;

          font-size: 23px;
        }

        .footer-brand p {
          margin: 0;

          color:
            ${theme === "dark"
              ? "#9eacbd"
              : "#5d7082"};

          font-size: 14px;
        }

        .footer-columns {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 50px;
        }

        .footer-column h3 {
          margin:
            0 0 17px;

          font-size: 15px;
        }

        .footer-column a {
          display: block;

          width: fit-content;

          margin-bottom: 11px;

          color:
            ${theme === "dark"
              ? "#aebaca"
              : "#536577"};

          text-decoration: none;

          font-size: 14px;

          transition:
            color 0.2s ease;
        }

        .footer-column a:hover {
          color: #159ddd;
        }

        .footer-bottom {
          margin-top: 34px;

          padding-top: 20px;

          border-top:
            1px solid
            ${theme === "dark"
              ? "rgba(100, 180, 255, 0.16)"
              : "rgba(40, 110, 160, 0.16)"};

          text-align: center;

          color:
            ${theme === "dark"
              ? "#8997a9"
              : "#65788a"};

          font-size: 13px;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 800px) {
          .topbar {
            padding:
              0 24px;
          }

          .document {
            padding:
              36px 32px;
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

          .top-actions {
            width: 100%;

            justify-content: center;

            gap: 18px;
          }

          .hero {
            width:
              min(100% - 32px, 500px);

            padding:
              44px 0 30px;
          }

          .hero-icon {
            font-size: 42px;
          }

          .hero h1 {
            font-size: 34px;
          }

          .hero p {
            font-size: 16px;
          }

          .content {
            width:
              min(100% - 32px, 500px);
          }

          .document {
            padding:
              28px 22px;

            border-radius: 18px;
          }

          .section {
            margin-top: 30px;
          }

          .section h2 {
            font-size: 19px;
          }

          .section p {
            font-size: 14px;

            line-height: 1.7;
          }

          .subsection {
            padding-left: 14px;
          }

          .footer {
            padding:
              42px 24px 22px;
          }

          .footer-columns {
            grid-template-columns: 1fr;

            gap: 28px;
          }
        }
      `}</style>

      <main className="terms-page">

        {/* =========================
            TOPO
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

          <div className="top-actions">

            <Link
              href="/dashboard"
              className="back-button"
            >
              ← Voltar ao Dashboard
            </Link>

            <button
              className="theme-button"
              onClick={toggleTheme}
              title={
                theme === "dark"
                  ? "Mudar para tema claro"
                  : "Mudar para tema escuro"
              }
              aria-label={
                theme === "dark"
                  ? "Mudar para tema claro"
                  : "Mudar para tema escuro"
              }
            >
              {theme === "dark"
                ? "☀️"
                : "🌙"}
            </button>

          </div>

        </header>


        {/* =========================
            CABEÇALHO
        ========================= */}

        <section className="hero">

          <div className="hero-icon">
            📄
          </div>

          <h1>
            Termos de Uso
          </h1>

          <p>
            Conheça as regras e condições para
            utilização do CIEL IA STUDIO.
          </p>

          <div className="updated">
            Última atualização: 30 de agosto de 2026
          </div>

        </section>


        {/* =========================
            DOCUMENTO
        ========================= */}

        <section className="content">

          <article className="document">

            <div className="intro">

              <p>
                Estes Termos de Uso estabelecem as
                condições para acesso e utilização do
                CIEL IA STUDIO. Ao criar uma conta,
                acessar ou utilizar a Plataforma, o
                usuário declara que leu, compreendeu e
                concorda com estes Termos.
              </p>

            </div>


            {/* 1 */}

            <section className="section">

              <h2>
                1. Aceitação dos Termos
              </h2>

              <div className="subsection">

                <p>
                  <strong>1.1.</strong> O acesso e a
                  utilização do CIEL IA STUDIO estão
                  condicionados à aceitação destes
                  Termos de Uso.
                </p>

                <p>
                  <strong>1.2.</strong> Caso o usuário não
                  concorde com qualquer disposição destes
                  Termos, deverá deixar de utilizar a
                  Plataforma.
                </p>

                <p>
                  <strong>1.3.</strong> Ao utilizar o
                  CIEL IA STUDIO, o usuário declara possuir
                  capacidade legal para aceitar estes
                  Termos, observadas as regras aplicáveis
                  a menores de idade.
                </p>

              </div>

            </section>


            {/* 2 */}

            <section className="section">

              <h2>
                2. Sobre o CIEL IA STUDIO
              </h2>

              <div className="subsection">

                <p>
                  <strong>2.1.</strong> O CIEL IA STUDIO
                  é uma plataforma destinada à criação,
                  transformação e gerenciamento de
                  conteúdos utilizando recursos de
                  inteligência artificial.
                </p>

                <p>
                  <strong>2.2.</strong> Entre os recursos
                  disponibilizados poderão estar incluídas
                  ferramentas para criação de prompts,
                  imagens, vídeos e outras funcionalidades
                  relacionadas à inteligência artificial.
                </p>

                <p>
                  <strong>2.3.</strong> Os recursos
                  disponíveis poderão ser modificados,
                  atualizados, ampliados ou descontinuados
                  para evolução da Plataforma.
                </p>

              </div>

            </section>


            {/* 3 */}

            <section className="section">

              <h2>
                3. Cadastro e Conta do Usuário
              </h2>

              <div className="subsection">

                <p>
                  <strong>3.1.</strong> Para utilizar
                  determinados recursos, o usuário poderá
                  precisar criar uma conta.
                </p>

                <p>
                  <strong>3.2.</strong> O usuário é
                  responsável pela veracidade das
                  informações fornecidas durante o cadastro.
                </p>

                <p>
                  <strong>3.3.</strong> O usuário deve
                  manter suas credenciais de acesso em
                  segurança e não compartilhar sua senha
                  com terceiros.
                </p>

                <p>
                  <strong>3.4.</strong> O usuário deverá
                  comunicar ao CIEL IA STUDIO qualquer
                  utilização não autorizada de sua conta
                  quando tiver conhecimento do ocorrido.
                </p>

              </div>

            </section>


            {/* 4 */}

            <section className="section">

              <h2>
                4. Uso da Plataforma
              </h2>

              <div className="subsection">

                <p>
                  <strong>4.1.</strong> A Plataforma deverá
                  ser utilizada de maneira lícita,
                  responsável e compatível com estes Termos.
                </p>

                <p>
                  <strong>4.2.</strong> O usuário não deverá
                  utilizar o CIEL IA STUDIO para prejudicar
                  outras pessoas, sistemas, serviços ou a
                  própria Plataforma.
                </p>

                <p>
                  <strong>4.3.</strong> É proibida a
                  utilização da Plataforma para atividades
                  fraudulentas, ilegais ou que violem
                  direitos de terceiros.
                </p>

                <p>
                  <strong>4.4.</strong> O usuário não deverá
                  tentar explorar vulnerabilidades,
                  contornar mecanismos de segurança ou
                  interferir no funcionamento normal da
                  Plataforma.
                </p>

              </div>

            </section>


            {/* 5 */}

            <section className="section">

              <h2>
                5. Créditos e Gerações
              </h2>

              <div className="subsection">

                <p>
                  <strong>5.1.</strong> Determinadas
                  funcionalidades do CIEL IA STUDIO poderão
                  utilizar um sistema de créditos para
                  realizar gerações ou outras operações.
                </p>

                <p>
                  <strong>5.2.</strong> A quantidade de
                  créditos necessária poderá variar de
                  acordo com o recurso utilizado.
                </p>

                <p>
                  <strong>5.3.</strong> Créditos não
                  utilizados poderão estar sujeitos às
                  regras apresentadas no momento de sua
                  disponibilização ou aquisição.
                </p>

                <p>
                  <strong>5.4.</strong> O usuário não poderá
                  tentar obter, multiplicar, transferir ou
                  utilizar créditos de maneira fraudulenta.
                </p>

              </div>

            </section>


            {/* 6 */}

            <section className="section">

              <h2>
                6. Conteúdo do Usuário
              </h2>

              <div className="subsection">

                <p>
                  <strong>6.1.</strong> O usuário poderá
                  fornecer textos, prompts, imagens,
                  vídeos ou outros materiais para utilização
                  dos recursos da Plataforma.
                </p>

                <p>
                  <strong>6.2.</strong> O usuário declara
                  possuir os direitos ou autorizações
                  necessários para utilizar os materiais
                  que enviar ao CIEL IA STUDIO.
                </p>

                <p>
                  <strong>6.3.</strong> O usuário é
                  responsável pelo conteúdo que fornecer à
                  Plataforma e pelas consequências decorrentes
                  de sua utilização.
                </p>

                <p>
                  <strong>6.4.</strong> O usuário não deverá
                  enviar conteúdo que viole direitos autorais,
                  direitos de imagem, privacidade ou outros
                  direitos de terceiros.
                </p>

              </div>

            </section>


            {/* 7 */}

            <section className="section">

              <h2>
                7. Conteúdo Gerado por Inteligência Artificial
              </h2>

              <div className="subsection">

                <p>
                  <strong>7.1.</strong> Os resultados
                  produzidos pela Plataforma são gerados
                  mediante recursos de inteligência artificial
                  e podem apresentar limitações, imprecisões
                  ou resultados inesperados.
                </p>

                <p>
                  <strong>7.2.</strong> O usuário é responsável
                  por revisar e avaliar os conteúdos gerados
                  antes de utilizá-los, publicar ou
                  distribuí-los.
                </p>

                <p>
                  <strong>7.3.</strong> O CIEL IA STUDIO não
                  garante que todo resultado gerado será
                  exclusivo, perfeito ou adequado a uma
                  finalidade específica.
                </p>

                <p>
                  <strong>7.4.</strong> O usuário deve
                  verificar se a utilização do conteúdo
                  gerado respeita direitos autorais, direitos
                  de imagem, marcas, leis e demais direitos
                  aplicáveis.
                </p>

              </div>

            </section>


            {/* 8 */}

            <section className="section">

              <h2>
                8. Conteúdo Proibido e Segurança
              </h2>

              <div className="subsection">

                <p>
                  <strong>8.1.</strong> É proibida a criação,
                  solicitação, edição, transformação ou
                  distribuição de conteúdo pornográfico ou
                  sexualmente explícito por meio do CIEL IA
                  STUDIO.
                </p>

                <p>
                  <strong>8.2.</strong> É proibida a criação
                  ou manipulação de imagens ou vídeos íntimos
                  de pessoas reais sem autorização da pessoa
                  retratada.
                </p>

                <p>
                  <strong>8.3.</strong> É proibida a criação
                  de conteúdo íntimo falso, manipulado ou
                  gerado por inteligência artificial envolvendo
                  pessoas reais sem sua autorização.
                </p>

                <p>
                  <strong>8.4.</strong> É absolutamente
                  proibido qualquer conteúdo sexual envolvendo
                  crianças ou adolescentes, seja real,
                  fictício, manipulado ou gerado por
                  inteligência artificial.
                </p>

                <p>
                  <strong>8.5.</strong> É proibido utilizar a
                  Plataforma para exploração sexual, abuso,
                  aliciamento, exploração de menores ou
                  qualquer atividade relacionada à exploração
                  sexual.
                </p>

                <p>
                  <strong>8.6.</strong> É proibida a criação
                  de conteúdo destinado a fraudes, golpes,
                  falsificação de identidade ou outras
                  atividades ilícitas.
                </p>

                <p>
                  <strong>8.7.</strong> É proibida a tentativa
                  de contornar filtros, sistemas de segurança
                  ou mecanismos de moderação utilizados pela
                  Plataforma.
                </p>

                <p>
                  <strong>8.8.</strong> Solicitações que
                  apresentem risco de violação destes Termos
                  poderão ser recusadas ou bloqueadas.
                </p>

                <p>
                  <strong>8.9.</strong> O CIEL IA STUDIO
                  poderá adotar medidas de segurança e
                  moderação necessárias para proteger a
                  Plataforma, seus usuários e terceiros.
                </p>

              </div>

              <div className="warning">

                <p>
                  <strong>Importante:</strong> qualquer
                  utilização envolvendo conteúdo sexual
                  explícito, conteúdo íntimo não autorizado
                  ou conteúdo sexual envolvendo menores é
                  expressamente proibida.
                </p>

              </div>

            </section>


            {/* 9 */}

            <section className="section">

              <h2>
                9. Direitos Autorais e Propriedade Intelectual
              </h2>

              <div className="subsection">

                <p>
                  <strong>9.1.</strong> O usuário deve
                  respeitar os direitos autorais, marcas,
                  direitos de imagem e demais direitos de
                  propriedade intelectual de terceiros.
                </p>

                <p>
                  <strong>9.2.</strong> O envio de material
                  protegido por direitos de terceiros não
                  transfere esses direitos ao CIEL IA STUDIO.
                </p>

                <p>
                  <strong>9.3.</strong> O usuário é
                  responsável por verificar se possui
                  autorização para utilizar materiais de
                  terceiros.
                </p>

                <p>
                  <strong>9.4.</strong> O uso comercial de
                  conteúdos gerados deverá observar as leis
                  aplicáveis e as condições específicas dos
                  recursos utilizados.
                </p>

              </div>

            </section>


            {/* 10 */}

            <section className="section">

              <h2>
                10. Responsabilidades do Usuário
              </h2>

              <div className="subsection">

                <p>
                  <strong>10.1.</strong> O usuário é
                  responsável pelas informações, comandos,
                  arquivos e conteúdos que inserir na
                  Plataforma.
                </p>

                <p>
                  <strong>10.2.</strong> O usuário deve
                  utilizar o CIEL IA STUDIO de acordo com
                  a legislação aplicável e estes Termos.
                </p>

                <p>
                  <strong>10.3.</strong> O usuário não deve
                  utilizar a Plataforma para causar danos a
                  terceiros ou obter vantagens ilícitas.
                </p>

              </div>

            </section>


            {/* 11 */}

            <section className="section">

              <h2>
                11. Privacidade e Proteção de Dados
              </h2>

              <div className="subsection">

                <p>
                  <strong>11.1.</strong> O tratamento de
                  dados pessoais realizado pelo CIEL IA
                  STUDIO será explicado de forma específica
                  em sua Política de Privacidade.
                </p>

                <p>
                  <strong>11.2.</strong> A utilização da
                  Plataforma poderá envolver o tratamento de
                  informações necessárias para criação e
                  gerenciamento de contas, funcionamento dos
                  recursos, segurança, suporte e demais
                  finalidades informadas ao usuário.
                </p>

                <p>
                  <strong>11.3.</strong> O tratamento de
                  dados pessoais será realizado de acordo
                  com a legislação aplicável.
                </p>

                <p>
                  <strong>11.4.</strong> Para conhecer os
                  detalhes sobre coleta, utilização,
                  armazenamento, segurança e direitos do
                  titular, consulte a
                  {" "}
                  <Link
                    href="/privacidade"
                    className="document-link"
                  >
                    Política de Privacidade
                  </Link>.
                </p>

              </div>

            </section>


            {/* 12 */}

            <section className="section">

              <h2>
                12. Disponibilidade da Plataforma
              </h2>

              <div className="subsection">

                <p>
                  <strong>12.1.</strong> O CIEL IA STUDIO
                  buscará manter seus serviços disponíveis
                  e funcionando adequadamente.
                </p>

                <p>
                  <strong>12.2.</strong> Entretanto, podem
                  ocorrer interrupções temporárias para
                  manutenção, atualização, segurança ou
                  motivos técnicos.
                </p>

                <p>
                  <strong>12.3.</strong> Recursos específicos
                  poderão sofrer alterações para melhoria,
                  segurança ou evolução da Plataforma.
                </p>

              </div>

            </section>


            {/* 13 */}

            <section className="section">

              <h2>
                13. Suspensão e Encerramento da Conta
              </h2>

              <div className="subsection">

                <p>
                  <strong>13.1.</strong> O CIEL IA STUDIO
                  poderá restringir ou suspender uma conta
                  quando houver indícios de violação destes
                  Termos, fraude, abuso ou utilização
                  inadequada da Plataforma.
                </p>

                <p>
                  <strong>13.2.</strong> Medidas de segurança
                  poderão ser adotadas para proteger usuários,
                  terceiros e a própria Plataforma.
                </p>

                <p>
                  <strong>13.3.</strong> O usuário poderá
                  solicitar o encerramento de sua conta,
                  observadas as condições aplicáveis.
                </p>

              </div>

            </section>


            {/* 14 */}

            <section className="section">

              <h2>
                14. Créditos, Pagamentos e Reembolsos
              </h2>

              <div className="subsection">

                <p>
                  <strong>14.1.</strong> Quando houver
                  aquisição de créditos ou outros recursos
                  pagos, as condições aplicáveis serão
                  apresentadas antes da contratação.
                </p>

                <p>
                  <strong>14.2.</strong> O usuário não poderá
                  utilizar mecanismos fraudulentos para obter
                  créditos, pagamentos ou benefícios.
                </p>

                <p>
                  <strong>14.3.</strong> As condições de
                  reembolso serão estabelecidas de acordo
                  com a legislação aplicável e com a
                  Política de Reembolso do CIEL IA STUDIO.
                </p>

                <p>
                  <strong>14.4.</strong> Quando aplicável,
                  informações sobre preços, créditos,
                  validade e condições de utilização serão
                  apresentadas de forma clara ao usuário.
                </p>

              </div>

            </section>


            {/* 15 */}

            <section className="section">

              <h2>
                15. Alterações dos Termos
              </h2>

              <div className="subsection">

                <p>
                  <strong>15.1.</strong> Estes Termos poderão
                  ser atualizados para acompanhar alterações
                  legais, técnicas ou funcionais da Plataforma.
                </p>

                <p>
                  <strong>15.2.</strong> A versão atualizada
                  será disponibilizada nesta página.
                </p>

                <p>
                  <strong>15.3.</strong> A continuidade de
                  utilização da Plataforma após alterações
                  relevantes poderá estar condicionada à
                  aceitação da nova versão dos Termos.
                </p>

              </div>

            </section>


            {/* 16 */}

            <section className="section">

              <h2>
                16. Legislação Aplicável
              </h2>

              <div className="subsection">

                <p>
                  <strong>16.1.</strong> Estes Termos serão
                  interpretados de acordo com a legislação
                  aplicável no Brasil.
                </p>

                <p>
                  <strong>16.2.</strong> As disposições destes
                  Termos não afastam direitos assegurados ao
                  consumidor pela legislação aplicável.
                </p>

              </div>

            </section>


            {/* 17 */}

            <section className="section">

              <h2>
                17. Contato
              </h2>

              <div className="subsection">

                <p>
                  <strong>17.1.</strong> Para dúvidas,
                  solicitações ou assuntos relacionados aos
                  presentes Termos, o usuário poderá utilizar
                  os canais oficiais de contato disponibilizados
                  pelo CIEL IA STUDIO.
                </p>

              </div>

            </section>


            {/* 18 */}

            <section className="section">

              <h2>
                18. Última Atualização
              </h2>

              <div className="subsection">

                <p>
                  <strong>18.1.</strong> Estes Termos de Uso
                  foram atualizados em 30 de agosto de 2026.
                </p>

              </div>

            </section>


            <div className="important">

              <p>
                O CIEL IA STUDIO busca oferecer uma
                experiência segura, responsável e
                transparente. Ao utilizar a Plataforma,
                contribua para manter um ambiente seguro
                e respeitoso para todos.
              </p>

            </div>

          </article>

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
