"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  medicalHistoryRequestSchema,
  medicalHistoryUpdateSchema,
  medicalHistoryTrackingSchema,
  MedicalHistoryRequestFormValues,
  MedicalHistoryUpdateFormValues,
  MedicalHistoryTrackingFormValues,
} from "@/schemas/MedicalHistorySchema";
import {
  checkMedicalHistoryExistsAction,
  getMedicalHistoryAction,
  createFirstMedicalHistoryAction,
  addMedicalHistoryTrackingAction,
  updateMedicalHistoryAction,
} from "@/actions/medicalHistoryActions";
import {
  MedicalHistoryDetailDTO,
  MedicalHistoryRequestDTO,
  MedicalHistoryUpdateDTO,
  MedicalHistoryTrackingRequestDTO,
} from "@/types/MedicalHistory";
import { MedicalHistoryService } from "@/services/MedicalHistoryService";

interface MedicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  patientName: string;
}

const mapFormToRequestDTO = (
  userId: number,
  formValues: MedicalHistoryRequestFormValues
): MedicalHistoryRequestDTO => {
  return {
    userId,
    allergies: formValues.allergies || "",
    currentIllnessHistory: formValues.currentIllnessHistory || "",
    patientData: {
      fullName: formValues.patientData.fullName,
      nationalId: formValues.patientData.nationalId,
      age: parseInt(formValues.patientData.age, 10) || 0,
      gender: formValues.patientData.gender,
      maritalStatus: formValues.patientData.maritalStatus || "",
      address: formValues.patientData.address || "",
      phoneNumber: formValues.patientData.phoneNumber || "",
      healthInsurance: formValues.patientData.healthInsurance || "",
      occupation: formValues.patientData.occupation || "",
      emergencyContact: formValues.patientData.emergencyContact || "",
    },
    toxicHabits: {
      coffee: formValues.toxicHabits.coffee || "",
      alcohol: formValues.toxicHabits.alcohol || "",
      cigarettes: formValues.toxicHabits.cigarettes || "",
      tea: formValues.toxicHabits.tea || "",
      drugs: formValues.toxicHabits.drugs || "",
      smokingIndex: parseInt(formValues.toxicHabits.smokingIndex || "0", 10) || 0,
    },
    familyHistory: {
      father: formValues.familyHistory.father || "",
      mother: formValues.familyHistory.mother || "",
      grandparents: formValues.familyHistory.grandparents || "",
      others: formValues.familyHistory.others || "",
    },
    systemReview: {
      head: formValues.systemReview.head || "",
      eyes: formValues.systemReview.eyes || "",
      ears: formValues.systemReview.ears || "",
      nose: formValues.systemReview.nose || "",
      mouthAndThroat: formValues.systemReview.mouthAndThroat || "",
      neck: formValues.systemReview.neck || "",
      thorax: formValues.systemReview.thorax || "",
      lungs: formValues.systemReview.lungs || "",
      heart: formValues.systemReview.heart || "",
      abdomen: formValues.systemReview.abdomen || "",
      genitourinary: formValues.systemReview.genitourinary || "",
      extremities: formValues.systemReview.extremities || "",
      musculoskeletal: formValues.systemReview.musculoskeletal || "",
      neurological: formValues.systemReview.neurological || "",
      skin: formValues.systemReview.skin || "",
      generalStatus: formValues.systemReview.generalStatus || "",
    },
    vitalSigns: {
      bloodPressure: formValues.vitalSigns.bloodPressure || "",
      heartRate: formValues.vitalSigns.heartRate ? parseInt(formValues.vitalSigns.heartRate, 10) : undefined,
      respiratoryRate: formValues.vitalSigns.respiratoryRate ? parseInt(formValues.vitalSigns.respiratoryRate, 10) : undefined,
      temperature: formValues.vitalSigns.temperature ? parseFloat(formValues.vitalSigns.temperature) : undefined,
      oxygenSaturation: formValues.vitalSigns.oxygenSaturation ? parseInt(formValues.vitalSigns.oxygenSaturation, 10) : undefined,
      weight: formValues.vitalSigns.weight ? parseFloat(formValues.vitalSigns.weight) : undefined,
      heightSquared: formValues.vitalSigns.heightSquared ? parseFloat(formValues.vitalSigns.heightSquared) : undefined,
      bmi: formValues.vitalSigns.bmi ? parseFloat(formValues.vitalSigns.bmi) : undefined,
      waistCircumference: formValues.vitalSigns.waistCircumference ? parseFloat(formValues.vitalSigns.waistCircumference) : undefined,
      hipCircumference: formValues.vitalSigns.hipCircumference ? parseFloat(formValues.vitalSigns.hipCircumference) : undefined,
      whr: formValues.vitalSigns.whr ? parseFloat(formValues.vitalSigns.whr) : undefined,
    },
    trackingDto: {
      consultationReason: formValues.trackingDto.consultationReason,
      labResultsAndImages: formValues.trackingDto.labResultsAndImages || "",
      diagnosticImpression: formValues.trackingDto.diagnosticImpression || "",
      medicalPlan: formValues.trackingDto.medicalPlan || "",
      medicalHistoryId: 0,
    },
  };
};

