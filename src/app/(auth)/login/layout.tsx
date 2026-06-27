import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Inicia sesión en tu portal de Tu Médico RD para gestionar tus consultas virtuales, turnos médicos y ver tus documentos clínicos.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
