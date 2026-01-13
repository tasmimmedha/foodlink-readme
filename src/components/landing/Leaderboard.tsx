"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { GamificationBadge } from "./GamificationBadge";

const leaderboard = [
  { rank: 1, name: "Sarah Chen", points: 2450, badge: "Waste Warrior", icon: Trophy },
  { rank: 2, name: "Raj Patel", points: 2180, badge: "Community Chef", icon: Medal },
  { rank: 3, name: "Maria Garcia", points: 1950, badge: "Green Master", icon: Award },
  { rank: 4, name: "David Kim", points: 1820, badge: "Bulk Buyer", icon: Award },
  { rank: 5, name: "Emma Wilson", points: 1650, badge: "Meal Master", icon: Award },
];

export function Leaderboard() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-heading">
            Top Sharers in{" "}
            <span className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] bg-clip-text text-transparent">
              Your City
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the leaderboard and compete with your neighbors to reduce waste and build community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-2 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-heading flex items-center gap-2">
                <Trophy className="h-6 w-6 text-[#FFD700]" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => {
                  const Icon = entry.icon;
                  return (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ x: 10, scale: 1.02 }}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-muted/50 to-transparent hover:from-muted hover:to-muted/50 transition-all duration-300 border border-transparent hover:border-primary/20"
                    >
                      <div className="flex-shrink-0">
                        {entry.rank <= 3 ? (
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              entry.rank === 1
                                ? "bg-gradient-to-br from-[#FFD700] to-[#FFA500]"
                                : entry.rank === 2
                                  ? "bg-gradient-to-br from-gray-300 to-gray-400"
                                  : "bg-gradient-to-br from-[#CD7F32] to-[#8B4513]"
                            } shadow-lg`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-muted border-2 border-primary/20">
                            <span className="text-lg font-bold text-muted-foreground">
                              {entry.rank}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{entry.name}</span>
                          <GamificationBadge
                            title={entry.badge}
                            icon="star"
                            variant={entry.rank === 1 ? "gold" : "default"}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Points:</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {entry.points.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  Join FoodFlow to start earning points and climb the leaderboard!
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

