"use client";

import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/helpers";
import { ReactNode } from "react";

interface GlowButtonProps extends ButtonProps {
  children: ReactNode;
  glowColor?: "primary" | "gold" | "neon";
}

export function GlowButton({
  children,
  className,
  glowColor = "primary",
  ...props
}: GlowButtonProps) {
  const glowStyles = {
    primary: "from-[#22c55e] via-[#16a34a] to-[#22c55e] shadow-primary/50",
    gold: "from-[#FFD700] via-[#FFA500] to-[#FFD700] shadow-yellow-500/50",
    neon: "from-[#00FFC2] via-[#00D4FF] to-[#00FFC2] shadow-cyan-500/50",
  };

  const hoverGlowStyles = {
    primary: "hover:from-[#16a34a] hover:via-[#22c55e] hover:to-[#16a34a] hover:shadow-primary/70",
    gold: "hover:from-[#FFA500] hover:via-[#FFD700] hover:to-[#FFA500] hover:shadow-yellow-500/70",
    neon: "hover:from-[#00D4FF] hover:via-[#00FFC2] hover:to-[#00D4FF] hover:shadow-cyan-500/70",
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        className={cn(
          "relative overflow-hidden bg-gradient-to-r text-white shadow-lg transition-all duration-500",
          glowStyles[glowColor],
          hoverGlowStyles[glowColor],
          className
        )}
        {...props}
      >
        {/* Animated glow sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <span className="relative z-10 flex items-center justify-center">
          {children}
        </span>
      </Button>
    </motion.div>
  );
}

