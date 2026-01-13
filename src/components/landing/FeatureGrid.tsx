"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  BarChart3,
  Users,
  Sprout,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { GamificationBadge } from "./GamificationBadge";

const features = [
  {
    icon: ShoppingBag,
    title: "Smart Urban Shopping Coordination",
    description:
      "Coordinate bulk purchases with neighbors, split costs, and reduce individual shopping trips. Get alerts for group buying opportunities.",
    badge: "Bulk Buyer",
    points: 50,
  },
  {
    icon: BarChart3,
    title: "Family Daily Usage & Waste Tracking",
    description:
      "Track what you buy, what you use, and what goes to waste. Get insights to reduce spoilage and save money with smart inventory management.",
    badge: "Waste Warrior",
    points: 100,
  },
  {
    icon: Users,
    title: "Community Food Sharing Ecosystem",
    description:
      "Share excess food with neighbors, discover community meals, and participate in building-level food exchange programs.",
    badge: "Community Chef",
    points: 75,
  },
  {
    icon: Sprout,
    title: "Circular Composting & Rooftop Farming",
    description:
      "Connect with local composting initiatives and rooftop farming projects. Turn waste into resources and grow fresh produce together.",
    badge: "Green Master",
    points: 150,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-heading">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] bg-clip-text text-transparent">
              Manage Food Smarter
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four powerful modules working together to reduce waste, save money, and build stronger
            communities.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          style={{ perspective: "1000px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  rotateX: 5,
                  rotateY: 5,
                  transition: { duration: 0.3 },
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group relative overflow-hidden border-2 hover:border-primary/50">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <GamificationBadge
                        title={feature.badge}
                        points={feature.points}
                        icon="star"
                        variant="gold"
                      />
                    </div>
                    <CardTitle className="text-xl mb-2 font-heading">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Button variant="ghost" className="group/btn" asChild>
                      <Link href="/register">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
