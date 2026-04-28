"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
}

const ScrollAnimation = ({ children, delay = 0.1 }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
