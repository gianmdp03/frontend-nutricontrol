"use client";

import React, { useState } from "react";
import ManualDocumentForm from "@/components/admin/documents/ManualDocumentForm";
import ManualDocumentList from "@/components/admin/documents/ManualDocumentList";
import { prescriptionSchema } from "@/schemas/PrescriptionSchema";
import { createManualPrescriptionAction } from "@/actions/prescriptionActions";

export default function ManualPrescriptionPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-4">
      <ManualDocumentForm
        title="Crear Receta Médica Manual"
        subtitle="Genera una indicación o receta médica genérica firmada por ti, para un paciente no registrado en la plataforma."
        textareaLabel="Indicaciones / Cuerpo de la Receta"
        textareaPlaceholder="Escribe las indicaciones del tratamiento, medicamentos, dosis y horarios aquí..."
        schema={prescriptionSchema}
        onSubmitAction={createManualPrescriptionAction}
        buttonLabel="Generar Receta Médica"
        onSuccess={handleSuccess}
      />

      <ManualDocumentList
        type="prescription"
        refreshKey={refreshKey}
      />
    </div>
  );
}
