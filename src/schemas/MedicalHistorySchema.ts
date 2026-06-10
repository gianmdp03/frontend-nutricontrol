import * as z from "zod/mini";

export const patientDataSchema = z.object({
  fullName: z
    .string()
    .check(z.minLength(1, "El nombre completo es obligatorio")),
  nationalId: z
    .string()
    .check(z.minLength(1, "La identificación nacional es obligatoria")),
  age: z
    .string()
    .check(z.minLength(1, "La edad es obligatoria")),
  gender: z
    .string()
    .check(z.minLength(1, "El género es obligatorio")),
  maritalStatus: z.optional(z.string()),
  address: z.optional(z.string()),
  phoneNumber: z.optional(z.string()),
  healthInsurance: z.optional(z.string()),
  occupation: z.optional(z.string()),
  emergencyContact: z.optional(z.string()),
});

export const toxicHabitsSchema = z.object({
  coffee: z.optional(z.string()),
  alcohol: z.optional(z.string()),
  cigarettes: z.optional(z.string()),
  tea: z.optional(z.string()),
  drugs: z.optional(z.string()),
  smokingIndex: z.optional(z.string()),
  cigarettesPerDay: z.optional(z.string()),
  yearsSmoking: z.optional(z.string()),
});

export const familyHistorySchema = z.object({
  father: z.optional(z.string()),
  mother: z.optional(z.string()),
  grandparents: z.optional(z.string()),
  others: z.optional(z.string()),
});

export const systemReviewSchema = z.object({
  head: z.optional(z.string()),
  eyes: z.optional(z.string()),
  ears: z.optional(z.string()),
  nose: z.optional(z.string()),
  mouthAndThroat: z.optional(z.string()),
  neck: z.optional(z.string()),
  thorax: z.optional(z.string()),
  lungs: z.optional(z.string()),
  heart: z.optional(z.string()),
  abdomen: z.optional(z.string()),
  genitourinary: z.optional(z.string()),
  extremities: z.optional(z.string()),
  musculoskeletal: z.optional(z.string()),
  neurological: z.optional(z.string()),
  skin: z.optional(z.string()),
  generalStatus: z.optional(z.string()),
});

export const vitalSignsSchema = z.object({
  bloodPressure: z.optional(z.string()),
  heartRate: z.optional(z.string()),
  respiratoryRate: z.optional(z.string()),
  temperature: z.optional(z.string()),
  oxygenSaturation: z.optional(z.string()),
  weight: z.optional(z.string()),
  height: z.optional(z.string()),
  heightSquared: z.optional(z.string()),
  bmi: z.optional(z.string()),
  waistCircumference: z.optional(z.string()),
  hipCircumference: z.optional(z.string()),
  whr: z.optional(z.string()),
});

export const medicalHistoryTrackingSchema = z.object({
  consultationReason: z
    .string()
    .check(z.minLength(1, "El motivo de consulta es obligatorio")),
  labResultsAndImages: z.optional(z.string()),
  diagnosticImpression: z.optional(z.string()),
  medicalPlan: z.optional(z.string()),
  medicalHistoryId: z.optional(z.number()),
});

export const medicalHistoryRequestSchema = z.object({
  userId: z.number(),
  allergies: z.optional(z.string()),
  currentIllnessHistory: z.optional(z.string()),
  patientData: patientDataSchema,
  toxicHabits: toxicHabitsSchema,
  familyHistory: familyHistorySchema,
  systemReview: systemReviewSchema,
  vitalSigns: vitalSignsSchema,
  trackingDto: medicalHistoryTrackingSchema,
});

export const medicalHistoryUpdateSchema = z.object({
  allergies: z.optional(z.string()),
  currentIllnessHistory: z.optional(z.string()),
  patientData: patientDataSchema,
  toxicHabits: toxicHabitsSchema,
  familyHistory: familyHistorySchema,
  systemReview: systemReviewSchema,
  vitalSigns: vitalSignsSchema,
});

export type MedicalHistoryRequestFormValues = z.infer<typeof medicalHistoryRequestSchema>;
export type MedicalHistoryUpdateFormValues = z.infer<typeof medicalHistoryUpdateSchema>;
export type MedicalHistoryTrackingFormValues = z.infer<typeof medicalHistoryTrackingSchema>;
