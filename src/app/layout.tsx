import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CIEL IA STUDIO",
  description: "Plataforma de criação com inteligência artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <style>{`
          html,
          body {
            margin: 0;
            padding: 0;
            background: #07111f;
            color: #ffffff;
          }

          html {
            background: #07111f;
          }

          body {
            min-height: 100vh;
            background: #07111f;
          }
        `}</style>
      </head>

      <body>{children}</body>
    </html>
  );
}
