"use client";

import Link from "next/link";

export default function PrivacidadePage() {
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

        .privacy-page {
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
          color: #8fdcff;

          text-decoration: none;

          font-size: 15px;

          font-weight: 700;

          white-space: nowrap;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .back:hover {
          color: #72d5ff;

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

        .email-box {
          margin-top: 20px;

          padding: 18px;

          border-radius: 12px;

          background:
            rgba(3, 13, 25, 0.65);

          border:
            1px solid rgba(94, 203, 255, 0.28);

          color: #dce8f4;

          line-height: 1.7;
        }

        /* =========================
           NAVEGAÇÃO FINAL
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
              0 16px;

            gap: 12px;

            flex-wrap: nowrap;
          }

          .brand {
            flex: 1;

            min-width: 0;

            justify-content: flex-start;

            gap: 7px;
          }

          .brand-name {
            font-size: 16px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .back {
            flex-shrink: 0;

            font-size: 13px;
          }

          .content {
            width:
              min(
                100% - 32px,
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
           CELULAR PEQUENO
        ========================= */

        @media (max-width: 390px) {
          .topbar {
            padding:
              0 12px;

            gap: 8px;
          }

          .brand-name {
            font-size: 14px;
          }

          .brand-icon {
            font-size: 21px;
          }

          .back {
            font-size: 12px;
          }
        }
      `}</style>

      <main className="privacy-page">

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
              POLÍTICA DE PRIVACIDADE
            </h1>

            <p>
              Esta Política de Privacidade explica
              como o CIEL IA STUDIO trata, utiliza,
              protege e armazena os dados relacionados
              aos seus usuários.
            </p>

            <div className="updated">
              Última atualização: 30 de agosto de 2026
            </div>

          </div>

          <article className="document">

            <section className="section">

              <h2>
                1. Objetivo
              </h2>

              <div className="subsection">

                <h3>
                  1.1.
                </h3>

                <p>
                  O objetivo desta Política de Privacidade
                  é explicar de maneira clara quais dados
                  podem ser coletados durante a utilização
                  do CIEL IA STUDIO e para quais finalidades
                  esses dados podem ser utilizados.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  1.2.
                </h3>

                <p>
                  O CIEL IA STUDIO busca respeitar a
                  privacidade de seus usuários e adotar
                  medidas razoáveis para proteger as
                  informações tratadas pela plataforma.
                </p>

              </div>

            </section>

            <section className="section">

              <h2>
                2. Dados que podem ser coletados
              </h2>

              <div className="subsection">

                <h3>
                  2.1. Dados de cadastro
                </h3>

                <p>
                  Durante a criação de uma conta, poderão
                  ser solicitadas informações necessárias
                  para identificação e funcionamento da
                  conta, como nome e endereço de e-mail.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  2.2. Dados de autenticação
                </h3>

                <p>
                  Poderão ser tratados dados relacionados
                  ao acesso e autenticação da conta,
                  necessários para permitir que o usuário
                  faça login e utilize os recursos
                  disponíveis.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  2.3. Dados de utilização
                </h3>

                <p>
                  Poderão ser registrados dados técnicos
                  necessários para funcionamento, segurança,
                  diagnóstico de erros e melhoria da
                  plataforma.
                </p>

              </div>

            </section>

            <section className="section">

              <h2>
                3. Conteúdos criados pelo usuário
              </h2>

              <div className="subsection">

                <h3>
                  3.1.
                </h3>

                <p>
                  Dependendo dos recursos utilizados,
                  o usuário poderá enviar textos, prompts,
                  imagens e outros conteúdos para realizar
                  determinadas operações dentro da plataforma.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  3.2.
                </h3>

                <p>
                  Esses conteúdos poderão ser tratados
                  quando isso for necessário para executar
                  uma solicitação realizada pelo próprio
                  usuário, disponibilizar o resultado da
                  operação ou manter recursos relacionados
                  aos projetos do usuário.
                </p>

              </div>

              <div className="highlight">
                O CIEL IA STUDIO não utiliza esta Política
                para afirmar que possui acesso irrestrito
                a tudo o que o usuário faz. O tratamento
                de dados ocorre conforme as finalidades
                informadas e os recursos efetivamente
                utilizados pelo usuário.
              </div>

            </section>

            <section className="section">

              <h2>
                4. Finalidades do tratamento
              </h2>

              <p>
                Os dados tratados poderão ser utilizados
                para finalidades como:
              </p>

              <ul className="list">

                <li>
                  criar e administrar contas de usuário;
                </li>

                <li>
                  permitir o acesso aos recursos do CIEL
                  IA STUDIO;
                </li>

                <li>
                  processar solicitações realizadas pelo
                  usuário;
                </li>

                <li>
                  manter projetos e conteúdos relacionados
                  aos recursos utilizados;
                </li>

                <li>
                  controlar créditos e utilização dos
                  recursos da plataforma;
                </li>

                <li>
                  melhorar estabilidade, desempenho e
                  segurança;
                </li>

                <li>
                  identificar e solucionar falhas técnicas;
                </li>

                <li>
                  cumprir obrigações legais ou regulatórias
                  aplicáveis.
                </li>

              </ul>

            </section>

            <section className="section">

              <h2>
                5. Conta do usuário
              </h2>

              <div className="subsection">

                <h3>
                  5.1.
                </h3>

                <p>
                  O usuário é responsável por fornecer
                  informações verdadeiras, atualizadas
                  e adequadas no momento do cadastro.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  5.2.
                </h3>

                <p>
                  O usuário também deve manter suas
                  credenciais de acesso protegidas e
                  não compartilhá-las com terceiros.
                </p>

              </div>

            </section>

            <section className="section">

              <h2>
                6. Segurança das informações
              </h2>

              <div className="subsection">

                <h3>
                  6.1.
                </h3>

                <p>
                  O CIEL IA STUDIO adota medidas técnicas
                  e organizacionais razoáveis para reduzir
                  riscos de acesso não autorizado, perda,
                  alteração ou divulgação indevida das
                  informações tratadas pela plataforma.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  6.2.
                </h3>

                <p>
                  Apesar das medidas de segurança, nenhum
                  sistema conectado à internet pode garantir
                  segurança absoluta.
                </p>

              </div>

            </section>

            <section className="section">

              <h2>
                7. Compartilhamento de informações
              </h2>

              <div className="subsection">

                <h3>
                  7.1.
                </h3>

                <p>
                  O CIEL IA STUDIO poderá utilizar serviços
                  tecnológicos necessários para disponibilizar
                  seus recursos e manter a infraestrutura da
                  plataforma funcionando.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  7.2.
                </h3>

                <p>
                  Quando houver necessidade de tratamento
                  de dados por prestadores de serviço,
                  buscamos limitar o tratamento ao necessário
                  para a finalidade correspondente.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  7.3.
                </h3>

                <p>
                  Informações também poderão ser fornecidas
                  quando houver obrigação legal, ordem de
                  autoridade competente ou outra hipótese
                  permitida pela legislação aplicável.
                </p>

              </div>

            </section>

            <section className="section">

              <h2>
                8. Cookies e tecnologias semelhantes
              </h2>

              <div className="subsection">

                <h3>
                  8.1.
                </h3>

                <p>
                  O CIEL IA STUDIO poderá utilizar cookies,
                  armazenamento local e tecnologias semelhantes
                  para manter preferências, sessões, configurações
                  e funcionalidades necessárias ao funcionamento
                  da plataforma.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  8.2.
                </h3>

                <p>
                  O usuário poderá controlar determinadas
                  permissões relacionadas a cookies e
                  armazenamento por meio das configurações
                  disponíveis em seu navegador ou dispositivo,
                  quando aplicável.
                </p>

              </div>

            </section>

            <section className="section">

              <h2>
                9. Direitos do titular dos dados
              </h2>

              <div className="subsection">

                <h3>
                  9.1.
                </h3>

                <p>
                  Nos termos da legislação aplicável,
                  especialmente da Lei Geral de Proteção
                  de Dados Pessoais (LGPD), o titular poderá
                  possuir direitos relacionados aos seus
                  dados pessoais.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  9.2.
                </h3>

                <p>
                  Dependendo da situação, esses direitos
                  poderão incluir confirmação da existência
                  de tratamento, acesso, correção, atualização,
                  eliminação de dados quando cabível e
                  outras solicitações previstas em lei.
                </p>

              </div>

              <div className="highlight">
                As solicitações serão analisadas de acordo
                com a legislação aplicável e poderão estar
                sujeitas a limitações e exceções previstas
                em lei.
              </div>

            </section>

            <section className="section">

              <h2>
                10. Retenção das informações
              </h2>

              <div className="subsection">

                <h3>
                  10.1.
                </h3>

                <p>
                  Os dados poderão ser mantidos pelo período
                  necessário para cumprir as finalidades
                  descritas nesta Política, manter os serviços
                  disponíveis e atender obrigações legais,
                  regulatórias ou de segurança.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  10.2.
                </h3>

                <p>
                  Quando não houver mais necessidade legítima
                  de manutenção de determinado dado, ele poderá
                  ser excluído, anonimizado ou submetido a
                  outras medidas permitidas pela legislação.
                </p>

              </div>

            </section>

            <section className="section">

              <h2>
                11. Privacidade de crianças e adolescentes
              </h2>

              <div className="subsection">

                <h3>
                  11.1.
                </h3>

                <p>
                  O CIEL IA STUDIO não tem como objetivo
                  direcionar seus serviços especificamente
                  a crianças.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  11.2.
                </h3>

                <p>
                  Caso seja identificado tratamento inadequado
                  de dados de crianças ou adolescentes, poderão
                  ser adotadas medidas necessárias de acordo
                  com a legislação aplicável.
                </p>

              </div>

            </section>

            <section className="section">

              <h2>
                12. Alterações desta Política
              </h2>

              <div className="subsection">

                <h3>
                  12.1.
                </h3>

                <p>
                  Esta Política de Privacidade poderá ser
                  atualizada periodicamente para refletir
                  alterações na plataforma, nas práticas
                  de tratamento de dados ou na legislação
                  aplicável.
                </p>

              </div>

              <div className="subsection">

                <h3>
                  12.2.
                </h3>

                <p>
                  A versão mais recente ficará disponível
                  nesta página, acompanhada da respectiva
                  data de atualização.
                </p>

              </div>

            </section>

            <section className="section">

              <h2>
                13. Contato
              </h2>

              <div className="subsection">

                <h3>
                  13.1.
                </h3>

                <p>
                  Caso o usuário tenha dúvidas, solicitações
                  ou questões relacionadas à privacidade e
                  ao tratamento de seus dados pessoais,
                  poderá entrar em contato com o CIEL IA STUDIO
                  pelos canais oficiais disponibilizados
                  pela plataforma.
                </p>

              </div>

              <div className="email-box">

                <strong>
                  Canal de contato:
                </strong>

                <br />

                Entre em contato pelo endereço de e-mail
                oficial disponibilizado pelo CIEL IA STUDIO.

              </div>

            </section>

            {/* =========================
                NAVEGAÇÃO
            ========================= */}

            <div className="document-navigation">

              <Link href="/termos">
                ← Termos de Uso
              </Link>

              <Link href="/dashboard">
                Voltar ao Dashboard →
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
