"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNutritionBadges } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { Trophy, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function NutritionBadgePreview() {
  const { data: badges, isLoading } = useNutritionBadges();

  if (isLoading) {
    return <SkeletonLoader variant="card" count={1} />;
  }

  if (!badges || badges.length === 0) {
    return null;
  }

  const unlockedBadges = badges.filter((b) => b.unlocked);
  const inProgressBadges = badges.filter((b) => !b.unlocked && b.progress > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          Nutrition Badges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {unlockedBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              Unlocked ({unlockedBadges.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {unlockedBadges.map((badge, index) => (
                <motion.div
                  key={badge.badgeId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-800 rounded-lg text-center"
                >
                  <p className="text-2xl mb-1">🏆</p>
                  <p className="text-xs font-semibold">{badge.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {inProgressBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              In Progress ({inProgressBadges.length})
            </h3>
            <div className="space-y-2">
              {inProgressBadges.map((badge, index) => (
                <motion.div
                  key={badge.badgeId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">{badge.name}</p>
                    <Badge variant="secondary">{Math.round(badge.progress)}%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {badge.description}
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${badge.progress}%` }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {unlockedBadges.length === 0 && inProgressBadges.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            Complete nutrition goals to unlock badges!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

