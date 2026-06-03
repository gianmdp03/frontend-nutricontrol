"use client";

import React, { useState } from "react";
import ManualDocumentForm from "@/components/admin/documents/ManualDocumentForm";
import ManualDocumentList from "@/components/admin/documents/ManualDocumentList";
import { medicalCertificateSchema } from "@/schemas/MedicalCertificateSchema";
import { createManualMedicalCertificateAction } from "@/actions/medicalCertificateActions";

export default function ManualCertificatePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-4">
      <ManualDocumentForm
        title="Crear Certificado Médico Manual"
        subtitle="Genera un certificado médico genérico firmado por ti, para un paciente no registrado en la plataforma."
        textareaLabel="Cuerpo del Certificado Médico"
        textareaPlaceholder="Escribe el diagnóstico, reposo recomendado y detalles clínicos del certificado aquí..."
        schema={medicalCertificateSchema}
        onSubmitAction={createManualMedicalCertificateAction}
        buttonLabel="Generar Certificado"
        onSuccess={handleSuccess}
      />

      <ManualDocumentList
        type="certificate"
        refreshKey={refreshKey}
      />
    </div>
  );
}
