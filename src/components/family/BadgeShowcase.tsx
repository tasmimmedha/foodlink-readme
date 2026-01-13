"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUnlockedBadges, useNextBadges } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { cn } from "@/lib/helpers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BadgeShowcase() {
  const { data: unlockedBadges, isLoading: isLoadingUnlocked } = useUnlockedBadges();
  const { data: nextBadges, isLoading: isLoadingNext } = useNextBadges();

  if (isLoadingUnlocked || isLoadingNext) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonLoader variant="card" count={3} />
        </CardContent>
      </Card>
    );
  }

  const unlocked = unlockedBadges || [];
  const next = nextBadges || [];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#FFD700]" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {unlocked.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Unlocked</h4>
              <div className="grid grid-cols-2 gap-3">
                {unlocked.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 border-2 border-[#FFD700]/30"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    <Badge className="mt-2 bg-[#FFD700] text-black">
                      +{badge.xpReward} XP
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {next.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">In Progress</h4>
              <div className="space-y-2">
                {next
                  .filter((b) => !b.unlocked && b.progress > 0)
                  .slice(0, 3)
                  .map(({ badge, progress }, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-3 rounded-lg border",
                        "bg-muted/50 opacity-75"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl opacity-50">{badge.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm">{badge.name}</p>
                            <span className="text-xs text-muted-foreground">{progress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </div>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          <Link href="/family/badges">
            <Button variant="outline" className="w-full">
              View all badges
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

