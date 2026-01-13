"use client";

import { SectionCard } from "@/components/shared/section-card";
import { GlowButton } from "@/components/shared/glow-button";
import { useBulkBuyOpportunities, useJoinBulkBuy } from "@/hooks/use-query-family";
import { Users, TrendingDown, Clock, Loader2 } from "lucide-react";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/helpers";
import { formatDate } from "@/lib/helpers";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export function BulkBuyOpportunities() {
  const { data, isLoading } = useBulkBuyOpportunities();
  const joinMutation = useJoinBulkBuy();
  const [joiningId, setJoiningId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <SectionCard title="Bulk Buy Opportunities">
        <SkeletonLoader variant="card" count={2} />
      </SectionCard>
    );
  }

  const opportunities = data || [];

  return (
    <SectionCard
      title="Bulk Buy Opportunities"
      description="Save money by buying in bulk with neighbors"
    >
      <div className="space-y-3">
        {opportunities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No bulk buy opportunities available at the moment.
          </div>
        ) : (
          opportunities.slice(0, 3).map((opp, index) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
               <Card className="p-4 bg-[#f9fafb] border-green-200/50 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{opp.itemName}</h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Save {opp.savingsPercentage}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(opp.deadline)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">Current Price</div>
                  <div className="text-sm font-medium line-through text-muted-foreground">
                    {formatCurrency(opp.currentPrice)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Bulk Price</div>
                  <div className="text-lg font-bold text-green-700">
                    {formatCurrency(opp.bulkPrice)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-green-200/50">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {opp.participants}/{opp.maxParticipants} participants
                  </span>
                </div>
                <div className="text-xs font-semibold text-green-700">
                  Save {formatCurrency(opp.savings)}
                </div>
              </div>

              {/* Participants Preview */}
              {opp.participantsPreview.length > 0 && (
                <div className="mt-3 pt-3 border-t border-green-200/50">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {opp.participantsPreview.slice(0, 3).map((participant, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                        >
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    {opp.participantsPreview.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{opp.participantsPreview.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <GlowButton 
                className="w-full mt-3" 
                size="sm"
                onClick={async () => {
                  if (opp.participants >= opp.maxParticipants) {
                    toast({
                      title: "Full",
                      description: "This bulk buy opportunity is already full.",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  setJoiningId(opp.id);
                  try {
                    const result = await joinMutation.mutateAsync(opp.id);
                    if (result.success) {
                      toast({
                        title: "Success!",
                        description: result.message,
                      });
                    } else {
                      toast({
                        title: "Already Joined",
                        description: result.message,
                        variant: "default",
                      });
                    }
                  } catch (error) {
                    console.error("Error joining bulk buy:", error);
                    toast({
                      title: "Error",
                      description: "Failed to join bulk buy. Please try again.",
                      variant: "destructive",
                    });
                  } finally {
                    setJoiningId(null);
                  }
                }}
                disabled={joinMutation.isPending || joiningId === opp.id}
              >
                {joinMutation.isPending && joiningId === opp.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Bulk Buy"
                )}
              </GlowButton>
              </Card>
            </motion.div>
          ))
        )}

        {opportunities.length > 3 && (
          <div className="text-center pt-2">
            <Link href="/family/bulk-buy">
            <Button variant="link" className="text-sm">
              View all {opportunities.length} opportunities
            </Button>
            </Link>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

