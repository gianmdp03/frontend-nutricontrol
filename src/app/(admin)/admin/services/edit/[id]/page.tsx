import { getServiceById } from "@/services/ServiceService";
import ServiceForm from "../../_components/ServiceForm";

const page = async ({ params }: { params: { id: string } }) => {
  const service = await getServiceById(params.id);
  return <ServiceForm initialData={service} />;
};

export default page;
