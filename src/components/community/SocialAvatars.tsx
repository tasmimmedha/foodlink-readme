"use client";

import Image from "next/image";
import { cn } from "@/lib/helpers";

interface SocialAvatarsProps {
  avatars: { id: string; src?: string; initials?: string }[];
  className?: string;
  size?: number;
}

export function SocialAvatars({ avatars, className, size = 40 }: SocialAvatarsProps) {
  return (
    <div className={cn("flex items-center", className)} aria-label="Community avatars">
      {avatars.slice(0, 5).map((avatar, index) => (
        <div
          key={avatar.id}
          className={cn(
            "relative rounded-full border-2 border-white dark:border-gray-900 shadow-md shadow-emerald-500/15 bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/30 flex items-center justify-center font-semibold text-emerald-700 dark:text-emerald-200",
            index > 0 && "-ml-3"
          )}
          style={{ width: size, height: size }}
        >
          {avatar.src ? (
            <Image
              src={avatar.src}
              alt="Community member avatar"
              fill
              className="rounded-full object-cover"
              sizes={`${size}px`}
            />
          ) : (
            <span>{avatar.initials ?? "FF"}</span>
          )}
          <span className="absolute inset-0 rounded-full ring-2 ring-emerald-200/60 dark:ring-emerald-500/30" />
        </div>
      ))}
      {avatars.length > 5 && (
        <span className="ml-3 text-xs font-semibold text-emerald-600 dark:text-emerald-300">{`+${avatars.length - 5}`}</span>
      )}
    </div>
  );
}

