export interface PrescriptionRequestDTO {
  patientName: string;
  age: string;
  textareaTexto: string;
  userId?: number | null;
}

export interface PrescriptionDetailDTO {
  id: number;
  patientName: string;
  age: string;
  textareaTexto: string;
  adminName: string;
  specialty: string;
  exequatur: string;
  date: string;
}
