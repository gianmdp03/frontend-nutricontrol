export interface ReviewDetailDTO {
  id?: number;
  score: number;
  comment: string;
  date?: string;
}

export interface ReviewRequestDTO {
  appointmentId: number;
  score: number;
  comment: string;
}
