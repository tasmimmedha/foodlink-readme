"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SocialAvatars } from "./SocialAvatars";

interface XPBoostBannerProps {
  title?: string;
  description?: string;
  xpValue?: number;
}

export function XPBoostBanner({
  title = "Community XP Boost",
  description = "Share surplus today and unlock bonus XP streaks.",
  xpValue = 120,
}: XPBoostBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30 text-white"
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm uppercase tracking-wide font-semibold text-emerald-900">
            <Sparkles className="h-4 w-4" />
            LIVE BOOST
          </div>
          <h3 className="mt-2 text-2xl font-bold">{title}</h3>
          <p className="text-sm text-emerald-50/90 max-w-2xl">{description}</p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <div className="text-center md:text-right">
            <p className="text-sm uppercase tracking-tight text-emerald-900">Bonus XP</p>
            <p className="text-4xl font-black drop-shadow-sm">{`+${xpValue}`}</p>
          </div>
          <SocialAvatars
            avatars={[
              { id: "1", src: "https://api.dicebear.com/7.x/thumbs/svg?seed=One" },
              { id: "2", src: "https://api.dicebear.com/7.x/thumbs/svg?seed=Two" },
              { id: "3", src: "https://api.dicebear.com/7.x/thumbs/svg?seed=Three" },
              { id: "4", src: "https://api.dicebear.com/7.x/thumbs/svg?seed=Four" },
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
}

