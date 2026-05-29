"use client";

import React, { useState } from "react";

interface PatientDocumentsViewProps {
  prescriptions: any[];
  certificates: any[];
  token: string;
}

export default function PatientDocumentsView({
  prescriptions = [],
  certificates = [],
  token,
}: PatientDocumentsViewProps) {
  const [activeTab, setActiveTab] = useState<"prescriptions" | "certificates">("prescriptions");
  const [loadingDocId, setLoadingDocId] = useState<number | null>(null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      const parsedDate = isNaN(date.getTime()) ? new Date(`${dateStr}T12:00:00`) : date;
      return parsedDate.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleOpenPdf = async (id: number, type: "receta" | "certificado") => {
    setLoadingDocId(id);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const endpoint = type === "receta"
        ? `${baseUrl}/prescriptions/user/${id}`
        : `${baseUrl}/medical-certificates/user/${id}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener el PDF");

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error al cargar el PDF:", error);
      alert("Hubo un inconveniente al descargar el documento en formato PDF. Por favor, intenta de nuevo.");
    } finally {
      setLoadingDocId(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Mis Documentos Clínicos</h2>
          <p className="text-xs text-slate-500 mt-0.5">Accede y descarga tus recetas y certificados en formato PDF oficial.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/50 self-start sm:self-center">
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "prescriptions"
                ? "bg-white text-rose-500 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Recetas Médicas ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "certificates"
                ? "bg-white text-rose-500 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Certificados ({certificates.length})
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div>
        {activeTab === "prescriptions" ? (
          prescriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((pres) => (
                <div
                  key={pres.id}
                  className="p-5 bg-slate-50 border border-slate-100/80 rounded-2xl flex flex-col justify-between hover:border-rose-200 hover:shadow-xs transition-all"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">Receta Médica</span>
                    <h3 className="font-extrabold text-slate-800 text-sm line-clamp-2">
                      {pres.textareaTexto}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">
                      Dra. {pres.adminName || "Especialista"} • {pres.specialty || "Nutrición"}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{formatDate(pres.date)}</span>
                    <button
                      onClick={() => handleOpenPdf(pres.id, "receta")}
                      disabled={loadingDocId === pres.id}
                      className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg shadow-xs hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {loadingDocId === pres.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>Cargando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Descargar PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xs mx-auto text-slate-400 mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-700 text-sm">Sin recetas emitidas</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
                Tus recetas médicas oficiales en formato PDF se listarán aquí en cuanto sean emitidas.
              </p>
            </div>
          )
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 bg-slate-50 border border-slate-100/80 rounded-2xl flex flex-col justify-between hover:border-rose-200 hover:shadow-xs transition-all"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block">Certificado Médico</span>
                  <h3 className="font-extrabold text-slate-800 text-sm line-clamp-2">
                    {cert.textareaTexto}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    Dra. {cert.adminName || "Especialista"} • {cert.specialty || "Nutrición"}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{formatDate(cert.date)}</span>
                  <button
                    onClick={() => handleOpenPdf(cert.id, "certificado")}
                    disabled={loadingDocId === cert.id}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg shadow-xs hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {loadingDocId === cert.id ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Cargando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Descargar PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xs mx-auto text-slate-400 mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-700 text-sm">Sin certificados emitidos</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
              Tus certificados médicos oficiales en formato PDF se listarán aquí en cuanto sean emitidos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
