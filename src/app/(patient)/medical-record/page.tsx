"use client";

import React, { useState, useEffect } from "react";
import { saveOrUpdateMedicalRecordAction, getUserMedicalRecordAction } from "@/actions/medicalRecordActions";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function PatientMedicalRecordPage() {
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [medicalHistory, setMedicalHistory] = useState<string>("");
  const [medication, setMedication] = useState<string>("");
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Cargar datos en montaje
  useEffect(() => {
    async function loadRecord() {
      setLoading(true);
      const res = await getUserMedicalRecordAction();
      if (res.success && res.data) {
        setWeight(res.data.weight || 0);
        setHeight(res.data.height || 0);
        setMedicalHistory(res.data.medicalHistory || "");
        setMedication(res.data.medication || "");
      } else if (res.error) {
        console.error(res.error);
      }
      setLoading(false);
    }
    loadRecord();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (weight <= 0 || height <= 0) {
      setMessage({ type: "error", text: "Por favor, ingresa un peso y altura válidos." });
      setSaving(false);
      return;
    }

    const payload = {
      weight,
      height,
      medicalHistory,
      medication,
    };

    const res = await saveOrUpdateMedicalRecordAction(payload);
    if (res.success) {
      setMessage({ type: "success", text: "¡Tu ficha médica ha sido guardada con éxito!" });
    } else {
      setMessage({ type: "error", text: res.error || "Hubo un error al guardar la ficha." });
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Botón de Retorno */}
          <div className="flex items-center">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a mi Perfil
            </Link>
          </div>

          {/* Banner de Sección */}
          <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl p-8 text-white shadow-md">
            <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-15 pointer-events-none">
              <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
            </div>
            <div className="relative z-10 space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Mi Ficha Médica</h1>
              <p className="text-rose-50 text-sm max-w-2xl font-light">
                Mantén actualizado tu registro clínico de peso, altura, medicamentos e historial médico para que la Doctora cuente con toda la información necesaria al asistirte.
              </p>
            </div>
          </div>

          {/* Formulario */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium text-sm">Cargando tu información médica...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              
              {/* Alertas */}
              {message && (
                <div
                  className={`p-4 rounded-xl text-sm font-medium border flex gap-3 ${
                    message.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                      : "bg-red-50 text-red-800 border-red-100"
                  }`}
                >
                  {message.type === "success" ? (
                    <svg className="w-5 h-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Medidas Fisiológicas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="weight" className="block text-sm font-bold text-slate-700 mb-2">
                    Peso Corporal (kg)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <input
                      type="number"
                      step="0.1"
                      id="weight"
                      required
                      min="1"
                      max="400"
                      value={weight || ""}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-800"
                      placeholder="e.g. 70.5"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                      kg
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-bold text-slate-700 mb-2">
                    Altura (cm)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <input
                      type="number"
                      id="height"
                      required
                      min="10"
                      max="300"
                      value={height || ""}
                      onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-800"
                      placeholder="e.g. 175"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                      cm
                    </div>
                  </div>
                </div>
              </div>

              {/* Historial Médico */}
              <div>
                <label htmlFor="medicalHistory" className="block text-sm font-bold text-slate-700 mb-2">
                  Historial Médico Relevante
                </label>
                <textarea
                  id="medicalHistory"
                  rows={4}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-800 leading-relaxed"
                  placeholder="Por favor, describe cirugías previas, condiciones crónicas (diabetes, hipertensión), alergias o patologías familiares de importancia..."
                />
              </div>

              {/* Medicamentos actuales */}
              <div>
                <label htmlFor="medication" className="block text-sm font-bold text-slate-700 mb-2">
                  Medicamentos / Suplementos Activos
                </label>
                <textarea
                  id="medication"
                  rows={3}
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-800 leading-relaxed"
                  placeholder="Enumera los medicamentos o suplementos dietéticos que consumes actualmente junto con su dosis respectiva (e.g. Metformina 500mg, 1 vez al día)..."
                />
              </div>

              {/* Botón guardar */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {saving && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                  {saving ? "Guardando cambios..." : "Guardar Ficha Médica"}
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
