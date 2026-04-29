import { getServiceById } from "@/services/ServiceService";

const page = async ({ params }: { params: { id: string } }) => {
  const service = await getServiceById(params.id);
  return <div></div>;
};

export default page;
