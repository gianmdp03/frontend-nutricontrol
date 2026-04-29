import ScrollAnimation from "@/components/ScrollAnimation";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/services/ServiceService";

const Services = async () => {
  const services = await getServices();

  return (
    <ScrollAnimation>
      <section className="bg-gray-50/50 py-16" id="services">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-800">
            Servicios disponibles
          </h3>
          <p className="text-gray-500 mt-2">
            Elige el servicio que necesitas. Atención médica profesional y
            personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} name={service.name} description={service.description}>
              <a href="#" className="text-rose-500 text-sm font-medium hover:underline">
                Ver detalles →
              </a>
            </ServiceCard>
          ))}
        </div>
      </section>
    </ScrollAnimation>
  );
};

export default Services;
