"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/ThemeProvider";

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();

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

        setEmail(user.email ?? "");

        setNome(
          user.user_metadata?.nome ||
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            ""
        );
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleChangePassword() {
    setMessage("");
    setError("");

    if (!newPassword) {
      setError("Digite uma nova senha.");
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setChangingPassword(true);

      const supabase = createClient();

      const { error: passwordError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (passwordError) {
        throw passwordError;
      }

      setMessage("Senha alterada com sucesso!");

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Erro ao alterar senha:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível alterar a senha."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleLogout() {
    try {
      const supabase = createClient();

      await supabase.auth.signOut();

      window.location.replace("/login");
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            theme === "dark"
              ? "#07111f"
              : "#eef8ff",
          color:
            theme === "dark"
              ? "#ffffff"
              : "#101827",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        Carregando...
      </main>
    );
  }

  const dark = theme === "dark";

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
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }

        /* =========================
           PÁGINA
        ========================= */

        .settings-page {
          min-height: 100vh;

          color: ${dark
            ? "#ffffff"
            : "#101827"};

          background:
            ${
              dark
                ? `
              radial-gradient(
                circle at 80% 10%,
                rgba(20, 119, 190, 0.35),
                transparent 38%
              ),
              radial-gradient(
                circle at 10% 70%,
                rgba(15, 76, 125, 0.25),
                transparent 40%
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
                rgba(91, 190, 255, 0.28),
                transparent 35%
              ),
              radial-gradient(
                circle at 10% 70%,
                rgba(80, 150, 220, 0.18),
                transparent 40%
              ),
              linear-gradient(
                135deg,
                #eef8ff 0%,
                #e6f3fc 48%,
                #d8edf9 100%
              )
            `
            };

          transition:
            background 0.35s ease,
            color 0.35s ease;

          overflow-x: hidden;
        }

        /* =========================
           CABEÇALHO
        ========================= */

        .topbar {
          width: 100%;
          min-height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          padding: 0 42px;

          background: ${
            dark
              ? "rgba(4, 12, 24, 0.92)"
              : "rgba(245, 251, 255, 0.92)"
          };

          border-bottom:
            1px solid
            ${
              dark
                ? "rgba(100, 180, 255, 0.18)"
                : "rgba(40, 130, 180, 0.18)"
            };

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
          font-size: 28px;

          filter:
            drop-shadow(
              0 0 10px
              rgba(75, 199, 255, 0.8)
            );
        }

        .brand-name {
          font-size: 20px;

          font-weight: 800;

          letter-spacing: 0.5px;

          color: ${
            dark
              ? "#ffffff"
              : "#101827"
          };
        }

        .back-link {
          color: #7bd8ff;

          text-decoration: none;

          font-size: 17px;

          font-weight: 700;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .back-link:hover {
          color: #b4ecff;

          text-shadow:
            0 0 12px
            rgba(75, 199, 255, 0.8);

          transform:
            translateX(-2px);
        }

        /* =========================
           CONTAINER
        ========================= */

        .settings-container {
          width:
            min(
              700px,
              100%
            );

          margin: 0 auto;

          padding:
            55px 20px 70px;
        }

        /* =========================
           TÍTULO
        ========================= */

        .header {
          margin-bottom: 30px;

          text-align: center;
        }

        .header h1 {
          margin: 0;

          font-size:
            clamp(
              32px,
              5vw,
              50px
            );

          line-height: 1.12;

          font-weight: 800;

          text-transform: uppercase;

          background:
            linear-gradient(
              90deg,
              #ffffff 0%,
              #dff8ff 20%,
              #82dcff 45%,
              #24baff 65%,
              #dff8ff 85%,
              #ffffff 100%
            );

          background-size:
            200% auto;

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;

          text-shadow:
            0 0 18px
            rgba(
              70,
              200,
              255,
              0.35
            );

          animation:
            title-shine 4s
            linear infinite;
        }

        @keyframes title-shine {
          0% {
            background-position:
              200% center;
          }

          100% {
            background-position:
              -200% center;
          }
        }

        .header p {
          margin:
            15px auto 0;

          max-width: 650px;

          color:
            ${dark
              ? "#b7c5d5"
              : "#536579"};

          font-size: 16px;

          line-height: 1.5;
        }

        /* =========================
           SEÇÕES
        ========================= */

        .section {
          margin-bottom: 20px;

          padding: 26px;

          border-radius: 20px;

          background:
            ${
              dark
                ? `
              linear-gradient(
                145deg,
                rgba(35, 47, 65, 0.94),
                rgba(14, 25, 40, 0.96)
              )
            `
                : `
              linear-gradient(
                145deg,
                rgba(255, 255, 255, 0.96),
                rgba(225, 241, 251, 0.96)
              )
            `
            };

          border:
            1px solid
            ${
              dark
                ? "rgba(88, 201, 255, 0.35)"
                : "rgba(59, 184, 237, 0.35)"
            };

          box-shadow:
            0 0 15px
            ${
              dark
                ? "rgba(43, 167, 255, 0.16)"
                : "rgba(43, 167, 255, 0.10)"
            };

          transition:
            background 0.35s ease,
            border-color 0.35s ease;
        }

        .section h2 {
          margin:
            0 0 20px;

          font-size: 20px;

          font-weight: 700;
        }

        /* =========================
           INFORMAÇÕES
        ========================= */

        .info {
          margin-bottom: 18px;
        }

        .info:last-child {
          margin-bottom: 0;
        }

        .label {
          margin:
            0 0 6px;

          color:
            ${dark
              ? "#8f9eaf"
              : "#637587"};

          font-size: 13px;
        }

        .value {
          margin: 0;

          color:
            ${dark
              ? "#ffffff"
              : "#142132"};

          font-size: 16px;

          word-break:
            break-word;
        }

        /* =========================
           TEMAS
        ========================= */

        .theme-options {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 14px;
        }

        .theme-option {
          min-height: 90px;

          padding: 18px;

          border-radius: 14px;

          border:
            2px solid
            ${
              dark
                ? "rgba(100, 180, 255, 0.20)"
                : "rgba(40, 110, 160, 0.20)"
            };

          background:
            ${
              dark
                ? "rgba(8, 20, 34, 0.75)"
                : "rgba(255, 255, 255, 0.65)"
            };

          color:
            ${dark
              ? "#ffffff"
              : "#142132"};

          cursor: pointer;

          text-align: left;

          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .theme-option:hover {
          transform:
            translateY(-2px);

          border-color:
            #159ddd;
        }

        .theme-option.active {
          border-color:
            #159ddd;

          box-shadow:
            0 0 15px
            ${
              dark
                ? "rgba(21, 157, 221, 0.35)"
                : "rgba(21, 157, 221, 0.20)"
            };
        }

        .theme-icon {
          font-size: 25px;

          margin-bottom: 8px;
        }

        .theme-title {
          display: block;

          font-size: 15px;

          font-weight: 700;
        }

        .theme-description {
          display: block;

          margin-top: 4px;

          color:
            ${dark
              ? "#9eacbd"
              : "#607285"};

          font-size: 12px;
        }

        /* =========================
           SEGURANÇA
        ========================= */

        .password-fields {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 14px;
        }

        .input-group label {
          display: block;

          margin-bottom: 8px;

          color:
            ${dark
              ? "#b7c7d8"
              : "#536579"};

          font-size: 13px;

          font-weight: 700;
        }

        .input {
          width: 100%;

          padding: 14px;

          border-radius: 12px;

          border:
            1px solid
            ${
              dark
                ? "rgba(94, 203, 255, 0.3)"
                : "rgba(40, 130, 180, 0.3)"
            };

          outline: none;

          background:
            ${
              dark
                ? "rgba(3, 13, 25, 0.8)"
                : "rgba(255, 255, 255, 0.75)"
            };

          color:
            ${dark
              ? "#ffffff"
              : "#142132"};

          font-size: 14px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .input::placeholder {
          color:
            ${dark
              ? "#71869b"
              : "#8293a5"};
        }

        .input:focus {
          border-color:
            #63d3ff;

          box-shadow:
            0 0 15px
            rgba(
              70,
              199,
              255,
              0.2
            );
        }

        .password-button {
          width: 100%;

          margin-top: 18px;

          padding: 14px;

          border: none;

          border-radius: 12px;

          cursor: pointer;

          color: #04101b;

          background:
            linear-gradient(
              90deg,
              #5ed2ff,
              #75e0ff
            );

          font-size: 15px;

          font-weight: 800;

          box-shadow:
            0 0 10px
            rgba(
              70,
              199,
              255,
              0.6
            );

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .password-button:hover:not(:disabled) {
          transform:
            translateY(-2px);

          box-shadow:
            0 0 18px
            rgba(
              70,
              199,
              255,
              0.75
            );
        }

        .password-button:disabled {
          opacity: 0.6;

          cursor: wait;
        }

        .message,
        .error {
          margin-top: 15px;

          padding:
            13px 15px;

          border-radius: 11px;

          font-size: 13px;

          line-height: 1.5;
        }

        .message {
          background:
            rgba(
              35,
              170,
              115,
              0.12
            );

          border:
            1px solid
            rgba(
              65,
              220,
              160,
              0.3
            );

          color:
            #8ff0c6;
        }

        .error {
          background:
            rgba(
              220,
              70,
              70,
              0.12
            );

          border:
            1px solid
            rgba(
              255,
              100,
              100,
              0.3
            );

          color:
            #ffb0b0;
        }

        /* =========================
           BOTÃO SAIR
           MESMO TAMANHO DO
           BOTÃO ALTERAR SENHA
        ========================= */

        .logout-button {
          width: 100%;

          margin: 0;

          padding: 14px;

          border-radius: 12px;

          border:
            1px solid
            rgba(
              255,
              92,
              125,
              0.45
            );

          cursor: pointer;

          color: #ffb0bc;

          background:
            rgba(
              35,
              22,
              38,
              0.82
            );

          font-size: 15px;

          font-weight: 800;

          box-shadow:
            0 0 10px
            rgba(
              255,
              70,
              105,
              0.12
            );

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .logout-button:hover {
          transform:
            translateY(-2px);

          border-color:
            rgba(
              255,
              100,
              130,
              0.75
            );

          background:
            rgba(
              45,
              25,
              42,
              0.9
            );

          box-shadow:
            0 0 18px
            rgba(
              255,
              70,
              105,
              0.22
            );
        }

        /* =========================
           RODAPÉ
        ========================= */

        .footer {
          border-top:
            1px solid
            rgba(
              100,
              180,
              255,
              0.18
            );

          background:
            linear-gradient(
              180deg,
              rgba(
                4,
                15,
                29,
                0.96
              ),
              rgba(
                3,
                11,
                22,
                1
              )
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
        }

        .footer-brand p {
          margin: 0;

          color: #9eacbd;

          font-size: 15px;
        }

        .footer-columns {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              1fr
            );

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
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .footer-column a:hover {
          color: #68d2ff;

          text-shadow:
            0 0 8px
            rgba(
              70,
              199,
              255,
              0.35
            );
        }

        .footer-bottom {
          margin-top: 36px;

          padding-top: 22px;

          border-top:
            1px solid
            rgba(
              100,
              180,
              255,
              0.16
            );

          text-align: center;

          color: #8997a9;

          font-size: 13px;
        }

        /* =========================
           RESPONSIVO
        ========================= */

        @media (max-width: 700px) {
          .topbar {
            padding:
              0 20px;
          }

          .brand-name {
            font-size: 18px;
          }

          .back-link {
            font-size: 15px;
          }

          .settings-container {
            padding:
              45px 16px 55px;
          }

          .password-fields {
            grid-template-columns:
              1fr;
          }
        }

        @media (max-width: 480px) {
          .topbar {
            min-height: 68px;

            padding:
              0 15px;
          }

          .brand {
            gap: 7px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .brand-name {
            font-size: 15px;
          }

          .back-link {
            font-size: 13px;
          }

          .settings-container {
            padding:
              38px 12px 50px;
          }

          .header h1 {
            font-size: 34px;
          }

          .header p {
            font-size: 15px;
          }

          .section {
            padding: 21px;
          }

          .theme-options {
            grid-template-columns:
              1fr;
          }

          .footer {
            padding:
              42px 24px 22px;
          }

          .footer-columns {
            grid-template-columns:
              1fr;

            gap: 30px;
          }
        }
      `}</style>

      <main className="settings-page">

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
            className="back-link"
          >
            ← Voltar ao Dashboard
          </Link>

        </header>

        {/* =========================
            CONTEÚDO
        ========================= */}

        <div className="settings-container">

          <header className="header">

            <h1>
              CONFIGURAÇÕES
            </h1>

            <p>
              Gerencie sua conta e personalize o
              CIEL IA STUDIO.
            </p>

          </header>

          {/* =========================
              CONTA
          ========================= */}

          <section className="section">

            <h2>
              Sua conta
            </h2>

            <div className="info">

              <p className="label">
                Nome
              </p>

              <p className="value">
                {nome || "Não informado"}
              </p>

            </div>

            <div className="info">

              <p className="label">
                E-mail
              </p>

              <p className="value">
                {email || "—"}
              </p>

            </div>

          </section>

          {/* =========================
              APARÊNCIA
          ========================= */}

          <section className="section">

            <h2>
              Aparência
            </h2>

            <div className="theme-options">

              <button
                type="button"
                className={`theme-option ${
                  theme === "dark"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTheme("dark")
                }
              >

                <div className="theme-icon">
                  🌙
                </div>

                <span className="theme-title">
                  Tema escuro
                </span>

                <span className="theme-description">
                  Visual futurista escuro
                </span>

              </button>

              <button
                type="button"
                className={`theme-option ${
                  theme === "light"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setTheme("light")
                }
              >

                <div className="theme-icon">
                  ☀️
                </div>

                <span className="theme-title">
                  Tema claro
                </span>

                <span className="theme-description">
                  Visual claro e moderno
                </span>

              </button>

            </div>

          </section>

          {/* =========================
              SEGURANÇA
          ========================= */}

          <section className="section">

            <h2>
              🔐 Alterar senha
            </h2>

            <div className="password-fields">

              <div className="input-group">

                <label>
                  Nova senha
                </label>

                <input
                  type="password"
                  className="input"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Digite a nova senha"
                />

              </div>

              <div className="input-group">

                <label>
                  Confirmar nova senha
                </label>

                <input
                  type="password"
                  className="input"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirme a nova senha"
                />

              </div>

            </div>

            <button
              type="button"
              className="password-button"
              onClick={
                handleChangePassword
              }
              disabled={
                changingPassword
              }
            >
              {changingPassword
                ? "Alterando senha..."
                : "🔐 Alterar senha"}
            </button>

            {message && (
              <div className="message">
                {message}
              </div>
            )}

            {error && (
              <div className="error">
                {error}
              </div>
            )}

          </section>

          {/* =========================
              SAIR
          ========================= */}

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            🚪 Sair da conta
          </button>

        </div>

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
