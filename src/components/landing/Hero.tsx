import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import { getServerSession } from "next-auth";
import Link from "next/link";

type Props = {
  isAdmin: boolean;
};

const Hero = ({ isAdmin }: Props) => {
  return (
    <ScrollAnimation>
      <section
        id="hero"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12"
      >
        <div className="md:w-1/2 space-y-6">
          <p className="text-rose-500 font-semibold tracking-wider text-sm uppercase">
            Atención Médica Virtual
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            Tu salud, donde estés.
            <br />
            Nosotros te cuidamos.
          </h2>
          <p className="text-gray-600 text-lg">
            Consulta médica virtual con la Dra. Zully María Cepeda Morel.
            <br />
            Atención profesional, personalizada y segura desde la comodidad de
            tu hogar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="bg-rose-50 text-rose-500 p-2 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">
                  Atención segura
                </h4>
                <p className="text-xs text-gray-500">
                  Confidencial y 100% privada.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-rose-50 text-rose-500 p-2 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">
                  A tu tiempo
                </h4>
                <p className="text-xs text-gray-500">
                  Agenda en el horario que más te convenga.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-rose-50 text-rose-500 p-2 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">
                  100% online
                </h4>
                <p className="text-xs text-gray-500">
                  Sin filas, sin traslados, sin complicaciones.
                </p>
              </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="flex flex-wrap gap-4 pt-6">
              <Link
                href="/appointments"
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-md font-medium flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Agendar consulta ahora
              </Link>
              <Link
                href="/#services"
                className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium"
              >
                Ver servicios
              </Link>
            </div>
          )}
        </div>
        <div className="md:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
            alt="Dra. Zully María Cepeda Morel"
            className="rounded-2xl object-cover h-125 w-full shadow-lg"
          />

          <div className="absolute -bottom-6 right-6 bg-white p-4 rounded-xl shadow-xl flex flex-col items-center border border-gray-100">
            <div className="flex items-center gap-2 text-rose-500 text-xl font-bold">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              5.0
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Pacientes satisfechos
            </p>
          </div>
        </div>
      </section>
    </ScrollAnimation>
  );
};

export default Hero;
