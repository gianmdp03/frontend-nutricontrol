import ScrollAnimation from "@/components/ScrollAnimation";
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
            <div
              key={service.id}
              className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm text-center hover:shadow-md transition"
            >
              <div className="w-14 h-14 mx-auto bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">
                {service.name}
              </h4>
              <p className="text-sm text-gray-500 mb-4 h-10">
                {service.description}
              </p>
              <a
                href="#"
                className="text-rose-500 text-sm font-medium hover:underline"
              >
                Ver detalles →
              </a>
            </div>
          ))}
        </div>
      </section>
    </ScrollAnimation>
  );
};

export default Services;
