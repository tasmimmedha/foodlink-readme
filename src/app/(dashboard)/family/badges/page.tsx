"use client";

import { PageHeader } from "@/components/shared/page-header";
import { useUnlockedBadges, useNextBadges, useCheckAndUnlockBadges } from "@/hooks/use-query-family";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/helpers";
import { toast } from "@/components/ui/use-toast";

export default function BadgesPage() {
  const { data: unlockedBadges, isLoading: isLoadingUnlocked } = useUnlockedBadges();
  const { data: nextBadges, isLoading: isLoadingNext } = useNextBadges();
  const checkMutation = useCheckAndUnlockBadges();

  const isLoading = isLoadingUnlocked || isLoadingNext;

  const unlocked = unlockedBadges || [];
  const next = nextBadges || [];

  const handleCheckBadges = async () => {
    try {
      await checkMutation.mutateAsync();
      toast({
        title: "Checked",
        description: "Badge eligibility has been checked. New badges may have been unlocked!",
      });
    } catch (error) {
      console.error("Error checking badges:", error);
      toast({
        title: "Error",
        description: "Failed to check for badges. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Badges & Achievements"
        description="Unlock achievements and earn XP"
        action={
          <Button
            variant="outline"
            onClick={handleCheckBadges}
            disabled={checkMutation.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${checkMutation.isPending ? "animate-spin" : ""}`} />
            Check for New Badges
          </Button>
        }
      />

      {/* Unlocked Badges */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-[#FFD700]" />
            Unlocked Badges ({unlocked.length})
          </h2>
          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlocked.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 border-2 border-[#FFD700]/30 hover:shadow-lg transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl mb-4">{badge.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>
                      <Badge className="bg-[#FFD700] text-black">
                        +{badge.xpReward} XP
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-3">
                        Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Available Badges */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Lock className="h-6 w-6 text-muted-foreground" />
          Available Badges ({next.filter((b) => !b.unlocked).length})
        </h2>
        {isLoading ? (
          <SkeletonLoader variant="card" count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {next
              .filter((b) => !b.unlocked)
              .map(({ badge, progress }, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "opacity-75 hover:opacity-100 transition-opacity",
                    progress > 0 && "border-primary/30"
                  )}>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="text-6xl opacity-50">{badge.icon}</div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-center">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 text-center">{badge.description}</p>
                      
                      {progress > 0 && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{progress}%</span>
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
                      )}

                      <div className="text-center">
                        <Badge variant="outline" className="opacity-50">
                          {badge.xpReward} XP Reward
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

