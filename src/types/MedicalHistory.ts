export interface PatientData {
  fullName: string;
  nationalId: string;
  age: number;
  gender: string;
  maritalStatus?: string;
  address?: string;
  phoneNumber?: string;
  healthInsurance?: string;
  occupation?: string;
  emergencyContact?: string;
}

export interface ToxicHabits {
  coffee?: string;
  alcohol?: string;
  cigarettes?: string;
  tea?: string;
  drugs?: string;
  smokingIndex: number;
}

export interface FamilyHistory {
  father?: string;
  mother?: string;
  grandparents?: string;
  others?: string;
}

export interface SystemReview {
  head?: string;
  eyes?: string;
  ears?: string;
  nose?: string;
  mouthAndThroat?: string;
  neck?: string;
  thorax?: string;
  lungs?: string;
  heart?: string;
  abdomen?: string;
  genitourinary?: string;
  extremities?: string;
  musculoskeletal?: string;
  neurological?: string;
  skin?: string;
  generalStatus?: string;
}

export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  weight?: number;
  heightSquared?: number;
  bmi?: number;
  waistCircumference?: number;
  hipCircumference?: number;
  whr?: number;
}

export interface MedicalHistoryTrackingRequestDTO {
  consultationReason: string;
  labResultsAndImages?: string;
  diagnosticImpression?: string;
  medicalPlan?: string;
  medicalHistoryId: number;
}

export interface MedicalHistoryTrackingDetailDTO {
  id: number;
  consultationReason: string;
  labResultsAndImages?: string;
  diagnosticImpression?: string;
  medicalPlan?: string;
  datetime?: string;
}

export interface MedicalHistoryRequestDTO {
  patientData: PatientData;
  allergies?: string;
  currentIllnessHistory?: string;
  toxicHabits: ToxicHabits;
  familyHistory: FamilyHistory;
  systemReview: SystemReview;
  vitalSigns: VitalSigns;
  trackingDto: MedicalHistoryTrackingRequestDTO;
  userId: number;
}

export interface MedicalHistoryUpdateDTO {
  patientData: PatientData;
  allergies?: string;
  currentIllnessHistory?: string;
  toxicHabits: ToxicHabits;
  familyHistory: FamilyHistory;
  systemReview: SystemReview;
  vitalSigns: VitalSigns;
}

export interface MedicalHistoryDetailDTO {
  id: number;
  trackings: MedicalHistoryTrackingDetailDTO[];
  patientData: PatientData;
  allergies?: string;
  currentIllnessHistory?: string;
  toxicHabits: ToxicHabits;
  familyHistory: FamilyHistory;
  systemReview: SystemReview;
  vitalSigns: VitalSigns;
}
