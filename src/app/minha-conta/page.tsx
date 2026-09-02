"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(
        supabaseUrl,
        supabaseAnonKey
      )
    : null;

export default function MinhaContaPage() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // 💎 Saldo real de Diamantes vindo do Supabase
  const [credits, setCredits] = useState(0);

  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    try {
      setLoading(true);
      setError("");

      if (!supabase) {
        setError(
          "Configuração do Supabase não encontrada."
        );
        return;
      }

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

      setEmail(user.email || "");
      setUserId(user.id || "");

      if (user.created_at) {
        setCreatedAt(
          new Date(
            user.created_at
          ).toLocaleDateString("pt-BR")
        );
      }

      // ==========================================
      // 💎 CARREGAR DIAMANTES REAIS DO SUPABASE
      // ==========================================

      const {
        data: creditsData,
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

        setCredits(0);
      } else {
        // ==========================================
        // CORREÇÃO DE TIPAGEM DO CAMPO equilíbrio
        // ==========================================

        const saldo = creditsData as {
          equilíbrio?: number | string | null;
        } | null;

        setCredits(
          Number(saldo?.equilíbrio) || 0
        );
      }
    } catch (err) {
      console.error(
        "Erro ao carregar conta:",
        err
      );

      setError(
        "Não foi possível carregar os dados da conta."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // ALTERAR SENHA
  // ==========================================

  async function handleChangePassword() {
    setMessage("");
    setError("");

    if (!newPassword) {
      setError("Digite uma nova senha.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "A senha precisa ter pelo menos 6 caracteres."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "As senhas não coincidem."
      );
      return;
    }

    if (!supabase) {
      setError(
        "Supabase não configurado."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const { error } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (error) {
        throw error;
      }

      setMessage(
        "Senha alterada com sucesso!"
      );

      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(
        "Erro ao alterar senha:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível alterar a senha."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  async function handleLogout() {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }

      window.location.replace("/login");
    } catch (err) {
      console.error(
        "Erro ao sair:",
        err
      );

      setError(
        "Não foi possível sair da conta."
      );
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
          background: #07111f;
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

        .page {
          min-height: 100vh;
          color: #fff;

          background:
            radial-gradient(
              circle at 80% 15%,
              rgba(20, 119, 190, 0.4),
              transparent 38%
            ),
            radial-gradient(
              circle at 15% 70%,
              rgba(15, 76, 125, 0.28),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #06101e 0%,
              #081a30 48%,
              #0b3556 100%
            );

          overflow-x: hidden;
        }

        /* ================================
           CABEÇALHO
        ================================= */

        .topbar {
          width: 100%;
          min-height: 74px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
          padding: 0 42px;

          background:
            rgba(4, 12, 24, 0.88);

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
        }

        .brand-name {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.4px;
          color: #ffffff;
        }

        .back {
          display: flex;
          align-items: center;

          color: #e8eef7;

          text-decoration: none;

          font-size: 15px;
          font-weight: 600;

          white-space: nowrap;

          transition:
            color 0.2s ease,
            text-shadow 0.2s ease;
        }

        .back:hover {
          color: #159ddd;

          text-shadow:
            0 0 12px
            rgba(75, 199, 255, 0.6);
        }

        /* ================================
           CONTEÚDO
        ================================= */

        .content {
          width:
            min(
              1050px,
              calc(100% - 40px)
            );

          margin: 0 auto;

          padding:
            55px 0 70px;
        }

        .title-area {
          text-align: center;

          margin-bottom: 38px;
        }

        .title-area h1 {
          margin: 0;

          font-size:
            clamp(
              32px,
              5vw,
              50px
            );
        }

        .title-area p {
          margin:
            14px auto 0;

          max-width: 650px;

          color: #b7c5d5;

          font-size: 17px;
          line-height: 1.5;
        }

        /* ================================
           GRID
        ================================= */

        .account-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 24px;
        }

        /* ================================
           CARDS
        ================================= */

        .card {
          border-radius: 22px;

          padding: 28px;

          background:
            linear-gradient(
              145deg,
              rgba(35, 47, 65, 0.95),
              rgba(14, 25, 40, 0.97)
            );

          border:
            2px solid #58c9ff;

          box-shadow:
            0 0 8px
              rgba(70, 199, 255, 0.8),
            0 0 22px
              rgba(43, 167, 255, 0.35),
            inset 0 0 22px
              rgba(56, 174, 255, 0.07);
        }

        .card h2 {
          margin:
            0 0 22px;

          font-size: 21px;
        }

        /* ================================
           PERFIL
        ================================= */

        .profile {
          text-align: center;

          padding:
            10px 0 18px;
        }

        .avatar {
          width: 92px;
          height: 92px;

          margin:
            0 auto 18px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #5ed2ff,
              #75e0ff
            );

          color: #04101b;

          font-size: 43px;

          box-shadow:
            0 0 15px
              rgba(70, 199, 255, 0.75),
            0 0 35px
              rgba(43, 167, 255, 0.3);
        }

        .profile h2 {
          margin:
            0 0 8px;

          font-size: 24px;
        }

        .profile p {
          margin: 0;

          color: #9fb0c2;

          font-size: 14px;

          word-break: break-word;
        }

        /* ================================
           INFORMAÇÕES
        ================================= */

        .info-list {
          display: flex;
          flex-direction: column;

          gap: 13px;
        }

        .info-row {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 20px;

          padding:
            14px 15px;

          border-radius: 12px;

          background:
            rgba(3, 13, 25, 0.62);

          border:
            1px solid
            rgba(94, 203, 255, 0.18);
        }

        .info-label {
          color: #91a4b7;

          font-size: 13px;
        }

        .info-value {
          color: #dcefff;

          font-size: 14px;
          font-weight: 700;

          text-align: right;

          word-break: break-word;
        }

        /* ================================
           💎 DIAMANTES
        ================================= */

        .credits-card {
          grid-column: span 2;
        }

        .credits-box {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 20px;

          padding: 22px;

          border-radius: 16px;

          background:
            linear-gradient(
              135deg,
              rgba(30, 125, 170, 0.2),
              rgba(3, 22, 40, 0.65)
            );

          border:
            1px solid
            rgba(94, 203, 255, 0.3);
        }

        .credits-title {
          color: #b9c9d9;

          font-size: 14px;

          margin-bottom: 7px;
        }

        .credits-number {
          font-size: 38px;

          font-weight: 800;

          color: #fff;
        }

        .credits-number span {
          font-size: 25px;
        }

        .diamond {
          font-size: 55px;

          filter:
            drop-shadow(
              0 0 10px
              rgba(100, 220, 255, 0.7)
            );
        }

        /* ================================
           SENHA
        ================================= */

        .password-card {
          grid-column: span 2;
        }

        .password-fields {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 14px;
        }

        .input-group label {
          display: block;

          margin-bottom: 8px;

          color: #b7c7d8;

          font-size: 13px;
          font-weight: 700;
        }

        .input {
          width: 100%;

          padding: 14px;

          border-radius: 12px;

          border:
            1px solid
            rgba(94, 203, 255, 0.3);

          outline: none;

          background:
            rgba(3, 13, 25, 0.8);

          color: #fff;

          font-size: 14px;
        }

        .input:focus {
          border-color: #63d3ff;

          box-shadow:
            0 0 15px
            rgba(70, 199, 255, 0.2);
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
            rgba(70, 199, 255, 0.6);
        }

        .password-button:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        /* ================================
           MENSAGENS
        ================================= */

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
            rgba(35, 170, 115, 0.12);

          border:
            1px solid
            rgba(65, 220, 160, 0.3);

          color: #8ff0c6;
        }

        .error {
          background:
            rgba(220, 70, 70, 0.12);

          border:
            1px solid
            rgba(255, 100, 100, 0.3);

          color: #ffb0b0;
        }

        /* ================================
           AÇÕES
        ================================= */

        .actions {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 14px;

          margin-top: 24px;
        }

        .action-button {
          display: flex;

          align-items: center;
          justify-content: center;

          min-height: 48px;

          padding: 12px;

          border-radius: 12px;

          text-decoration: none;

          font-size: 14px;
          font-weight: 700;

          transition: 0.2s ease;
        }

        .action-primary {
          color: #04101b;

          background:
            linear-gradient(
              90deg,
              #5ed2ff,
              #75e0ff
            );
        }

        .action-secondary {
          color: #bfeaff;

          background:
            rgba(94, 203, 255, 0.08);

          border:
            1px solid
            rgba(94, 203, 255, 0.3);
        }

        .action-button:hover {
          transform:
            translateY(-2px);
        }

        .logout {
          width: 100%;

          margin-top: 14px;

          padding: 13px;

          border-radius: 12px;

          cursor: pointer;

          color: #ffb0b0;

          background:
            rgba(220, 70, 70, 0.08);

          border:
            1px solid
            rgba(255, 100, 100, 0.25);

          font-size: 14px;
          font-weight: 700;
        }

        /* ================================
           LOADING
        ================================= */

        .loading {
          text-align: center;

          padding: 80px 20px;

          color: #9eb2c5;

          font-size: 16px;

          animation:
            pulse 1.1s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.45;
          }

          50% {
            opacity: 1;
          }
        }

        /* ================================
           FOOTER
        ================================= */

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
            min(1180px, 100%);

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
        }

        .footer-column a:hover {
          color: #68d2ff;
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

        /* ================================
           TABLET
        ================================= */

        @media (max-width: 850px) {
          .topbar {
            padding: 0 22px;
          }

          .account-grid {
            grid-template-columns: 1fr;
          }

          .credits-card,
          .password-card {
            grid-column: span 1;
          }
        }

        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 650px) {
          .topbar {
            min-height: 68px;

            padding: 0 16px;

            gap: 12px;
          }

          .brand-name {
            font-size: 16px;
          }

          .brand-icon {
            font-size: 23px;
          }

          .back {
            font-size: 13px;
          }

          .content {
            width:
              min(
                430px,
                calc(100% - 28px)
              );

            padding-top: 38px;
          }

          .card {
            padding: 21px;

            border-radius: 18px;
          }

          .password-fields {
            grid-template-columns: 1fr;
          }

          .actions {
            grid-template-columns: 1fr;
          }

          .credits-box {
            padding: 18px;
          }

          .credits-number {
            font-size: 32px;
          }

          .diamond {
            font-size: 45px;
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
            flex-wrap: nowrap;

            justify-content: space-between;

            padding:
              14px 10px;
          }

          .brand {
            width: auto;

            justify-content: flex-start;
          }

          .back {
            margin-top: 0;

            text-align: right;
          }

          .title-area h1 {
            font-size: 34px;
          }

          .title-area p {
            font-size: 16px;
          }

          .info-row {
            align-items: flex-start;

            flex-direction: column;

            gap: 5px;
          }

          .info-value {
            text-align: left;
          }
        }
      `}</style>

      <main className="page">

        {/* ================================
            CABEÇALHO
        ================================= */}

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

        {/* ================================
            CONTEÚDO
        ================================= */}

        <section className="content">

          <div className="title-area">

            <h1>
              Minha Conta
            </h1>

            <p>
              Gerencie seus dados,
              Diamantes e configurações
              da sua conta no CIEL IA
              STUDIO.
            </p>

          </div>

          {loading ? (

            <div className="card loading">
              ✨ Carregando dados da
              sua conta...
            </div>

          ) : (

            <div className="account-grid">

              {/* ==========================
                  PERFIL
              ========================== */}

              <section className="card">

                <div className="profile">

                  <div className="avatar">
                    👤
                  </div>

                  <h2>
                    Minha Conta
                  </h2>

                  <p>
                    {email ||
                      "Usuário CIEL IA STUDIO"}
                  </p>

                </div>

              </section>

              {/* ==========================
                  INFORMAÇÕES
              ========================== */}

              <section className="card">

                <h2>
                  👤 Informações
                </h2>

                <div className="info-list">

                  <div className="info-row">

                    <span className="info-label">
                      E-mail
                    </span>

                    <span className="info-value">
                      {email || "—"}
                    </span>

                  </div>

                  <div className="info-row">

                    <span className="info-label">
                      Cadastro
                    </span>

                    <span className="info-value">
                      {createdAt || "—"}
                    </span>

                  </div>

                  <div className="info-row">

                    <span className="info-label">
                      ID da conta
                    </span>

                    <span className="info-value">
                      {userId
                        ? `${userId.slice(
                            0,
                            8
                          )}...`
                        : "—"}
                    </span>

                  </div>

                </div>

              </section>

              {/* ==========================
                  💎 DIAMANTES
              ========================== */}

              <section className="card credits-card">

                <h2>
                  💎 Seus Diamantes
                </h2>

                <div className="credits-box">

                  <div>

                    <div className="credits-title">
                      Saldo disponível
                    </div>

                    <div className="credits-number">
                      {credits}{" "}
                      <span>
                        Diamantes
                      </span>
                    </div>

                  </div>

                  <div className="diamond">
                    💎
                  </div>

                </div>

              </section>

              {/* ==========================
                  ALTERAR SENHA
              ========================== */}

              <section className="card password-card">

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

              {/* ==========================
                  AÇÕES
              ========================== */}

              <section className="card">

                <h2>
                  ⚙️ Ações
                </h2>

                <div className="actions">

                  <Link
                    href="/dashboard"
                    className="action-button action-primary"
                  >
                    ← Dashboard
                  </Link>

                  <Link
                    href="/configuracoes"
                    className="action-button action-secondary"
                  >
                    ⚙️ Configurações
                  </Link>

                </div>

                <button
                  className="logout"
                  onClick={
                    handleLogout
                  }
                >
                  🚪 Sair da conta
                </button>

              </section>

            </div>

          )}

        </section>

        {/* ================================
            RODAPÉ
        ================================= */}

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
