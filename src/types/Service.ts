export interface ServiceRequestDTO {
  name: string;
  description: string;
}

export interface ServiceDetailDTO extends ServiceRequestDTO {
  id: string;
}

export type ServiceUpdateDTO = Partial<ServiceRequestDTO>;