const mapFormToUpdateDTO = (
  formValues: MedicalHistoryUpdateFormValues
): MedicalHistoryUpdateDTO => {
  return {
    allergies: formValues.allergies || "",
    currentIllnessHistory: formValues.currentIllnessHistory || "",
    patientData: {
      fullName: formValues.patientData.fullName,
      nationalId: formValues.patientData.nationalId,
      age: parseInt(formValues.patientData.age, 10) || 0,
      gender: formValues.patientData.gender,
      maritalStatus: formValues.patientData.maritalStatus || "",
      address: formValues.patientData.address || "",
      phoneNumber: formValues.patientData.phoneNumber || "",
      healthInsurance: formValues.patientData.healthInsurance || "",
      occupation: formValues.patientData.occupation || "",
      emergencyContact: formValues.patientData.emergencyContact || "",
    },
    toxicHabits: {
      coffee: formValues.toxicHabits.coffee || "",
      alcohol: formValues.toxicHabits.alcohol || "",
      cigarettes: formValues.toxicHabits.cigarettes || "",
      tea: formValues.toxicHabits.tea || "",
      drugs: formValues.toxicHabits.drugs || "",
      smokingIndex: parseInt(formValues.toxicHabits.smokingIndex || "0", 10) || 0,
    },
    familyHistory: {
      father: formValues.familyHistory.father || "",
      mother: formValues.familyHistory.mother || "",
      grandparents: formValues.familyHistory.grandparents || "",
      others: formValues.familyHistory.others || "",
    },
    systemReview: {
      head: formValues.systemReview.head || "",
      eyes: formValues.systemReview.eyes || "",
      ears: formValues.systemReview.ears || "",
      nose: formValues.systemReview.nose || "",
      mouthAndThroat: formValues.systemReview.mouthAndThroat || "",
      neck: formValues.systemReview.neck || "",
      thorax: formValues.systemReview.thorax || "",
      lungs: formValues.systemReview.lungs || "",
      heart: formValues.systemReview.heart || "",
      abdomen: formValues.systemReview.abdomen || "",
      genitourinary: formValues.systemReview.genitourinary || "",
      extremities: formValues.systemReview.extremities || "",
      musculoskeletal: formValues.systemReview.musculoskeletal || "",
      neurological: formValues.systemReview.neurological || "",
      skin: formValues.systemReview.skin || "",
      generalStatus: formValues.systemReview.generalStatus || "",
    },
    vitalSigns: {
      bloodPressure: formValues.vitalSigns.bloodPressure || "",
      heartRate: formValues.vitalSigns.heartRate ? parseInt(formValues.vitalSigns.heartRate, 10) : undefined,
      respiratoryRate: formValues.vitalSigns.respiratoryRate ? parseInt(formValues.vitalSigns.respiratoryRate, 10) : undefined,
      temperature: formValues.vitalSigns.temperature ? parseFloat(formValues.vitalSigns.temperature) : undefined,
      oxygenSaturation: formValues.vitalSigns.oxygenSaturation ? parseInt(formValues.vitalSigns.oxygenSaturation, 10) : undefined,
      weight: formValues.vitalSigns.weight ? parseFloat(formValues.vitalSigns.weight) : undefined,
      heightSquared: formValues.vitalSigns.heightSquared ? parseFloat(formValues.vitalSigns.heightSquared) : undefined,
      bmi: formValues.vitalSigns.bmi ? parseFloat(formValues.vitalSigns.bmi) : undefined,
      waistCircumference: formValues.vitalSigns.waistCircumference ? parseFloat(formValues.vitalSigns.waistCircumference) : undefined,
      hipCircumference: formValues.vitalSigns.hipCircumference ? parseFloat(formValues.vitalSigns.hipCircumference) : undefined,
      whr: formValues.vitalSigns.whr ? parseFloat(formValues.vitalSigns.whr) : undefined,
    },
  };
};

