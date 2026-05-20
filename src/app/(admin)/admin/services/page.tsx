import ServiceCard from "@/components/ui/ServiceCard";
import DeleteButton from "../../../../components/ui/DeleteButton";
import { deleteServiceAction } from "../../../../actions/serviceActions";
import Link from "next/link";
import { ServiceService } from "@/services/ServiceService";
import { ServiceDetailDTO } from "@/types/Service";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const ServicesPage = async () => {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken || "";
  const data: ServiceDetailDTO[] = await ServiceService.get();
  return (
    <div className="grid-cols-3">
      <Link href={"/admin/services/new"} className="btn btn-primary">
        Crear nuevo servicio
      </Link>
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
          <DeleteButton action={deleteServiceAction} id={service.id} name={service.name} token={token}>
            Eliminar
          </DeleteButton>
        </ServiceCard>
      ))}
    </div>
  );
};

export default ServicesPage;
