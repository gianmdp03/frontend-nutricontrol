"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { MedicalCertificateService } from "@/services/MedicalCertificateService";
import { PrescriptionService } from "@/services/PrescriptionService";
import { NutritionalPlanService } from "@/services/NutritionalPlanService";
import { MedicalCertificateDetailDTO } from "@/types/MedicalCertificate";
import { PrescriptionDetailDTO } from "@/types/Prescription";
import { NutritionalPlanDetailDTO } from "@/types/NutritionalPlan";

type ManualDocument = MedicalCertificateDetailDTO | PrescriptionDetailDTO | NutritionalPlanDetailDTO;

interface ManualDocumentListProps {
  type: "certificate" | "prescription" | "nutritional-plan";
  refreshKey: number;
}

export default function ManualDocumentList({ type, refreshKey }: ManualDocumentListProps) {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<ManualDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadDocuments = useCallback(async () => {
    const token = session?.user?.backendToken;
    if (!token) return;

    setLoading(true);
    try {
      let data: ManualDocument[] = [];
      if (type === "certificate") {
        data = await MedicalCertificateService.getManualMedicalCertificates(token);
      } else if (type === "prescription") {
        data = await PrescriptionService.getManualPrescriptions(token);
      } else {
        data = await NutritionalPlanService.getManualNutritionalPlans(token);
      }
      
      // Sort newest first
      const parseDateSafe = (dateVal: any): Date => {
        if (!dateVal) return new Date(0);
        if (dateVal instanceof Date) return dateVal;
        if (typeof dateVal === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateVal)) {
          const [datePart, timePart = ""] = dateVal.split(" ");
          const [day, month, year] = datePart.split("/").map(Number);
          const [hour = 0, minute = 0, second = 0] = timePart ? timePart.split(":").map(Number) : [];
          return new Date(year, month - 1, day, hour, minute, second);
        }
        if (Array.isArray(dateVal)) {
          const [year, month, day, hour = 0, minute = 0, second = 0] = dateVal;
          return new Date(year, month - 1, day, hour, minute, second);
        }
        if (typeof dateVal === "object") {
          const year = dateVal.year || dateVal.yearValue || 0;
          const month = dateVal.monthValue || dateVal.month || 1;
          const day = dateVal.dayOfMonth || dateVal.day || 1;
          const hour = dateVal.hour || dateVal.hours || 0;
          const minute = dateVal.minute || dateVal.minutes || 0;
          const second = dateVal.second || dateVal.seconds || 0;
          if (year > 0) {
            let monthIndex = 0;
            if (typeof month === "number") {
              monthIndex = month - 1;
            } else if (typeof month === "string") {
              const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
              const shortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
              const mLower = month.toLowerCase();
              const idx = months.indexOf(mLower);
              if (idx !== -1) monthIndex = idx;
              else {
                const idxShort = shortMonths.indexOf(mLower.substring(0, 3));
                if (idxShort !== -1) monthIndex = idxShort;
              }
            }
            return new Date(year, monthIndex, day, hour, minute, second);
          }
        }
        const parsed = new Date(dateVal);
        if (isNaN(parsed.getTime())) {
          const fallback = new Date(`${dateVal}T12:00:00`);
          return isNaN(fallback.getTime()) ? parsed : fallback;
        }
        return parsed;
      };

      data.sort((a: ManualDocument, b: ManualDocument) => {
        const dateA = parseDateSafe(a.date || (a as { dateTime?: string }).dateTime).getTime();
        const dateB = parseDateSafe(b.date || (b as { dateTime?: string }).dateTime).getTime();
        return dateB - dateA;
      });

      console.log("LOADED MANUAL DOCUMENTS TYPE:", type, "FIRST DOC:", data[0]);
      setDocuments(data);
    } catch (e) {
      console.error("Error loading manual documents:", e);
    } finally {
      setLoading(false);
    }
  }, [session, type]);

  useEffect(() => {
    if (session?.user?.backendToken) {
      loadDocuments();
    }
  }, [session, loadDocuments, refreshKey]);

  const handleDownloadPdf = async (id: number) => {
    const token = session?.user?.backendToken;
    if (!token) return;

    setDownloadingId(id);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      let endpoint = "";
      if (type === "certificate") {
        endpoint = `${baseUrl}/medical-certificates/admin/manual/${id}`;
      } else if (type === "prescription") {
        endpoint = `${baseUrl}/prescriptions/admin/manual/${id}`;
      } else {
        endpoint = `${baseUrl}/nutritional-plans/admin/manual/${id}`;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener el PDF");

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      
      // Open in a new tab
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("Hubo un inconveniente al descargar el documento en formato PDF. Por favor, intenta de nuevo.");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateVal?: any) => {
    if (!dateVal) return "N/A";
    try {
      const parseDateSafe = (dateVal: any): Date => {
        if (!dateVal) return new Date(0);
        if (dateVal instanceof Date) return dateVal;
        if (typeof dateVal === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateVal)) {
          const [datePart, timePart = ""] = dateVal.split(" ");
          const [day, month, year] = datePart.split("/").map(Number);
          const [hour = 0, minute = 0, second = 0] = timePart ? timePart.split(":").map(Number) : [];
          return new Date(year, month - 1, day, hour, minute, second);
        }
        if (Array.isArray(dateVal)) {
          const [year, month, day, hour = 0, minute = 0, second = 0] = dateVal;
          return new Date(year, month - 1, day, hour, minute, second);
        }
        if (typeof dateVal === "object") {
          const year = dateVal.year || dateVal.yearValue || 0;
          const month = dateVal.monthValue || dateVal.month || 1;
          const day = dateVal.dayOfMonth || dateVal.day || 1;
          const hour = dateVal.hour || dateVal.hours || 0;
          const minute = dateVal.minute || dateVal.minutes || 0;
          const second = dateVal.second || dateVal.seconds || 0;
          if (year > 0) {
            let monthIndex = 0;
            if (typeof month === "number") {
              monthIndex = month - 1;
            } else if (typeof month === "string") {
              const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
              const shortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
              const mLower = month.toLowerCase();
              const idx = months.indexOf(mLower);
              if (idx !== -1) monthIndex = idx;
              else {
                const idxShort = shortMonths.indexOf(mLower.substring(0, 3));
                if (idxShort !== -1) monthIndex = idxShort;
              }
            }
            return new Date(year, monthIndex, day, hour, minute, second);
          }
        }
        const parsed = new Date(dateVal);
        if (isNaN(parsed.getTime())) {
          const fallback = new Date(`${dateVal}T12:00:00`);
          return isNaN(fallback.getTime()) ? parsed : fallback;
        }
        return parsed;
      };

      const parsedDate = parseDateSafe(dateVal);
      return parsedDate.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateVal);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    (doc.patientName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeName = () => {
    if (type === "certificate") return "Certificados Médicos";
    if (type === "prescription") return "Recetas Médicas";
    return "Planes Nutricionales";
  };

  const getThemeColor = () => {
    if (type === "certificate") return "rose";
    if (type === "prescription") return "rose";
    return "emerald";
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-800">
            Historial de {getTypeName()} Manuales
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Listado completo de documentos generados manualmente sin turnos asociados.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Buscar por paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-4">Paciente</th>
              <th className="px-6 py-4">Edad</th>
              <th className="px-6 py-4">Contenido / Indicaciones</th>
              <th className="px-6 py-4">Fecha de Emisión</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded-md w-32"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded-md w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded-md w-48"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded-md w-28"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-8 bg-slate-100 rounded-md w-24 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Patient Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-8 w-8 rounded-full bg-${getThemeColor()}-50 text-${getThemeColor()}-600 flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0`}>
                        {doc.patientName?.[0] || "P"}
                      </div>
                      <span className="font-extrabold text-slate-800">{doc.patientName}</span>
                    </div>
                  </td>

                  {/* Age */}
                  <td className="px-6 py-4 text-slate-500">{doc.age}</td>

                  {/* Text snippet */}
                  <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                    {doc.textareaTexto}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-slate-400 font-medium">
                    {formatDate(doc.date || (doc as { dateTime?: string }).dateTime)}
                  </td>

                  {/* PDF Download Button */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDownloadPdf(doc.id)}
                      disabled={downloadingId === doc.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-${getThemeColor()}-500 hover:bg-${getThemeColor()}-600 text-white font-bold rounded-lg text-xs transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50`}
                    >
                      {downloadingId === doc.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          <span>Descargando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>PDF</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // Empty State Row
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-2.5">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-slate-600 text-sm">No se encontraron documentos</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {searchTerm ? "Intenta con otro término de búsqueda." : "Aún no has generado documentos manuales de este tipo."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
