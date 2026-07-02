"use client";

import React, { useState, useEffect } from "react";
import {
  saveOrUpdateMedicalRecordAction,
  getUserMedicalRecordAction,
} from "@/actions/medicalRecordActions";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/BottomComponent";
import Link from "next/link";

// Helper functions for unit conversions
const kgToLbs = (kg: number): string => {
  if (!kg || kg <= 0) return "";
  const lbs = kg * 2.20462;
  return (Math.round(lbs * 10) / 10).toString();
};

const lbsToKg = (lbs: number): string => {
  if (!lbs || lbs <= 0) return "";
  const kg = lbs / 2.20462;
  return (Math.round(kg * 10) / 10).toString();
};

const cmToFtIn = (cm: number): { ft: string; in: string } => {
  if (!cm || cm <= 0) return { ft: "", in: "" };
  const totalInches = cm / 2.54;
  let ft = Math.floor(totalInches / 12);
  let inch = Math.round((totalInches % 12) * 10) / 10;
  if (inch >= 12) {
    ft += 1;
    inch = Math.round((inch - 12) * 10) / 10;
  }
  return { ft: ft.toString(), in: inch.toString() };
};

const ftInToCm = (ftStr: string, inStr: string): string => {
  const ft = parseFloat(ftStr) || 0;
  const inch = parseFloat(inStr) || 0;
  if (ft === 0 && inch === 0) return "";
  const totalInches = ft * 12 + inch;
  const cm = totalInches * 2.54;
  return (Math.round(cm * 10) / 10).toString();
};

