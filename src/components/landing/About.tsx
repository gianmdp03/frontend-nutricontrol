import ScrollAnimation from "@/components/ui/ScrollAnimation";
import Image from "next/image";

const About = () => {
  return (
    <ScrollAnimation>
      <section
        id="about"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Subcontenedor de Foto y Biografía */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left flex-1">
            <div className="w-32 h-32 shrink-0">
              <Image
                width={128}
                height={128}
                src="/hero_pic.png"
                alt="Doctor Profile"
                className="w-full h-full object-cover rounded-full shadow-md border-4 border-white"
              />
            </div>
            <div className="flex-1">
              <p className="text-rose-500 font-medium text-sm mb-1">
                Conoce a la doctora
              </p>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Dra. Zully María Cepeda Morel
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Médico Familiar y Comunitario, egresada de Medicina General de
                UTESA,
                <br className="hidden md:block" /> con especialidad en Medicina
                Familiar y Comunitaria por la PUCMM y
                <br className="hidden md:block" /> diplomado en Nutrición y
                Dietética por UAPA.
              </p>
              <p className="text-sm text-gray-500">
                Su enfoque se basa en una atención cercana, preventiva y
                personalizada
                <br className="hidden md:block" /> para ayudarte a cuidar tu salud
                de forma realista y sostenible.
              </p>
            </div>
          </div>

          {/* Bloque de estadísticas adaptativo */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col gap-6 text-center justify-center shrink-0 w-full lg:w-auto pt-6 lg:pt-0 border-t border-gray-100 lg:border-t-0 lg:border-l lg:border-gray-100 lg:pl-10">
            <div className="flex flex-col items-center">
              <div className="text-rose-400 mb-1">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="font-bold text-slate-800 text-sm">+5 años</span>
              <span className="text-xs text-gray-500">de experiencia</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-rose-400 mb-1">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="font-bold text-slate-800 text-sm">Atención</span>
              <span className="text-xs text-gray-500">100% virtual</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-rose-400 mb-1">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="font-bold text-slate-800 text-sm">
                Pacientes
              </span>
              <span className="text-xs text-gray-500">satisfechos</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-rose-400 mb-1">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="font-bold text-slate-800 text-sm">
                Comprometida
              </span>
              <span className="text-xs text-gray-500">contigo</span>
            </div>
          </div>
        </div>
      </section>
    </ScrollAnimation>
  );
};

export default About;
