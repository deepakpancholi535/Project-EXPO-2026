"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PageShell = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6", className)}
    >
      {children}
    </motion.main>
  );
};
