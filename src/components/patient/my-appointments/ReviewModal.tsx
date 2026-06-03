"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addReviewAction } from "@/actions/reviewActions";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  appointmentId: number;
}

export default function ReviewModal({ isOpen, onClose, doctorName, appointmentId }: ReviewModalProps) {
  const [score, setScore] = useState<number>(5);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (score < 1 || score > 5) {
      setError("Por favor, selecciona una calificación entre 1 y 5 estrellas.");
      setSubmitting(false);
      return;
    }

    if (!comment.trim()) {
      setError("Por favor, escribe un comentario para tu reseña.");
      setSubmitting(false);
      return;
    }

    const res = await addReviewAction({ appointmentId, score, comment });
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setComment("");
        setScore(5);
        onClose();
      }, 2000);
    } else {
      setError(res.error || "Hubo un error al enviar tu valoración.");
    }
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Content Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100/80 overflow-hidden z-10"
          >
            
            {/* Gradient background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

            {success ? (
              /* Éxito - Feedback Visual Premium */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-xs border border-emerald-100">
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-10 h-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </motion.svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">¡Muchas gracias!</h3>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                  Tu reseña ha sido enviada con éxito. Valoramos enormemente tus comentarios para seguir mejorando nuestro servicio.
                </p>
              </motion.div>
            ) : (
              /* Formulario de Reseña */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Cabecera */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800">Valorar Servicio</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Cuéntanos cómo fue tu consulta con la <span className="font-semibold text-slate-700">{doctorName}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs font-semibold border border-red-100 flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Calificación de Estrellas Interactiva */}
                <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                    ¿Qué puntuación le darías?
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = hoverScore !== null ? star <= hoverScore : star <= score;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setScore(star)}
                          onMouseEnter={() => setHoverScore(star)}
                          onMouseLeave={() => setHoverScore(null)}
                          className="relative p-1 focus:outline-none transition-transform active:scale-90"
                        >
                          <svg
                            className={`w-10 h-10 transition-colors duration-200 ${
                              isActive
                                ? "text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]"
                                : "text-slate-300 fill-none"
                            }`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.77-.57-.37-1.81.588-1.81h4.906a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-slate-600 mt-2.5">
                    {score === 1 && "Muy insatisfecho"}
                    {score === 2 && "Insatisfecho"}
                    {score === 3 && "Regular"}
                    {score === 4 && "Muy bueno"}
                    {score === 5 && "¡Excelente servicio!"}
                  </span>
                </div>

                {/* Comentarios */}
                <div>
                  <label htmlFor="review-comment" className="block text-sm font-bold text-slate-700 mb-2">
                    Escribe tu opinión
                  </label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-800 leading-relaxed text-sm"
                    placeholder="Comparte tu experiencia médica... ¿Te sirvieron los planes alimentarios? ¿Qué tal la puntualidad y atención de la Dra.?"
                  />
                </div>

                {/* Botones de control */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    {submitting && (
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    )}
                    {submitting ? "Enviando..." : "Enviar Valoración"}
                  </button>
                </div>

              </form>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
