export interface MedicalRecordDetailDTO {
  id?: number;
  weight: number;
  height: number;
  medicalHistory?: string;
  medication?: string;
  lastUpdateDate?: string;
}

export interface MedicalRecordRequestDTO {
  weight: number;
  height: number;
  medicalHistory?: string;
  medication?: string;
}
