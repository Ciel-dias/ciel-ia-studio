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
      <body>{children}</body>
    </html>
  );
}
