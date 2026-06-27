import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Registrarse",
  description: "Crea tu cuenta en Tu Médico RD para comenzar a agendar tus consultas médicas con la Dra. Zully Cepeda y acceder a tus planes de nutrición personalizados.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
