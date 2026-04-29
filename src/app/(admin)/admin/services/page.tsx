import ServiceCard from "@/components/ui/ServiceCard";
import DeleteButton from "../../../../components/admin/services/DeleteButton";
import { deleteServiceAction } from "../../../../actions/serviceActions";
import Link from "next/link";
import { ServiceService } from "@/services/ServiceService";
import { ServiceDetailDTO } from "@/types/Service";

interface Props {}

const ServicesPage = async () => {
  const data: ServiceDetailDTO[] = await ServiceService.get();
  return (
    <div className="grid-cols-3">
      <Link href={"/admin/services/new"}>Crear nuevo servicio</Link>
      {data.map((service) => (
        <ServiceCard
          key={service.id}
          name={service.name}
          description={service.description}
        >
          <Link
            href={`/admin/services/edit/${service.id}`}
            className="btn btn-primary mr-3"
          >
            Editar
          </Link>
          <DeleteButton action={deleteServiceAction} id={service.id}>
            Eliminar
          </DeleteButton>
        </ServiceCard>
      ))}
    </div>
  );
};

export default ServicesPage;