export default function MedicalHistoryModal({
  isOpen,
  onClose,
  patientId,
  patientName,
}: MedicalHistoryModalProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyExists, setHistoryExists] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryDetailDTO | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<number | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const baseForm = useForm<MedicalHistoryRequestFormValues>({
    resolver: zodResolver(medicalHistoryRequestSchema),
    defaultValues: {
      userId: patientId,
      allergies: "",
      currentIllnessHistory: "",
      patientData: {
        fullName: patientName,
        nationalId: "",
        age: "",
        gender: "",
        maritalStatus: "",
        address: "",
        phoneNumber: "",
        healthInsurance: "",
        occupation: "",
        emergencyContact: "",
      },
      toxicHabits: {
        coffee: "",
        alcohol: "",
        cigarettes: "",
        tea: "",
        drugs: "",
        smokingIndex: "",
        cigarettesPerDay: "",
        yearsSmoking: "",
      },
      familyHistory: {
        father: "",
        mother: "",
        grandparents: "",
        others: "",
      },
      systemReview: {
        head: "",
        eyes: "",
        ears: "",
        nose: "",
        mouthAndThroat: "",
        neck: "",
        thorax: "",
        lungs: "",
        heart: "",
        abdomen: "",
        genitourinary: "",
        extremities: "",
        musculoskeletal: "",
        neurological: "",
        skin: "",
        generalStatus: "",
      },
      vitalSigns: {
        bloodPressure: "",
        heartRate: "",
        respiratoryRate: "",
        temperature: "",
        oxygenSaturation: "",
        weight: "",
        height: "",
        heightSquared: "",
        bmi: "",
        waistCircumference: "",
        hipCircumference: "",
        whr: "",
      },
      trackingDto: {
        consultationReason: "",
        labResultsAndImages: "",
        diagnosticImpression: "",
        medicalPlan: "",
      },
    },
  });

  const trackingForm = useForm<MedicalHistoryTrackingFormValues>({
    resolver: zodResolver(medicalHistoryTrackingSchema),
    defaultValues: {
      consultationReason: "",
      labResultsAndImages: "",
      diagnosticImpression: "",
      medicalPlan: "",
    },
  });

  // Watchers reactivos para auto-cálculos
  const cigarettesPerDay = baseForm.watch("toxicHabits.cigarettesPerDay");
  const yearsSmoking = baseForm.watch("toxicHabits.yearsSmoking");
  const weight = baseForm.watch("vitalSigns.weight");
  const height = baseForm.watch("vitalSigns.height");
  const waist = baseForm.watch("vitalSigns.waistCircumference");
  const hip = baseForm.watch("vitalSigns.hipCircumference");

  // Efecto: Índice Tabáquico
  useEffect(() => {
    const currentSmokingIndex = baseForm.getValues("toxicHabits.smokingIndex");
    if (cigarettesPerDay && yearsSmoking) {
      const cigs = parseInt(cigarettesPerDay, 10);
      const years = parseInt(yearsSmoking, 10);
      if (!isNaN(cigs) && !isNaN(years)) {
        const index = String(Math.round((cigs * years) / 20));
        if (currentSmokingIndex !== index) {
          baseForm.setValue("toxicHabits.smokingIndex", index);
        }
      }
    }
  }, [cigarettesPerDay, yearsSmoking]);

  // Efecto: Talla al cuadrado e IMC
  useEffect(() => {
    const currentHeightSquared = baseForm.getValues("vitalSigns.heightSquared");
    const currentBmi = baseForm.getValues("vitalSigns.bmi");

    if (weight && height) {
      const w = parseFloat(weight);
      const hVal = parseFloat(height);
      if (!isNaN(w) && !isNaN(hVal) && hVal > 0) {
        const h2 = (hVal * hVal).toFixed(4);
        const imc = (w / (hVal * hVal)).toFixed(2);
        if (currentHeightSquared !== h2) {
          baseForm.setValue("vitalSigns.heightSquared", h2);
        }
        if (currentBmi !== imc) {
          baseForm.setValue("vitalSigns.bmi", imc);
        }
      } else {
        if (currentHeightSquared !== "") {
          baseForm.setValue("vitalSigns.heightSquared", "");
        }
        if (currentBmi !== "") {
          baseForm.setValue("vitalSigns.bmi", "");
        }
      }
    } else {
      if (currentHeightSquared !== "") {
        baseForm.setValue("vitalSigns.heightSquared", "");
      }
      if (currentBmi !== "") {
        baseForm.setValue("vitalSigns.bmi", "");
      }
    }
  }, [weight, height]);

  // Efecto: ICC
  useEffect(() => {
    const currentWhr = baseForm.getValues("vitalSigns.whr");
    if (waist && hip) {
      const w = parseFloat(waist);
      const h = parseFloat(hip);
      if (!isNaN(w) && !isNaN(h) && h > 0) {
        const icc = (w / h).toFixed(2);
        if (currentWhr !== icc) {
          baseForm.setValue("vitalSigns.whr", icc);
        }
      } else {
        if (currentWhr !== "") {
          baseForm.setValue("vitalSigns.whr", "");
        }
      }
    } else {
      if (currentWhr !== "") {
        baseForm.setValue("vitalSigns.whr", "");
      }
    }
  }, [waist, hip]);

  // Cargar detalles al abrir el modal o cambiar el paciente
  useEffect(() => {
    if (isOpen) {
      loadHistoryDetails();
    }
  }, [isOpen, patientId]);

  const loadHistoryDetails = async () => {
    console.log("[DEBUG CLIENT] loadHistoryDetails iniciada para paciente ID:", patientId);
    setIsLoadingHistory(true);
    setErrorMessage(null);
    try {
      console.log("[DEBUG CLIENT] Ejecutando checkMedicalHistoryExistsAction...");
      const existRes = await checkMedicalHistoryExistsAction(patientId);
      console.log("[DEBUG CLIENT] existRes recibido:", existRes);
      if (existRes.success && existRes.data) {
        console.log("[DEBUG CLIENT] La historia clínica EXISTE. Buscando detalle...");
        setHistoryExists(true);
        const detailRes = await getMedicalHistoryAction(patientId);
        console.log("[DEBUG CLIENT] detailRes recibido:", detailRes);
        if (detailRes.success && detailRes.data) {
          setMedicalHistory(detailRes.data);
          
          const h = detailRes.data;

          // Reversa de talla a metros (raíz cuadrada de tallaCuadrado)
          let calculatedHeight = "";
          if (h.vitalSigns?.heightSquared && h.vitalSigns.heightSquared > 0) {
            calculatedHeight = Math.sqrt(h.vitalSigns.heightSquared).toFixed(2);
          }

          baseForm.reset({
            userId: patientId,
            allergies: h.allergies || "",
            currentIllnessHistory: h.currentIllnessHistory || "",
            patientData: {
              fullName: h.patientData?.fullName || patientName,
              nationalId: h.patientData?.nationalId || "",
              age: h.patientData?.age !== undefined ? String(h.patientData.age) : "",
              gender: h.patientData?.gender || "",
              maritalStatus: h.patientData?.maritalStatus || "",
              address: h.patientData?.address || "",
              phoneNumber: h.patientData?.phoneNumber || "",
              healthInsurance: h.patientData?.healthInsurance || "",
              occupation: h.patientData?.occupation || "",
              emergencyContact: h.patientData?.emergencyContact || "",
            },
            toxicHabits: {
              coffee: h.toxicHabits?.coffee || "",
              alcohol: h.toxicHabits?.alcohol || "",
              cigarettes: h.toxicHabits?.cigarettes || "",
              tea: h.toxicHabits?.tea || "",
              drugs: h.toxicHabits?.drugs || "",
              smokingIndex: h.toxicHabits?.smokingIndex !== undefined ? String(h.toxicHabits.smokingIndex) : "0",
              cigarettesPerDay: "",
              yearsSmoking: "",
            },
            familyHistory: {
              father: h.familyHistory?.father || "",
              mother: h.familyHistory?.mother || "",
              grandparents: h.familyHistory?.grandparents || "",
              others: h.familyHistory?.others || "",
            },
            systemReview: {
              head: h.systemReview?.head || "",
              eyes: h.systemReview?.eyes || "",
              ears: h.systemReview?.ears || "",
              nose: h.systemReview?.nose || "",
              mouthAndThroat: h.systemReview?.mouthAndThroat || "",
              neck: h.systemReview?.neck || "",
              thorax: h.systemReview?.thorax || "",
              lungs: h.systemReview?.lungs || "",
              heart: h.systemReview?.heart || "",
              abdomen: h.systemReview?.abdomen || "",
              genitourinary: h.systemReview?.genitourinary || "",
              extremities: h.systemReview?.extremities || "",
              musculoskeletal: h.systemReview?.musculoskeletal || "",
              neurological: h.systemReview?.neurological || "",
              skin: h.systemReview?.skin || "",
              generalStatus: h.systemReview?.generalStatus || "",
            },
            vitalSigns: {
              bloodPressure: h.vitalSigns?.bloodPressure || "",
              heartRate: h.vitalSigns?.heartRate !== undefined ? String(h.vitalSigns.heartRate) : "",
              respiratoryRate: h.vitalSigns?.respiratoryRate !== undefined ? String(h.vitalSigns.respiratoryRate) : "",
              temperature: h.vitalSigns?.temperature !== undefined ? String(h.vitalSigns.temperature) : "",
              oxygenSaturation: h.vitalSigns?.oxygenSaturation !== undefined ? String(h.vitalSigns.oxygenSaturation) : "",
              weight: h.vitalSigns?.weight !== undefined ? String(h.vitalSigns.weight) : "",
              height: calculatedHeight,
              heightSquared: h.vitalSigns?.heightSquared !== undefined ? String(h.vitalSigns.heightSquared) : "",
              bmi: h.vitalSigns?.bmi !== undefined ? String(h.vitalSigns.bmi) : "",
              waistCircumference: h.vitalSigns?.waistCircumference !== undefined ? String(h.vitalSigns.waistCircumference) : "",
              hipCircumference: h.vitalSigns?.hipCircumference !== undefined ? String(h.vitalSigns.hipCircumference) : "",
              whr: h.vitalSigns?.whr !== undefined ? String(h.vitalSigns.whr) : "",
            },
            trackingDto: {
              consultationReason: "",
              labResultsAndImages: "",
              diagnosticImpression: "",
              medicalPlan: "",
            },
          });
        }
      } else {
        setHistoryExists(false);
        setMedicalHistory(null);
        baseForm.reset({
          userId: patientId,
          allergies: "",
          currentIllnessHistory: "",
          patientData: {
            fullName: patientName,
            nationalId: "",
            age: "",
            gender: "",
            maritalStatus: "",
            address: "",
            phoneNumber: "",
            healthInsurance: "",
            occupation: "",
            emergencyContact: "",
          },
          toxicHabits: {
            coffee: "",
            alcohol: "",
            cigarettes: "",
            tea: "",
            drugs: "",
            smokingIndex: "0",
            cigarettesPerDay: "",
            yearsSmoking: "",
          },
          familyHistory: {},
          systemReview: {},
          vitalSigns: {
            bloodPressure: "",
            heartRate: "",
            respiratoryRate: "",
            temperature: "",
            oxygenSaturation: "",
            weight: "",
            height: "",
            heightSquared: "",
            bmi: "",
            waistCircumference: "",
            hipCircumference: "",
            whr: "",
          },
          trackingDto: {
            consultationReason: "",
            labResultsAndImages: "",
            diagnosticImpression: "",
            medicalPlan: "",
          },
        });
      }
    } catch (err) {
      console.error("[DEBUG CLIENT] Error en catch de loadHistoryDetails:", err);
      setErrorMessage("Ocurrió un error al cargar la historia médica.");
    } finally {
      console.log("[DEBUG CLIENT] loadHistoryDetails finalizado, isLoadingHistory = false");
      setIsLoadingHistory(false);
    }
  };

  const handleCreateFirst = (data: MedicalHistoryRequestFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const dto = mapFormToRequestDTO(patientId, data);

    startTransition(async () => {
      const res = await createFirstMedicalHistoryAction(dto);
      if (res.success && res.data) {
        setSuccessMessage("Historia Médica creada con éxito.");
        setHistoryExists(true);
        setMedicalHistory(res.data);
        setTimeout(() => {
          loadHistoryDetails();
          setActiveTab(6);
          setSuccessMessage(null);
        }, 1500);
      } else {
        setErrorMessage(res.error || "Error al crear la historia médica.");
      }
    });
  };

  const handleUpdateBase = () => {
    const values = baseForm.getValues();
    const dto = mapFormToUpdateDTO(values);

    setErrorMessage(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const res = await updateMedicalHistoryAction(patientId, dto);
      if (res.success && res.data) {
        setSuccessMessage("Datos base actualizados con éxito.");
        setMedicalHistory(res.data);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      } else {
        setErrorMessage(res.error || "Error al actualizar los datos base.");
      }
    });
  };

  const handleAddTracking = (data: MedicalHistoryTrackingFormValues) => {
    if (!medicalHistory) {
      setErrorMessage("No se puede añadir evolución sin una historia clínica activa.");
      return;
    }

    const payload: MedicalHistoryTrackingRequestDTO = {
      consultationReason: data.consultationReason,
      labResultsAndImages: data.labResultsAndImages || "",
      diagnosticImpression: data.diagnosticImpression || "",
      medicalPlan: data.medicalPlan || "",
      medicalHistoryId: medicalHistory.id,
    };

    setErrorMessage(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const res = await addMedicalHistoryTrackingAction(patientId, payload);
      if (res.success && res.data) {
        setSuccessMessage("Evolución médica registrada exitosamente.");
        trackingForm.reset();
        setTimeout(() => {
          loadHistoryDetails();
          setActiveTab(6);
          setSuccessMessage(null);
        }, 1500);
      } else {
        setErrorMessage(res.error || "Error al registrar la evolución.");
      }
    });
  };

  const handleDownloadPdf = async (trackingId?: number) => {
    const token = session?.user?.backendToken;
    if (!token) {
      alert("No estás autenticado en el sistema.");
      return;
    }

    setDownloadingPdf(trackingId !== undefined ? trackingId : -1);
    try {
      const blob = await MedicalHistoryService.downloadPDF(patientId, token, trackingId);
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      alert("No se pudo obtener el PDF. Por favor, intente de nuevo.");
    } finally {
      setDownloadingPdf(null);
    }
  };

  const tabs = [
    { id: 1, label: "Datos Generales" },
    { id: 2, label: "Hábitos y Antecedentes" },
    { id: 3, label: "Revisión Sistemas" },
    { id: 4, label: "Signos Vitales" },
    { id: 5, label: historyExists ? "Nueva Evolución" : "Evolución Inicial" },
  ];

  if (historyExists) {
    tabs.push({ id: 6, label: "Historial" });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-10 flex flex-col"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-5 shrink-0">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Historial Clínico del Paciente</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">
                  Historia Médica: {patientName}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {successMessage && (
              <div className="p-3 mb-4 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-100 flex items-center gap-2 shrink-0">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100 flex items-center gap-2 shrink-0">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {isLoadingHistory ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold text-sm">Consultando ficha e historia clínica...</p>
              </div>
            ) : (
              <>
                <div className="flex gap-1 border-b border-slate-100 overflow-x-auto pb-1 mb-5 shrink-0 scrollbar-thin">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border border-blue-100/50"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto pr-1 pb-4 text-slate-700">
                  {/* TAB 1: PatientData + Alergias + Enf. Actual */}
                  {activeTab === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Nombre Completo *</label>
                          <input
                            type="text"
                            {...baseForm.register("patientData.fullName")}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                          {baseForm.formState.errors.patientData?.fullName && (
                            <p className="text-[10px] text-red-500 font-bold mt-0.5">
                              {baseForm.formState.errors.patientData.fullName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Cédula / ID Nacional *</label>
                          <input
                            type="text"
                            placeholder="Ej: 1-1234-5678"
                            {...baseForm.register("patientData.nationalId")}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                          {baseForm.formState.errors.patientData?.nationalId && (
                            <p className="text-[10px] text-red-500 font-bold mt-0.5">
                              {baseForm.formState.errors.patientData.nationalId.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Edad (Años) *</label>
                          <input
                            type="number"
                            placeholder="Ej: 28"
                            {...baseForm.register("patientData.age")}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                          {baseForm.formState.errors.patientData?.age && (
                            <p className="text-[10px] text-red-500 font-bold mt-0.5">
                              {baseForm.formState.errors.patientData.age.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Género *</label>
                          <select
                            {...baseForm.register("patientData.gender")}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="">Selecciona...</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro / No especificado</option>
                          </select>
                          {baseForm.formState.errors.patientData?.gender && (
                            <p className="text-[10px] text-red-500 font-bold mt-0.5">
                              {baseForm.formState.errors.patientData.gender.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Estado Civil</label>
                          <input
                            type="text"
                            placeholder="Soltero, Casado, etc."
                            {...baseForm.register("patientData.maritalStatus")}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Teléfono de Contacto</label>
                          <input
                            type="text"
                            placeholder="+506 8888-8888"
                            {...baseForm.register("patientData.phoneNumber")}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Dirección Física</label>
                          <input
                            type="text"
                            {...baseForm.register("patientData.address")}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Seguro Médico</label>
                          <input
                            type="text"
                            placeholder="INS, Caja, Seguro Privado"
                            {...baseForm.register("patientData.healthInsurance")}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Ocupación / Trabajo</label>
                          <input
                            type="text"
                            {...baseForm.register("patientData.occupation")}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Contacto de Emergencia</label>
                          <input
                            type="text"
                            placeholder="Nombre y teléfono"
                            {...baseForm.register("patientData.emergencyContact")}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-2 border-t border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-blue-600">
                          Información Clínica Adicional
                        </h4>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Alergias y Restricciones</label>
                            <textarea
                              rows={2}
                              placeholder="Ej: Alergia a la penicilina, intolerancia severa a la lactosa..."
                              {...baseForm.register("allergies")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Historia de la Enfermedad Actual</label>
                            <textarea
                              rows={3}
                              placeholder="Descripción detallada del estado actual, síntomas reportados, evolución cronológica de patologías..."
                              {...baseForm.register("currentIllnessHistory")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {historyExists && (
                        <div className="flex justify-end pt-3">
                          <button
                            type="button"
                            onClick={handleUpdateBase}
                            disabled={isPending}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            {isPending ? "Actualizando..." : "Actualizar Datos Generales"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: ToxicHabits & FamilyHistory */}
                  {activeTab === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wider text-blue-600">
                          Hábitos Tóxicos
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Consumo de Café</label>
                            <input
                              type="text"
                              placeholder="Ej: 2 tazas al día"
                              {...baseForm.register("toxicHabits.coffee")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Consumo de Alcohol</label>
                            <input
                              type="text"
                              placeholder="Ej: Social"
                              {...baseForm.register("toxicHabits.alcohol")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Tabaco / Cigarrillos</label>
                            <input
                              type="text"
                              placeholder="Ej: No consume"
                              {...baseForm.register("toxicHabits.cigarettes")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Té</label>
                            <input
                              type="text"
                              {...baseForm.register("toxicHabits.tea")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Otras Sustancias / Drogas</label>
                            <input
                              type="text"
                              {...baseForm.register("toxicHabits.drugs")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Sub-tarjeta para auto-cálculo del Índice Tabáquico */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                          <span className="text-xs font-bold text-slate-500 uppercase block tracking-wider">Cálculo de Índice Tabáquico</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400 uppercase">Cigarrillos al día</label>
                              <input
                                type="number"
                                placeholder="Ej: 10"
                                {...baseForm.register("toxicHabits.cigarettesPerDay")}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400 uppercase">Años fumando</label>
                              <input
                                type="number"
                                placeholder="Ej: 5"
                                {...baseForm.register("toxicHabits.yearsSmoking")}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400 uppercase">Índice Tabáquico (Calculado)</label>
                              <input
                                type="number"
                                readOnly
                                placeholder="Auto"
                                {...baseForm.register("toxicHabits.smokingIndex")}
                                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed focus:outline-none"
                              />
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold">Fórmula: (Cigarrillos al día * Años fumando) / 20. Redondeado al entero más cercano.</p>
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-slate-100 pt-4">
                        <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wider text-blue-600">
                          Antecedentes Heredofamiliares
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Antecedentes Padre</label>
                            <textarea
                              rows={2}
                              placeholder="Hipertensión arterial, etc."
                              {...baseForm.register("familyHistory.father")}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Antecedentes Madre</label>
                            <textarea
                              rows={2}
                              placeholder="Diabetes Tipo 2, etc."
                              {...baseForm.register("familyHistory.mother")}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Antecedentes Abuelos</label>
                            <textarea
                              rows={2}
                              {...baseForm.register("familyHistory.grandparents")}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Otros Antecedentes</label>
                            <textarea
                              rows={2}
                              {...baseForm.register("familyHistory.others")}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {historyExists && (
                        <div className="flex justify-end pt-3">
                          <button
                            type="button"
                            onClick={handleUpdateBase}
                            disabled={isPending}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            {isPending ? "Actualizando..." : "Actualizar Antecedentes"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: SystemReview */}
                  {activeTab === 3 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wider text-blue-600 shrink-0">
                        Revisión por Sistemas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Cabeza</label>
                          <input type="text" {...baseForm.register("systemReview.head")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Ojos</label>
                          <input type="text" {...baseForm.register("systemReview.eyes")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Oídos</label>
                          <input type="text" {...baseForm.register("systemReview.ears")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Nariz</label>
                          <input type="text" {...baseForm.register("systemReview.nose")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Boca y Garganta</label>
                          <input type="text" {...baseForm.register("systemReview.mouthAndThroat")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Cuello</label>
                          <input type="text" {...baseForm.register("systemReview.neck")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Tórax</label>
                          <input type="text" {...baseForm.register("systemReview.thorax")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Pulmones</label>
                          <input type="text" {...baseForm.register("systemReview.lungs")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Corazón</label>
                          <input type="text" {...baseForm.register("systemReview.heart")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Abdomen</label>
                          <input type="text" {...baseForm.register("systemReview.abdomen")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Genitourinario</label>
                          <input type="text" {...baseForm.register("systemReview.genitourinary")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Extremidades</label>
                          <input type="text" {...baseForm.register("systemReview.extremities")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Osteomuscular</label>
                          <input type="text" {...baseForm.register("systemReview.musculoskeletal")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Neurológico</label>
                          <input type="text" {...baseForm.register("systemReview.neurological")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Piel</label>
                          <input type="text" {...baseForm.register("systemReview.skin")} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none" />
                        </div>
                        <div className="space-y-1 md:col-span-3">
                          <label className="text-xs font-bold text-slate-500 uppercase">Estado General</label>
                          <textarea rows={2} {...baseForm.register("systemReview.generalStatus")} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none resize-none" />
                        </div>
                      </div>

                      {historyExists && (
                        <div className="flex justify-end pt-3">
                          <button
                            type="button"
                            onClick={handleUpdateBase}
                            disabled={isPending}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            {isPending ? "Actualizando..." : "Actualizar Examen Sistemas"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: VitalSigns */}
                  {activeTab === 4 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wider text-blue-600">
                        Signos Vitales y Antropometría
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Presión Arterial (PA)</label>
                          <input type="text" placeholder="Ej: 120/80 mmHg" {...baseForm.register("vitalSigns.bloodPressure")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Frecuencia Cardíaca (FC)</label>
                          <input type="number" placeholder="Ej: 72" {...baseForm.register("vitalSigns.heartRate")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Frecuencia Respiratoria (FR)</label>
                          <input type="number" placeholder="Ej: 16" {...baseForm.register("vitalSigns.respiratoryRate")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Temperatura (°C)</label>
                          <input type="text" placeholder="Ej: 36.5" {...baseForm.register("vitalSigns.temperature")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">Saturación Oxígeno (SpO2)</label>
                          <input type="number" placeholder="Ej: 98" {...baseForm.register("vitalSigns.oxygenSaturation")} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                      </div>

                      {/* Sub-tarjeta para auto-cálculos antropométricos */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 mt-2">
                        <span className="text-xs font-bold text-slate-500 uppercase block tracking-wider">Cálculos Antropométricos Automáticos</span>
                        
                        {/* Fila 1: Peso, Estatura, Estatura al Cuadrado e IMC */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">Peso (kg)</label>
                            <input
                              type="text"
                              placeholder="Ej: 70.0"
                              {...baseForm.register("vitalSigns.weight")}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">Altura / Estatura (m)</label>
                            <input
                              type="text"
                              placeholder="Ej: 1.75"
                              {...baseForm.register("vitalSigns.height")}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">Talla al Cuadrado (Calculado)</label>
                            <input
                              type="text"
                              readOnly
                              placeholder="Auto"
                              {...baseForm.register("vitalSigns.heightSquared")}
                              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">IMC (Calculado)</label>
                            <input
                              type="text"
                              readOnly
                              placeholder="Auto"
                              {...baseForm.register("vitalSigns.bmi")}
                              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Fila 2: Cintura, Cadera e ICC */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200/50 pt-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">Circunferencia Cintura (cm)</label>
                            <input
                              type="text"
                              placeholder="Ej: 88.0"
                              {...baseForm.register("vitalSigns.waistCircumference")}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">Circunferencia Cadera (cm)</label>
                            <input
                              type="text"
                              placeholder="Ej: 98.0"
                              {...baseForm.register("vitalSigns.hipCircumference")}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400 uppercase">Índice Cintura Cadera (ICC / WHR)</label>
                            <input
                              type="text"
                              readOnly
                              placeholder="Auto"
                              {...baseForm.register("vitalSigns.whr")}
                              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 cursor-not-allowed focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {historyExists && (
                        <div className="flex justify-end pt-3">
                          <button
                            type="button"
                            onClick={handleUpdateBase}
                            disabled={isPending}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            {isPending ? "Actualizando..." : "Actualizar Signos Vitales"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 5: Evolución (Nueva o Inicial) */}
                  {activeTab === 5 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1 uppercase tracking-wider text-blue-600">
                        {historyExists ? "Registrar Evolución de la Consulta" : "Evolución Inicial del Paciente"}
                      </h4>

                      {historyExists ? (
                        <form onSubmit={trackingForm.handleSubmit(handleAddTracking)} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Motivo de Consulta *</label>
                            <textarea
                              rows={3}
                              placeholder="Ej: Paciente asiste a control..."
                              {...trackingForm.register("consultationReason")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none focus:ring-2 focus:ring-blue-100"
                            />
                            {trackingForm.formState.errors.consultationReason && (
                              <p className="text-[10px] text-red-500 font-bold mt-0.5">
                                {trackingForm.formState.errors.consultationReason.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Resultados de Laboratorio e Imágenes</label>
                            <textarea
                              rows={2}
                              {...trackingForm.register("labResultsAndImages")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Impresión Diagnóstica</label>
                            <input
                              type="text"
                              {...trackingForm.register("diagnosticImpression")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Plan Médico / Indicaciones</label>
                            <textarea
                              rows={3}
                              {...trackingForm.register("medicalPlan")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none"
                            />
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="submit"
                              disabled={isPending}
                              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
                            >
                              {isPending ? "Registrando Evolución..." : "Guardar Evolución Médica"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form onSubmit={baseForm.handleSubmit(handleCreateFirst)} className="space-y-4">
                          <div className="p-3.5 bg-amber-50/50 border border-amber-200/40 rounded-2xl text-xs text-amber-800 font-semibold mb-2">
                            Aún no existe una Historia Clínica para este paciente. Al guardar, se creará la historia y se registrará esta primera evolución.
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Motivo de Consulta * (Evolución Inicial)</label>
                            <textarea
                              rows={3}
                              placeholder="Ej: Primera consulta..."
                              {...baseForm.register("trackingDto.consultationReason")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none focus:ring-2 focus:ring-blue-100"
                            />
                            {baseForm.formState.errors.trackingDto?.consultationReason && (
                              <p className="text-[10px] text-red-500 font-bold mt-0.5">
                                {baseForm.formState.errors.trackingDto.consultationReason.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Resultados de Laboratorio e Imágenes</label>
                            <textarea
                              rows={2}
                              {...baseForm.register("trackingDto.labResultsAndImages")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Impresión Diagnóstica</label>
                            <input
                              type="text"
                              {...baseForm.register("trackingDto.diagnosticImpression")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Plan Médico / Indicaciones</label>
                            <textarea
                              rows={3}
                              {...baseForm.register("trackingDto.medicalPlan")}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none resize-none"
                            />
                          </div>

                          <div className="flex gap-3 pt-3 justify-end">
                            <button
                              type="button"
                              onClick={() => setActiveTab(1)}
                              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                            >
                              Revisar Datos Base
                            </button>
                            <button
                              type="submit"
                              disabled={isPending}
                              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
                            >
                              {isPending ? "Creando Historia Clínica..." : "Crear Historia Clínica"}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* TAB 6: Historial */}
                  {activeTab === 6 && historyExists && medicalHistory && (
                    <div className="space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-blue-600">
                            Historial de Evoluciones
                          </h4>
                          <p className="text-[11px] text-slate-400 font-bold">Listado ordenado de consultas previas.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownloadPdf()}
                          disabled={downloadingPdf === -1}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          {downloadingPdf === -1 ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                              <span>Generando PDF...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Descargar Historia Completa (PDF)</span>
                            </>
                          )}
                        </button>
                      </div>

                      {medicalHistory.trackings && medicalHistory.trackings.length > 0 ? (
                        <div className="space-y-4">
                          {medicalHistory.trackings.map((track, idx) => {
                            const dateStr = track.datetime || "";
                            return (
                              <div
                                key={track.id || idx}
                                className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative overflow-hidden space-y-3"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 pb-2">
                                  <div>
                                    <span className="text-xs font-extrabold text-blue-600 block">Consulta #{medicalHistory.trackings.length - idx}</span>
                                    <span className="text-[11px] text-slate-400 font-bold block">{dateStr}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadPdf(track.id)}
                                    disabled={downloadingPdf === track.id}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 font-bold border border-slate-200 rounded-lg text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    {downloadingPdf === track.id ? (
                                      <>
                                        <div className="w-3 h-3 border-2 border-slate-400/20 border-t-slate-500 rounded-full animate-spin"></div>
                                        <span>Descargando...</span>
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Evolución PDF</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 gap-2 text-xs">
                                  <div>
                                    <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">Motivo de Consulta</span>
                                    <p className="text-slate-700 font-medium whitespace-pre-wrap">{track.consultationReason}</p>
                                  </div>
                                  {track.labResultsAndImages && (
                                    <div>
                                      <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">Laboratorio / Imágenes</span>
                                      <p className="text-slate-600 font-medium whitespace-pre-wrap">{track.labResultsAndImages}</p>
                                    </div>
                                  )}
                                  {track.diagnosticImpression && (
                                    <div>
                                      <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">Diagnóstico</span>
                                      <p className="text-slate-700 font-bold">{track.diagnosticImpression}</p>
                                    </div>
                                  )}
                                  {track.medicalPlan && (
                                    <div>
                                      <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">Plan Médico / Indicaciones</span>
                                      <p className="text-slate-600 font-medium whitespace-pre-wrap">{track.medicalPlan}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-400">
                          No hay evoluciones previas registradas para este paciente.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 flex gap-3 justify-end shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
