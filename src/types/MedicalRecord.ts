export interface MedicalRecordDetailDTO {
  id?: number;
  age: string;
  weight: number;
  height: number;
  medicalHistory?: string;
  medication?: string;
  lastUpdateDate?: string;
}

export interface MedicalRecordRequestDTO {
  age: string;
  weight: number;
  height: number;
  medicalHistory?: string;
  medication?: string;
}