export default function PatientMedicalRecordPage() {
  const [age, setAge] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");
  const [weightLbs, setWeightLbs] = useState<string>("");
  const [heightCm, setHeightCm] = useState<string>("");
  const [heightFt, setHeightFt] = useState<string>("");
  const [heightIn, setHeightIn] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string>("");
  const [medication, setMedication] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Cargar datos en montaje
  useEffect(() => {
    async function loadRecord() {
      setLoading(true);
      const res = await getUserMedicalRecordAction();
      if (res.success && res.data) {
        setAge(res.data.age || "");
        
        const wKg = res.data.weight || 0;
        if (wKg > 0) {
          setWeightKg(wKg.toString());
          setWeightLbs(kgToLbs(wKg));
        } else {
          setWeightKg("");
          setWeightLbs("");
        }

        const hCm = res.data.height || 0;
        if (hCm > 0) {
          setHeightCm(hCm.toString());
          const { ft, in: inch } = cmToFtIn(hCm);
          setHeightFt(ft);
          setHeightIn(inch);
        } else {
          setHeightCm("");
          setHeightFt("");
          setHeightIn("");
        }

        setMedicalHistory(res.data.medicalHistory || "");
        setMedication(res.data.medication || "");
      } else if (res.error) {
        console.error(res.error);
      }
      setLoading(false);
    }
    loadRecord();
  }, []);

  const handleWeightKgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWeightKg(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setWeightLbs(kgToLbs(num));
    } else {
      setWeightLbs("");
    }
  };

  const handleWeightLbsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWeightLbs(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setWeightKg(lbsToKg(num));
    } else {
      setWeightKg("");
    }
  };

  const handleHeightCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHeightCm(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const { ft, in: inch } = cmToFtIn(num);
      setHeightFt(ft);
      setHeightIn(inch);
    } else {
      setHeightFt("");
      setHeightIn("");
    }
  };

  const handleHeightFtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHeightFt(val);
    const newCm = ftInToCm(val, heightIn);
    setHeightCm(newCm);
  };

  const handleHeightInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHeightIn(val);
    const newCm = ftInToCm(heightFt, val);
    setHeightCm(newCm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (!age || age.trim() === "") {
      setMessage({
        type: "error",
        text: "Por favor, ingresa una edad válida.",
      });
      setSaving(false);
      return;
    }

    const weightNum = parseFloat(weightKg) || 0;
    const heightNum = parseFloat(heightCm) || 0;

    if (weightNum <= 0 || heightNum <= 0) {
      setMessage({
        type: "error",
        text: "Por favor, ingresa un peso y altura válidos.",
      });
      setSaving(false);
      return;
    }

    const payload = {
      age,
      weight: weightNum,
      height: heightNum,
      medicalHistory,
      medication,
    };

    const res = await saveOrUpdateMedicalRecordAction(payload);
    if (res.success) {
      setMessage({
        type: "success",
        text: "¡Tu ficha médica ha sido guardada con éxito!",
      });
    } else {
      setMessage({
        type: "error",
        text: res.error || "Hubo un error al guardar la ficha.",
      });
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
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a mi Perfil
            </Link>
          </div>

          {/* Banner de Sección */}
          <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl p-8 text-white shadow-md">
            <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-15 pointer-events-none">
              <svg
                className="w-64 h-64"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
            </div>
            <div className="relative z-10 space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Mi Ficha Médica
              </h1>
              <p className="text-rose-50 text-sm max-w-2xl font-light">
                Mantén actualizado tu registro clínico de peso, altura,
                medicamentos e historial médico para que la Doctora cuente con
                toda la información necesaria al asistirte.
              </p>
            </div>
          </div>

          {/* Formulario */}
          {loading ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium text-sm">
                Cargando tu información médica...
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-100 shadow-sm space-y-6"
            >
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
                    <svg
                      className="w-5 h-5 shrink-0 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 shrink-0 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Medidas Fisiológicas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-bold text-slate-700 mb-2"
                  >
                    Edad (años)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <input
                      type="text"
                      id="age"
                      required
                      maxLength={3}
                      value={age}
                      onChange={(e) =>
                        setAge(e.target.value.replace(/\D/g, ""))
                      }
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-800"
                      placeholder="e.g. 28"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                      años
                    </div>
                  </div>
                </div>

                {/* Peso Corporal (kg & lb) */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="weightKg"
                      className="block text-sm font-bold text-slate-700 mb-2"
                    >
                      Peso Corporal (kg)
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <input
                        type="number"
                        step="0.1"
                        id="weightKg"
                        required
                        min="1"
                        max="400"
                        value={weightKg}
                        onChange={handleWeightKgChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-800"
                        placeholder="e.g. 70.5"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                        kg
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="weightLbs"
                      className="block text-sm font-bold text-slate-700 mb-2"
                    >
                      Peso Corporal (lb)
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <input
                        type="number"
                        step="0.1"
                        id="weightLbs"
                        required
                        min="2"
                        max="900"
                        value={weightLbs}
                        onChange={handleWeightLbsChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-800"
                        placeholder="e.g. 155.4"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                        lb
                      </div>
                    </div>
                  </div>
                </div>

                {/* Altura (cm & ft/in) */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="heightCm"
                      className="block text-sm font-bold text-slate-700 mb-2"
                    >
                      Altura (cm)
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <input
                        type="number"
                        id="heightCm"
                        required
                        min="10"
                        max="300"
                        value={heightCm}
                        onChange={handleHeightCmChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-800"
                        placeholder="e.g. 175"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                        cm
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-bold text-slate-700 mb-2"
                    >
                      Altura (sistema inglés)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative rounded-xl shadow-xs">
                        <input
                          type="number"
                          id="heightFt"
                          required
                          min="0"
                          max="9"
                          value={heightFt}
                          onChange={handleHeightFtChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-800"
                          placeholder="Pies"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                          ft
                        </div>
                      </div>
                      <div className="relative rounded-xl shadow-xs">
                        <input
                          type="number"
                          step="0.1"
                          id="heightIn"
                          required
                          min="0"
                          max="11.9"
                          value={heightIn}
                          onChange={handleHeightInChange}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-slate-800"
                          placeholder="Pulg."
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                          in
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historial Médico */}
              <div>
                <label
                  htmlFor="medicalHistory"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
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
                <label
                  htmlFor="medication"
                  className="block text-sm font-bold text-slate-700 mb-2"
                >
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
                  {saving && (
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  )}
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
