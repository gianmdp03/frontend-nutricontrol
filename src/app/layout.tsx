import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Tu Médico RD | Dra. Zully Cepeda - Consulta Médica Virtual",
    template: "%s | Tu Médico RD",
  },
  description: "Consulta médica virtual y gestión de turnos online con la Dra. Zully María Cepeda Morel. Especialista en Medicina Familiar, Comunitaria y Nutrición. Atención 100% digital en República Dominicana.",
  keywords: [
    "Tu Médico RD",
    "Dra. Zully Cepeda",
    "Zully María Cepeda Morel",
    "consulta médica virtual",
    "médico familiar República Dominicana",
    "nutrición y dietética RD",
    "gestión de turnos médicos",
    "consulta online medicina familiar",
    "doctor virtual RD",
    "salud preventiva",
    "turnos médicos online",
    "telemedicina RD"
  ],
  authors: [{ name: "Dra. Zully María Cepeda Morel", url: "https://tumedicord.com" }],
  creator: "Tu Médico RD",
  publisher: "Tu Médico RD",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://tumedicord.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: "/",
    title: "Tu Médico RD | Dra. Zully Cepeda - Consulta Médica Virtual",
    description: "Agenda tu consulta virtual con la Dra. Zully María Cepeda Morel. Especialista en Medicina Familiar, Comunitaria y Nutrición. Gestión de turnos y atención preventiva 100% digital.",
    siteName: "Tu Médico RD",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dra. Zully Cepeda Morel - Tu Médico RD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tu Médico RD | Dra. Zully Cepeda - Consulta Médica Virtual",
    description: "Agenda tu consulta virtual con la Dra. Zully María Cepeda Morel. Especialista en Medicina Familiar y Nutrición. Atención 100% virtual.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body
        className={`${inter.className} bg-white text-gray-800 min-h-screen flex flex-col`}
      >
        <Providers>
          <main className="relative min-h-screen overflow-hidden grow">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
