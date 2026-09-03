"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/ThemeProvider";

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

        setEmail(user.email || "");

        setNome(
          user.user_metadata?.nome ||
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            "Usuário"
        );
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    try {
      const supabase = createClient();

      await supabase.auth.signOut();

      window.location.replace("/login");
    } catch (err) {
      console.error("Erro ao sair da conta:", err);
    }
  }

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

  return (
    <main className="page">
      <header className="topbar">
        <div className="logo">✨ CIEL IA STUDIO</div>

        <a href="/dashboard" className="back">
          ← Voltar ao Dashboard
        </a>
      </header>

      <section className="content">
        <div className="header">
          <h1>CONFIGURAÇÕES</h1>
          <p>Gerencie suas preferências e sua conta.</p>
        </div>

        <div className="cards">
          <section className="card">
            <h2>👤 Sua conta</h2>

            <div className="info">
              <span>Nome</span>
              <strong>
                {loading ? "Carregando..." : nome}
              </strong>
            </div>

            <div className="info">
              <span>E-mail</span>
              <strong>
                {loading ? "Carregando..." : email}
              </strong>
            </div>
          </section>

          <section className="card">
            <h2>🎨 Aparência</h2>

            <p className="description">
              Escolha como o CIEL IA STUDIO será exibido.
            </p>

            <div className="theme-options">
              <button
                type="button"
                className={`theme-button ${
                  theme === "dark" ? "active" : ""
                }`}
                onClick={() => setTheme("dark")}
              >
                🌙 Tema escuro
              </button>

              <button
                type="button"
                className={`theme-button ${
                  theme === "light" ? "active" : ""
                }`}
                onClick={() => setTheme("light")}
              >
                ☀️ Tema claro
              </button>
            </div>
          </section>

          <section className="card">
            <h2>🔐 Segurança</h2>

            <p className="description">
              Altere sua senha de acesso à conta.
            </p>

            <div className="password-area">
              <input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

              <input
                type="password"
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="change-password"
                onClick={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword
                  ? "Alterando..."
                  : "🔐 Alterar senha"}
              </button>

              {message && (
                <div className="success-message">
                  {message}
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>
          </section>

          <section className="card actions-card">
            <h2>⚙️ Ações</h2>

            <a href="/dashboard" className="action-button primary">
              ← Dashboard
            </a>

            <a
              href="/configuracoes"
              className="action-button secondary"
            >
              ⚙️ Configurações
            </a>

            <button
              type="button"
              className="logout"
              onClick={handleLogout}
            >
              🚪 Sair da conta
            </button>
          </section>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h2>CIEL IA STUDIO</h2>
            <p>Crie. Transforme. Inove com IA.</p>
          </div>

          <div className="footer-columns">
            <div className="footer-column">
              <h3>Produto</h3>

              <a href="/criar-prompts">
                Criar Prompts
              </a>

              <a href="/texto-imagem">
                Texto → Imagem
              </a>

              <a href="/texto-video">
                Texto → Vídeo
              </a>

              <a href="/imagem-imagem">
                Imagem → Imagem
              </a>

              <a href="/imagem-video">
                Imagem → Vídeo
              </a>

              <a href="/projetos">
                Meus Projetos
              </a>

              <a href="/creditos">
                💎 Diamantes
              </a>
            </div>

            <div className="footer-column">
              <h3>Suporte</h3>

              <a href="/ajuda">
                Central de Ajuda
              </a>

              <a href="/contato">
                Contato
              </a>

              <a href="/sobre">
                Sobre o CIEL IA STUDIO
              </a>
            </div>

            <div className="footer-column">
              <h3>Legal</h3>

              <a href="/termos">
                Termos de Uso
              </a>

              <a href="/privacidade">
                Política de Privacidade
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            © 2026 CIEL IA STUDIO. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: linear-gradient(
            180deg,
            #07111f 0%,
            #0a1c30 50%,
            #06111f 100%
          );
          color: #ffffff;
        }

        .topbar {
          width: min(1180px, 100%);
          margin: 0 auto;
          padding: 24px 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .logo {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
        }

        .back {
          color: #9edfff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }

        .back:hover {
          color: #ffffff;
        }

        .content {
          width: min(1180px, 100%);
          margin: 0 auto;
          padding: 42px 42px 80px;
        }

        .header {
          margin-bottom: 42px;
        }

        .header h1 {
          margin: 0;
          font-size: clamp(32px, 5vw, 50px);
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
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 18px rgba(70, 200, 255, 0.35);
          animation: title-shine 4s linear infinite;
        }

        .header p {
          margin: 12px 0 0;
          color: #9eacbd;
          font-size: 16px;
        }

        @keyframes title-shine {
          0% {
            background-position: 200% center;
          }

          100% {
            background-position: -200% center;
          }
        }

        .cards {
          display: grid;
          gap: 28px;
        }

        .card {
          padding: 30px;
          border-radius: 24px;
          border: 1px solid rgba(80, 190, 255, 0.35);
          background: rgba(15, 31, 51, 0.82);
          box-shadow:
            0 0 24px rgba(40, 180, 255, 0.08),
            inset 0 0 24px rgba(40, 180, 255, 0.025);
        }

        .card h2 {
          margin: 0 0 24px;
          font-size: 27px;
          color: #ffffff;
        }

        .info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 16px 0;
          border-bottom: 1px solid rgba(120, 180, 220, 0.12);
        }

        .info:last-child {
          border-bottom: none;
        }

        .info span {
          color: #91a1b4;
        }

        .info strong {
          color: #dff8ff;
          text-align: right;
          word-break: break-word;
        }

        .description {
          margin: -8px 0 22px;
          color: #9eacbd;
          line-height: 1.6;
        }

        .theme-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .theme-button {
          padding: 15px 18px;
          border-radius: 14px;
          border: 1px solid rgba(80, 180, 240, 0.28);
          background: rgba(20, 43, 65, 0.7);
          color: #b9dfff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .theme-button:hover {
          border-color: rgba(80, 200, 255, 0.55);
          box-shadow: 0 0 16px rgba(70, 190, 255, 0.12);
        }

        .theme-button.active {
          background: linear-gradient(
            135deg,
            #54c9f5,
            #75d8f8
          );
          color: #06111f;
          border-color: #6bd8ff;
          box-shadow: 0 0 22px rgba(60, 200, 255, 0.3);
        }

        .password-area {
          display: grid;
          gap: 14px;
        }

        .password-area input {
          width: 100%;
          box-sizing: border-box;
          padding: 17px 18px;
          border-radius: 14px;
          border: 1px solid rgba(80, 180, 240, 0.3);
          background: rgba(4, 17, 31, 0.75);
          color: #ffffff;
          outline: none;
          font-size: 15px;
        }

        .password-area input::placeholder {
          color: #728398;
        }

        .password-area input:focus {
          border-color: #5ccfff;
          box-shadow: 0 0 16px rgba(70, 200, 255, 0.14);
        }

        .change-password {
          width: 100%;
          margin-top: 4px;
          padding: 18px;
          border: none;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            #54c9f5,
            #70d8f5
          );
          color: #06111f;
          font-size: 17px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 0 25px rgba(70, 200, 255, 0.3);
          transition: 0.25s ease;
        }

        .change-password:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 30px rgba(70, 200, 255, 0.42);
        }

        .change-password:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .success-message {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(50, 190, 120, 0.1);
          border: 1px solid rgba(70, 210, 140, 0.3);
          color: #8ff0bd;
          font-size: 14px;
        }

        .error-message {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255, 70, 90, 0.08);
          border: 1px solid rgba(255, 90, 110, 0.3);
          color: #ffabb5;
          font-size: 14px;
        }

        .actions-card {
          margin-top: 0;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          box-sizing: border-box;
          padding: 18px;
          border-radius: 18px;
          text-decoration: none;
          font-size: 17px;
          font-weight: 800;
          transition: 0.25s ease;
        }

        .action-button.primary {
          background: linear-gradient(
            135deg,
            #54c9f5,
            #70d8f5
          );
          color: #06111f;
          box-shadow: 0 0 24px rgba(70, 200, 255, 0.25);
        }

        .action-button.secondary {
          margin-top: 14px;
          border: 1px solid rgba(80, 190, 255, 0.32);
          background: rgba(25, 48, 70, 0.65);
          color: #bce6ff;
        }

        .action-button:hover {
          transform: translateY(-1px);
        }

        /*
          BOTÃO SAIR DA CONTA
          Igual ao padrão aprovado da página Minha Conta.
        */
        .logout {
          width: 100%;
          margin-top: 14px;
          padding: 13px;
          border-radius: 12px;
          border: 1px solid rgba(255, 80, 100, 0.35);
          background: rgba(120, 30, 45, 0.12);
          color: #ffb0b0;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .logout:hover {
          background: rgba(120, 30, 45, 0.22);
          border-color: rgba(255, 100, 120, 0.55);
          color: #ffc4c4;
          box-shadow: 0 0 18px rgba(255, 70, 90, 0.15);
        }

        .logout:active {
          transform: scale(0.98);
        }

        .footer {
          border-top: 1px solid rgba(100, 180, 255, 0.18);
          background: linear-gradient(
            180deg,
            rgba(4, 15, 29, 0.96),
            rgba(3, 11, 22, 1)
          );
          padding: 52px 42px 24px;
        }

        .footer-inner {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .footer-brand {
          margin-bottom: 42px;
        }

        .footer-brand h2 {
          margin: 0 0 8px;
          font-size: 24px;
        }

        .footer-brand p {
          margin: 0;
          color: #9eacbd;
          font-size: 15px;
        }

        .footer-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 50px;
        }

        .footer-column h3 {
          margin: 0 0 18px;
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
          color: #7bd8ff;
        }

        .footer-bottom {
          margin-top: 36px;
          padding-top: 22px;
          border-top: 1px solid rgba(100, 180, 255, 0.16);
          text-align: center;
          color: #8997a9;
          font-size: 13px;
        }

        @media (max-width: 700px) {
          .topbar {
            padding: 20px 24px;
          }

          .logo {
            font-size: 17px;
          }

          .back {
            font-size: 13px;
          }

          .content {
            padding: 32px 24px 60px;
          }

          .card {
            padding: 24px;
            border-radius: 22px;
          }

          .card h2 {
            font-size: 25px;
          }

          .theme-options {
            grid-template-columns: 1fr;
          }

          .info {
            align-items: flex-start;
            flex-direction: column;
            gap: 6px;
          }

          .info strong {
            text-align: left;
          }

          .footer {
            padding: 42px 24px 22px;
          }

          .footer-columns {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
      `}</style>
    </main>
  );
}
