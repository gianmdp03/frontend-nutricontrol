import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Mi Ficha Médica",
  description: "Completa y actualiza tu información médica personal (edad, peso, altura, antecedentes y medicamentos) para optimizar tus consultas de nutrición y salud familiar.",
};

export default function MedicalRecordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
