"use client";

import Link from "next/link";

export default function TermosPage() {
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

        .terms-page {
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

          flex-shrink: 0;
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
          color: #72d5ff;

          text-decoration: none;

          font-size: 15px;

          font-weight: 700;

          white-space: nowrap;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .back:hover {
          color: #a4e9ff;

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

        .title-area {
          text-align: center;

          margin-bottom: 42px;
        }

        .title-area h1 {
          margin: 0;

          font-size:
            clamp(34px, 5vw, 54px);

          line-height: 1.12;

          font-weight: 700;

          letter-spacing: 0.5px;

          text-transform: uppercase;
        }

        .title-area p {
          max-width: 720px;

          margin:
            18px auto 0;

          color: #b9c5d4;

          font-size:
            clamp(16px, 2vw, 19px);

          line-height: 1.6;
        }

        .updated {
          margin-top: 14px;

          color: #7f91a5;

          font-size: 13px;
        }

        /* =========================
           DOCUMENTO
        ========================= */

        .document {
          width: 100%;

          padding: 38px;

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
            0 0 8px rgba(70, 199, 255, 0.75),
            0 0 22px rgba(43, 167, 255, 0.35),
            inset 0 0 22px rgba(56, 174, 255, 0.06);
        }

        .section {
          margin-bottom: 38px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section h2 {
          margin:
            0 0 16px;

          color: #ffffff;

          font-size: 22px;

          line-height: 1.35;
        }

        .subsection {
          margin:
            0 0 14px;

          padding-left: 4px;
        }

        .subsection h3 {
          margin:
            0 0 7px;

          color: #68d2ff;

          font-size: 16px;

          line-height: 1.4;
        }

        .subsection p,
        .section > p {
          margin:
            0 0 12px;

          color: #c0cad6;

          font-size: 15px;

          line-height: 1.75;
        }

        .subsection p:last-child {
          margin-bottom: 0;
        }

        .highlight {
          margin:
            18px 0;

          padding: 18px 20px;

          border-left:
            3px solid #58c9ff;

          border-radius: 10px;

          background:
            rgba(20, 119, 190, 0.12);

          color: #dce8f4;

          font-size: 15px;

          line-height: 1.7;
        }

        .list {
          margin:
            10px 0 0;

          padding-left: 24px;

          color: #c0cad6;

          font-size: 15px;

          line-height: 1.8;
        }

        .list li {
          margin-bottom: 7px;
        }

        /* =========================
           NAVEGAÇÃO
        ========================= */

        .document-navigation {
          display: flex;

          justify-content: space-between;

          gap: 16px;

          margin-top: 34px;

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
            0 18px;

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

          .document {
            padding: 30px;
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

            gap: 12px;

            flex-wrap: nowrap;

            justify-content: space-between;
          }

          .brand {
            width: auto;

            justify-content: flex-start;

            gap: 7px;

            min-width: 0;
          }

          .brand-icon {
            font-size: 23px;
          }

          .brand-name {
            font-size: 16px;

            letter-spacing: 0.2px;
          }

          .back {
            font-size: 13px;

            flex-shrink: 0;
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

          .title-area {
            margin-bottom: 30px;
          }

          .title-area h1 {
            font-size: 34px;
          }

          .title-area p {
            font-size: 16px;
          }

          .document {
            padding: 23px;

            border-radius: 19px;
          }

          .section {
            margin-bottom: 32px;
          }

          .section h2 {
            font-size: 20px;
          }

          .subsection h3 {
            font-size: 15px;
          }

          .subsection p,
          .section > p,
          .list {
            font-size: 14px;

            line-height: 1.7;
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
           CELULARES MUITO PEQUENOS
        ========================= */

        @media (max-width: 390px) {
          .topbar {
            padding:
              13px 12px;

            gap: 8px;
          }

          .brand {
            gap: 5px;
          }

          .brand-icon {
            font-size: 20px;
          }

          .brand-name {
            font-size: 14px;
          }

          .back {
            font-size: 11px;
          }
        }
      `}</style>

      <main className="terms-page">

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

          <div className="title-area">

            <h1>
              TERMOS DE USO
            </h1>

            <p>
              Leia atentamente as condições para
              utilização dos serviços e recursos
              disponibilizados pelo CIEL IA STUDIO.
            </p>

            <div className="updated">
              Última atualização: 30 de agosto de 2026
            </div>

          </div>

          <article className="document">

            {/* 1 */}

            <section className="section">

              <h2>
                1. Aceitação dos Termos
              </h2>

              <div className="subsection">
                <h3>1.1.</h3>

                <p>
                  Ao criar uma conta ou utilizar o
                  CIEL IA STUDIO, o usuário declara que
                  leu, compreendeu e concorda com estes
                  Termos de Uso.
                </p>
              </div>

              <div className="subsection">
                <h3>1.2.</h3>

                <p>
                  Caso o usuário não concorde com estes
                  Termos, deverá deixar de utilizar os
                  serviços disponibilizados pela plataforma.
                </p>
              </div>

            </section>

            {/* 2 */}

            <section className="section">

              <h2>
                2. Sobre o CIEL IA STUDIO
              </h2>

              <div className="subsection">
                <h3>2.1.</h3>

                <p>
                  O CIEL IA STUDIO é uma plataforma
                  destinada à criação e transformação
                  de conteúdos utilizando recursos de
                  inteligência artificial.
                </p>
              </div>

              <div className="subsection">
                <h3>2.2.</h3>

                <p>
                  Os recursos disponíveis podem incluir
                  criação de prompts, imagens, vídeos e
                  outras ferramentas de criação assistida
                  por inteligência artificial.
                </p>
              </div>

            </section>

            {/* 3 */}

            <section className="section">

              <h2>
                3. Cadastro e Conta
              </h2>

              <div className="subsection">
                <h3>3.1.</h3>

                <p>
                  Para utilizar determinados recursos,
                  poderá ser necessário criar uma conta
                  fornecendo informações verdadeiras e
                  atualizadas.
                </p>
              </div>

              <div className="subsection">
                <h3>3.2.</h3>

                <p>
                  O usuário é responsável por manter a
                  segurança de suas credenciais de acesso
                  e por todas as atividades realizadas
                  mediante sua conta.
                </p>
              </div>

              <div className="subsection">
                <h3>3.3.</h3>

                <p>
                  O usuário não deverá compartilhar suas
                  credenciais de acesso com terceiros.
                </p>
              </div>

            </section>

            {/* 4 */}

            <section className="section">

              <h2>
                4. Uso dos Recursos de Inteligência Artificial
              </h2>

              <div className="subsection">
                <h3>4.1.</h3>

                <p>
                  Os recursos de inteligência artificial
                  são disponibilizados para auxiliar o
                  usuário na criação e transformação de
                  conteúdos.
                </p>
              </div>

              <div className="subsection">
                <h3>4.2.</h3>

                <p>
                  Os resultados produzidos por sistemas
                  de inteligência artificial podem variar
                  e não há garantia de que todas as
                  gerações atenderão exatamente às
                  expectativas do usuário.
                </p>
              </div>

              <div className="subsection">
                <h3>4.3.</h3>

                <p>
                  O usuário é responsável por analisar
                  e utilizar adequadamente os conteúdos
                  gerados antes de publicá-los ou
                  utilizá-los em qualquer finalidade.
                </p>
              </div>

            </section>

            {/* 5 */}

            <section className="section">

              <h2>
                5. Conteúdo do Usuário
              </h2>

              <div className="subsection">
                <h3>5.1.</h3>

                <p>
                  O usuário é responsável pelos textos,
                  prompts, imagens, vídeos e demais
                  conteúdos que enviar ou utilizar na
                  plataforma.
                </p>
              </div>

              <div className="subsection">
                <h3>5.2.</h3>

                <p>
                  O usuário declara possuir os direitos,
                  autorizações ou permissões necessárias
                  para utilizar conteúdos de terceiros
                  que eventualmente sejam enviados à
                  plataforma.
                </p>
              </div>

            </section>

            {/* 6 */}

            <section className="section">

              <h2>
                6. Conteúdo Proibido
              </h2>

              <p>
                É proibida a utilização do CIEL IA STUDIO
                para criar, enviar, solicitar, armazenar
                ou distribuir conteúdos que violem a
                legislação aplicável ou estes Termos.
              </p>

              <ul className="list">

                <li>
                  conteúdo sexual explícito ou pornográfico;
                </li>

                <li>
                  conteúdo íntimo envolvendo pessoas sem
                  autorização;
                </li>

                <li>
                  conteúdo sexual envolvendo menores de
                  idade, em qualquer circunstância;
                </li>

                <li>
                  conteúdo destinado à exploração ou abuso
                  sexual;
                </li>

                <li>
                  conteúdo que incentive violência,
                  exploração, abuso ou atividades criminosas;
                </li>

                <li>
                  conteúdo que viole direitos autorais,
                  marcas, imagem, privacidade ou outros
                  direitos de terceiros;
                </li>

                <li>
                  qualquer outro conteúdo proibido pela
                  legislação aplicável ou pelas regras
                  da plataforma.
                </li>

              </ul>

              <div className="highlight">
                O CIEL IA STUDIO poderá adotar medidas
                técnicas e administrativas para impedir,
                limitar ou remover conteúdos que violem
                estes Termos ou a legislação aplicável.
              </div>

            </section>

            {/* 7 */}

            <section className="section">

              <h2>
                7. Créditos e Recursos
              </h2>

              <div className="subsection">
                <h3>7.1.</h3>

                <p>
                  Alguns recursos do CIEL IA STUDIO
                  poderão utilizar um sistema de créditos
                  ou limites de utilização.
                </p>
              </div>

              <div className="subsection">
                <h3>7.2.</h3>

                <p>
                  As regras relacionadas a créditos,
                  limites, planos e recursos poderão
                  ser apresentadas na própria plataforma.
                </p>
              </div>

            </section>

            {/* 8 */}

            <section className="section">

              <h2>
                8. Propriedade Intelectual
              </h2>

              <div className="subsection">
                <h3>8.1.</h3>

                <p>
                  A identidade visual, marca, código,
                  estrutura, textos, elementos gráficos
                  e demais componentes do CIEL IA STUDIO
                  pertencem aos seus respectivos titulares
                  e são protegidos pela legislação aplicável.
                </p>
              </div>

              <div className="subsection">
                <h3>8.2.</h3>

                <p>
                  É proibida a reprodução, cópia,
                  modificação ou exploração indevida
                  dos elementos protegidos da plataforma
                  sem autorização.
                </p>
              </div>

            </section>

            {/* 9 */}

            <section className="section">

              <h2>
                9. Disponibilidade do Serviço
              </h2>

              <div className="subsection">
                <h3>9.1.</h3>

                <p>
                  O CIEL IA STUDIO busca manter seus
                  serviços disponíveis e funcionando
                  adequadamente, mas podem ocorrer
                  indisponibilidades, manutenções,
                  atualizações, falhas técnicas ou
                  interrupções.
                </p>
              </div>

              <div className="subsection">
                <h3>9.2.</h3>

                <p>
                  A plataforma poderá realizar alterações,
                  atualizações ou melhorias nos recursos
                  disponibilizados.
                </p>
              </div>

            </section>

            {/* 10 */}

            <section className="section">

              <h2>
                10. Suspensão ou Encerramento de Conta
              </h2>

              <div className="subsection">
                <h3>10.1.</h3>

                <p>
                  O CIEL IA STUDIO poderá suspender ou
                  encerrar uma conta quando houver violação
                  destes Termos, uso ilegal da plataforma,
                  tentativa de fraude, abuso dos recursos
                  ou outras situações que justifiquem a
                  medida.
                </p>
              </div>

              <div className="subsection">
                <h3>10.2.</h3>

                <p>
                  Quando apropriado e permitido pela
                  legislação aplicável, poderão ser adotadas
                  medidas antes do encerramento definitivo
                  da conta.
                </p>
              </div>

            </section>

            {/* 11 */}

            <section className="section">

              <h2>
                11. Responsabilidade do Usuário
              </h2>

              <div className="subsection">
                <h3>11.1.</h3>

                <p>
                  O usuário é responsável pela utilização
                  que fizer da plataforma e pelos conteúdos
                  que criar, enviar, publicar ou distribuir.
                </p>
              </div>

              <div className="subsection">
                <h3>11.2.</h3>

                <p>
                  O usuário deverá respeitar a legislação
                  brasileira e os direitos de outras pessoas
                  durante a utilização do CIEL IA STUDIO.
                </p>
              </div>

            </section>

            {/* 12 */}

            <section className="section">

              <h2>
                12. Alterações dos Termos
              </h2>

              <div className="subsection">
                <h3>12.1.</h3>

                <p>
                  Estes Termos de Uso poderão ser atualizados
                  para refletir alterações na plataforma,
                  nos recursos disponibilizados ou na
                  legislação aplicável.
                </p>
              </div>

              <div className="subsection">
                <h3>12.2.</h3>

                <p>
                  A versão mais recente estará disponível
                  nesta página e indicará a respectiva
                  data de atualização.
                </p>
              </div>

            </section>

            {/* 13 */}

            <section className="section">

              <h2>
                13. Lei Aplicável
              </h2>

              <div className="subsection">
                <h3>13.1.</h3>

                <p>
                  Estes Termos são interpretados de acordo
                  com a legislação aplicável da República
                  Federativa do Brasil, sem prejuízo dos
                  direitos assegurados aos usuários pela
                  legislação vigente.
                </p>
              </div>

            </section>

            {/* 14 */}

            <section className="section">

              <h2>
                14. Contato
              </h2>

              <div className="subsection">
                <h3>14.1.</h3>

                <p>
                  Para dúvidas, solicitações ou assuntos
                  relacionados a estes Termos de Uso,
                  o usuário poderá utilizar os canais
                  oficiais de contato disponibilizados
                  pelo CIEL IA STUDIO.
                </p>
              </div>

            </section>

            {/* =========================
                NAVEGAÇÃO FINAL
            ========================= */}

            <div className="document-navigation">

              <Link href="/dashboard">
                ← Voltar ao Dashboard
              </Link>

              <Link href="/privacidade">
                Política de Privacidade →
              </Link>

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
