import { ServiceDetailDTO } from "@/types/Service";

export async function getServices(): Promise<ServiceDetailDTO[]> {
  const response = await fetch(`${process.env.API_URL}/services/public`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Error en la API");

  const data = await response.json();

  return data.content || [];
}
