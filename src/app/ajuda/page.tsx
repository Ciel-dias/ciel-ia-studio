"use client";

import Link from "next/link";

export default function AjudaPage() {
  const perguntas = [
    {
      pergunta: "Como criar uma conta no CIEL IA STUDIO?",
      resposta:
        "Clique em Criar Conta, preencha seu nome, e-mail e senha e aceite os Termos de Uso e a Política de Privacidade. Depois, confirme seu cadastro através do e-mail enviado para você.",
    },
    {
      pergunta: "Como funciona o sistema de créditos?",
      resposta:
        "Os créditos são utilizados para realizar determinadas criações dentro do CIEL IA STUDIO. A quantidade necessária pode variar de acordo com o recurso utilizado.",
    },
    {
      pergunta: "Como criar um prompt?",
      resposta:
        "Acesse Criar Prompts no Dashboard. Digite sua ideia e utilize as ferramentas disponíveis para criar ou melhorar seu prompt.",
    },
    {
      pergunta: "Como criar uma imagem?",
      resposta:
        "Acesse Texto → Imagem, informe o que deseja criar e configure as opções disponíveis. Depois, envie sua solicitação para iniciar a geração.",
    },
    {
      pergunta: "Como criar um vídeo?",
      resposta:
        "Acesse Texto → Vídeo ou Imagem → Vídeo, dependendo do tipo de criação desejada. Configure as opções disponíveis e inicie a geração.",
    },
    {
      pergunta: "Onde encontro minhas criações?",
      resposta:
        "Suas criações podem ser acessadas através da seção Meus Projetos, disponível no Dashboard.",
    },
    {
      pergunta: "Como alterar o tema do CIEL IA STUDIO?",
      resposta:
        "O tema pode ser alterado através do botão de tema representado pelo sol ou pela lua no Dashboard. Também poderá ser configurado pela área Configurações.",
    },
    {
      pergunta: "Não consigo entrar na minha conta. O que fazer?",
      resposta:
        "Verifique se o e-mail e a senha estão corretos. Caso tenha esquecido sua senha, utilize a opção de recuperação de senha disponível na página de login.",
    },
    {
      pergunta: "Uma geração apresentou um problema. O que fazer?",
      resposta:
        "Verifique se as informações enviadas estão corretas e tente novamente. Se o problema continuar, entre em contato com o suporte informando o que aconteceu.",
    },
    {
      pergunta: "Como entrar em contato com o suporte?",
      resposta:
        "Acesse a página Contato do CIEL IA STUDIO para encontrar as formas disponíveis de falar com nossa equipe.",
    },
  ];

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
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          background: #06101e;
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }

        .page {
          min-height: 100vh;
          color: #ffffff;

          background:
            radial-gradient(
              circle at 80% 10%,
              rgba(20, 119, 190, 0.32),
              transparent 36%
            ),
            radial-gradient(
              circle at 10% 70%,
              rgba(15, 76, 125, 0.24),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #06101e 0%,
              #081a30 48%,
              #0b3556 100%
            );

          padding-bottom: 70px;
        }

        .topbar {
          width: 100%;
          min-height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
          padding: 0 42px;

          background: rgba(4, 12, 24, 0.88);

          border-bottom: 1px solid
            rgba(100, 180, 255, 0.18);

          backdrop-filter: blur(12px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;

          color: #ffffff;
          text-decoration: none;
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

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          color: #9fdfff;
          text-decoration: none;

          font-size: 14px;
          font-weight: 700;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .back-link:hover {
          color: #ffffff;

          text-shadow:
            0 0 12px rgba(75, 199, 255, 0.8);
        }

        .content {
          width: min(1000px, calc(100% - 40px));
          margin: 0 auto;
        }

        .hero {
          text-align: center;
          padding: 65px 20px 45px;
        }

        .hero-icon {
          font-size: 52px;
          margin-bottom: 15px;

          filter: drop-shadow(
            0 0 14px rgba(75, 199, 255, 0.65)
          );
        }

        .hero h1 {
          margin: 0;

          font-size: clamp(34px, 5vw, 52px);
          line-height: 1.15;

          font-weight: 800;
          letter-spacing: 0.4px;
        }

        .hero p {
          max-width: 650px;
          margin: 17px auto 0;

          color: #b9c5d4;

          font-size: 17px;
          line-height: 1.6;
        }

        .help-card {
          padding: 30px;

          border-radius: 22px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.96),
              rgba(14, 25, 40, 0.98)
            );

          border: 1px solid
            rgba(88, 201, 255, 0.42);

          box-shadow:
            0 0 18px rgba(43, 167, 255, 0.14),
            inset 0 0 22px
              rgba(56, 174, 255, 0.035);
        }

        .section-title {
          margin: 0 0 24px;

          color: #ffffff;

          font-size: 22px;
          font-weight: 800;
        }

        .faq {
          border-top: 1px solid
            rgba(100, 180, 255, 0.14);
        }

        .faq details {
          border-bottom: 1px solid
            rgba(100, 180, 255, 0.14);
        }

        .faq summary {
          position: relative;

          padding: 21px 42px 21px 4px;

          color: #eaf6ff;

          font-size: 16px;
          font-weight: 700;

          cursor: pointer;

          list-style: none;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .faq summary::-webkit-details-marker {
          display: none;
        }

        .faq summary::after {
          content: "+";

          position: absolute;
          right: 5px;
          top: 17px;

          color: #55caff;

          font-size: 24px;
          font-weight: 400;

          transition: transform 0.2s ease;
        }

        .faq details[open] summary::after {
          content: "−";
        }

        .faq summary:hover {
          color: #6ed7ff;

          text-shadow:
            0 0 10px rgba(75, 199, 255, 0.35);
        }

        .answer {
          padding: 0 42px 22px 4px;

          color: #aebdcd;

          font-size: 14px;
          line-height: 1.7;
        }

        .contact-box {
          margin-top: 25px;

          padding: 25px;

          border-radius: 18px;

          text-align: center;

          background:
            linear-gradient(
              145deg,
              rgba(17, 65, 95, 0.65),
              rgba(8, 28, 48, 0.8)
            );

          border: 1px solid
            rgba(88, 201, 255, 0.28);
        }

        .contact-box h2 {
          margin: 0 0 9px;

          font-size: 20px;
        }

        .contact-box p {
          margin: 0 auto 18px;

          max-width: 600px;

          color: #aebdcd;

          font-size: 14px;
          line-height: 1.6;
        }

        .contact-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          padding: 12px 22px;

          border-radius: 11px;

          background:
            linear-gradient(
              90deg,
              #5ed2ff,
              #75e0ff
            );

          color: #04101b;

          text-decoration: none;

          font-size: 14px;
          font-weight: 800;

          box-shadow:
            0 0 10px
              rgba(70, 199, 255, 0.55);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .contact-button:hover {
          transform: translateY(-2px);

          box-shadow:
            0 0 15px
              rgba(85, 211, 255, 0.8);
        }

        .footer {
          margin-top: 55px;

          text-align: center;

          color: #718297;

          font-size: 13px;
        }

        @media (max-width: 650px) {
          .topbar {
            min-height: 68px;
            padding: 0 17px;
          }

          .brand-name {
            font-size: 16px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .back-link {
            font-size: 12px;
          }

          .content {
            width: min(
              100% - 28px,
              1000px
            );
          }

          .hero {
            padding: 48px 10px 35px;
          }

          .hero-icon {
            font-size: 43px;
          }

          .hero h1 {
            font-size: 34px;
          }

          .hero p {
            font-size: 15px;
          }

          .help-card {
            padding: 22px 18px;
            border-radius: 18px;
          }

          .section-title {
            font-size: 20px;
          }

          .faq summary {
            padding: 19px 35px 19px 2px;
            font-size: 15px;
          }

          .answer {
            padding: 0 35px 20px 2px;
            font-size: 14px;
          }

          .contact-box {
            padding: 22px 17px;
          }
        }
      `}</style>

      <main className="page">

        <header className="topbar">

          {/* CORRIGIDO: Dashboard verdadeiro */}
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

          {/* CORRIGIDO: Dashboard verdadeiro */}
          <Link
            href="/dashboard"
            className="back-link"
          >
            ← Voltar ao Dashboard
          </Link>

        </header>

        <div className="content">

          <section className="hero">

            <div className="hero-icon">
              ❓
            </div>

            <h1>
              Central de Ajuda
            </h1>

            <p>
              Encontre respostas para as principais
              dúvidas sobre o CIEL IA STUDIO.
            </p>

          </section>

          <section className="help-card">

            <h2 className="section-title">
              Perguntas Frequentes
            </h2>

            <div className="faq">

              {perguntas.map((item) => (

                <details key={item.pergunta}>

                  <summary>
                    {item.pergunta}
                  </summary>

                  <div className="answer">
                    {item.resposta}
                  </div>

                </details>

              ))}

            </div>

          </section>

          <section className="contact-box">

            <h2>
              Ainda precisa de ajuda?
            </h2>

            <p>
              Se você não encontrou a resposta que
              procura, entre em contato com nossa
              equipe.
            </p>

            <Link
              href="/contato"
              className="contact-button"
            >
              Falar com o suporte
            </Link>

          </section>

          <footer className="footer">
            © 2026 CIEL IA STUDIO. Todos os direitos
            reservados.
          </footer>

        </div>

      </main>
    </>
  );
}
