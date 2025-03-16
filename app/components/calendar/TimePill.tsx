"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface TimePillProps {
  time: string;
  className?: string;
  layoutId?: string;
}

export function TimePill({ time, className, layoutId }: TimePillProps) {
  return (
    <motion.div
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-bold text-white z-10 bg-[#6c63ff]",
        className,
      )}
      layoutId={layoutId}
      transition={{
        layout: { type: "spring", stiffness: 500, damping: 25 },
      }}
    >
      {time}
    </motion.div>
  );
}
