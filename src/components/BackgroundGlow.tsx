"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function InteractiveGlow() {
  // 1. Guardamos la posición X e Y del mouse
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // 2. Le agregamos "física" para que no siga al mouse de golpe, sino con suavidad (tipo resorte)
  const springConfig = { damping: 25, stiffness: 100 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Le restamos la mitad del tamaño de la mancha (250px) para que el mouse quede en el centro
      cursorX.set(e.clientX - 250);
      cursorY.set(e.clientY - 250);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    // pointer-events-none es VITAL para que la mancha no bloquee los clics en tus botones
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-slate-50">
      {/* El aura que sigue al mouse */}
      <motion.div
        className="absolute h-125 w-125 rounded-full bg-rose-200/40 blur-[120px]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />

      {/* Una mancha estática de contraste en una esquina para que no quede vacío */}
      <div className="absolute bottom-[-20%] right-[-10%] h-150 w-150 rounded-full bg-teal-100/30 blur-[120px]" />
    </div>
  );
}
