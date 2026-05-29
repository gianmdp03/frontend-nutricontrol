export interface MedicalCertificateRequestDTO {
  patientName: string;
  age: string;
  textareaTexto: string;
  userId: number;
}

export interface MedicalCertificateDetailDTO {
  id: number;
  patientName: string;
  age: string;
  textareaTexto: string;
  adminName: string;
  specialty: string;
  exequatur: string;
  date: string;
}
