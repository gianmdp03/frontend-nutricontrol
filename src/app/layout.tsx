import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Acá van tus directivas de Tailwind
import Navbar from "@/components/layout/Navbar";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NutriControl Familiar",
  description: "Consulta médica virtual con la Dra. Zully María Cepeda Morel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.className} bg-white text-gray-800 min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <main className="relative min-h-screen overflow-hidden grow">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
