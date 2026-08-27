import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "CIEL IA STUDIO",
  description:
    "Plataforma de criação com inteligência artificial.",
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
          }

          html {
            background: #07111f;
          }

          body {
            min-height: 100vh;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </head>

      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
