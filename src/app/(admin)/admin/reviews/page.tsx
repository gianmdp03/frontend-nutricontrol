import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ReviewService } from "@/services/ReviewService";
import Link from "next/link";
import React from "react";
import { ReviewDetailDTO } from "@/types/Review";

// Utilidad para formatear fechas
const formatDate = (dateVal?: any) => {
  if (!dateVal) return "N/A";
  try {
    const parseDateSafe = (dateVal: any): Date => {
      if (!dateVal) return new Date(0);
      if (dateVal instanceof Date) return dateVal;
      if (typeof dateVal === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateVal)) {
        const [datePart, timePart = ""] = dateVal.split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hour = 0, minute = 0, second = 0] = timePart ? timePart.split(":").map(Number) : [];
        return new Date(year, month - 1, day, hour, minute, second);
      }
      if (Array.isArray(dateVal)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateVal;
        return new Date(year, month - 1, day, hour, minute, second);
      }
      if (typeof dateVal === "object") {
        const year = dateVal.year || dateVal.yearValue || 0;
        const month = dateVal.monthValue || dateVal.month || 1;
        const day = dateVal.dayOfMonth || dateVal.day || 1;
        const hour = dateVal.hour || dateVal.hours || 0;
        const minute = dateVal.minute || dateVal.minutes || 0;
        const second = dateVal.second || dateVal.seconds || 0;
        if (year > 0) {
          let monthIndex = 0;
          if (typeof month === "number") {
            monthIndex = month - 1;
          } else if (typeof month === "string") {
            const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
            const shortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
            const mLower = month.toLowerCase();
            const idx = months.indexOf(mLower);
            if (idx !== -1) monthIndex = idx;
            else {
              const idxShort = shortMonths.indexOf(mLower.substring(0, 3));
              if (idxShort !== -1) monthIndex = idxShort;
            }
          }
          return new Date(year, monthIndex, day, hour, minute, second);
        }
      }
      const parsed = new Date(dateVal);
      if (isNaN(parsed.getTime())) {
        const fallback = new Date(`${dateVal}T12:00:00`);
        return isNaN(fallback.getTime()) ? parsed : fallback;
      }
      return parsed;
    };

    const parsedDate = parseDateSafe(dateVal);
    return parsedDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return String(dateVal);
  }
};

// Componente para renderizar estrellas fijas
const StarRating = ({ score }: { score: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= score ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-none"
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.77-.57-.37-1.81.588-1.81h4.906a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  );
};

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken || "";

  let reviews: ReviewDetailDTO[] = [];
  let errorMsg = "";

  try {
    const data = await ReviewService.listAdminReviews(token, 0, 100);
    reviews = data.content || [];
  } catch (error) {
    console.error("Error al cargar reseñas en admin page:", error);
    errorMsg = "No se pudieron recuperar las valoraciones del servidor.";
  }

  // Cálculos estadísticos
  const totalReviews = reviews.length;
  const averageScore =
    totalReviews > 0
      ? (reviews.reduce((acc, curr) => acc + curr.score, 0) / totalReviews).toFixed(1)
      : "0.0";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      
      {/* Retorno */}
      <div className="flex items-center">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Panel
        </Link>
      </div>

      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-15 pointer-events-none">
          <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Valoraciones y Reseñas</h1>
          <p className="text-rose-50 text-sm max-w-2xl font-light">
            Consulta los comentarios, calificaciones y sugerencias que tus pacientes te dejan una vez finalizadas sus consultas médicas.
          </p>
        </div>
      </div>

      {errorMsg ? (
        <div className="alert alert-error shadow-sm rounded-2xl flex gap-3 text-red-800 bg-red-50 border border-red-100">
          <svg className="stroke-current shrink-0 h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Error de Conexión</h3>
            <div className="text-xs">{errorMsg}</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tarjeta de Métricas Generales */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
              <h3 className="font-bold text-slate-800 text-lg">Resumen General</h3>
              
              <div className="w-24 h-24 rounded-full bg-amber-50 flex flex-col items-center justify-center border border-amber-100">
                <span className="text-3xl font-black text-slate-800 tracking-tight">{averageScore}</span>
                <span className="text-[10px] font-bold text-amber-600 uppercase">Estrellas</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-center">
                  <StarRating score={Math.round(parseFloat(averageScore))} />
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Calificación promedio de pacientes
                </p>
              </div>

              <div className="w-full pt-4 border-t border-slate-100 flex justify-around text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Total reseñas</span>
                  <span className="font-extrabold text-slate-800 text-base">{totalReviews}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Estatus</span>
                  <span className="font-semibold text-emerald-600 text-xs px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">Activo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feed de Reseñas */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg mb-2">Comentarios de Pacientes ({totalReviews})</h3>
            
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev: ReviewDetailDTO, index: number) => (
                  <div
                    key={rev.id || index}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          P
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base">Paciente</h4>
                          <span className="text-[10px] text-slate-400 font-semibold block">{formatDate(rev.date)}</span>
                        </div>
                      </div>
                      <StarRating score={rev.score} />
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap relative">
                      <div className="absolute top-3 left-4 text-slate-200/50 text-5xl font-serif pointer-events-none select-none">“</div>
                      <p className="relative z-10 pl-2">{rev.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 mb-3 shadow-xs">
                  <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-700 text-sm">No hay reseñas disponibles</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                  Tus pacientes aún no han registrado opiniones para las consultas finalizadas. Las nuevas reseñas se listarán aquí automáticamente.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
