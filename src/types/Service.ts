export interface ServiceRequestDTO {
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export interface ServiceDetailDTO extends ServiceRequestDTO{
  id: string;
}

export type ServiceUpdateDTO = Partial<ServiceRequestDTO>;