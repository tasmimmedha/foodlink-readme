"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  Utensils,
  TrendingDown,
  DollarSign,
  Leaf,
  Heart,
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

const metrics = [
  {
    value: 3,
    label: "Monthly waste prevented",
    description: "kg per household",
    color: "from-green-500 to-emerald-500",
    max: 5,
  },
  {
    value: 12,
    label: "Leftover meals eaten",
    description: "per month",
    color: "from-blue-500 to-cyan-500",
    max: 20,
  },
  {
    value: 40,
    label: "Less spoilage",
    description: "reduction rate",
    color: "from-purple-500 to-pink-500",
    max: 100,
  },
  {
    value: 60,
    label: "Cheaper with bulk-buy",
    description: "cost savings",
    color: "from-orange-500 to-amber-500",
    max: 100,
  },
  {
    value: 864,
    label: "CO₂ prevented",
    description: "kg annually",
    color: "from-green-600 to-teal-600",
    max: 1000,
  },
  {
    value: 6000,
    label: "Meals donated",
    description: "to community",
    color: "from-red-500 to-rose-500",
    max: 10000,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function ImpactMetrics() {
  return (
    <section id="impact" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-heading">
            Real Impact,{" "}
            <span className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] bg-clip-text text-transparent">
              Measured Results
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how FoodFlow users are making a difference in their communities and the
            environment.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {metrics.map((metric, index) => {
            const percentage = (metric.value / metric.max) * 100;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group border-2 hover:border-primary/50 relative overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                      {/* Value */}
                      <div className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading bg-gradient-to-r from-[#22c55e] to-[#16a34a] bg-clip-text text-transparent">
                        <AnimatedCounter
                          value={metric.value}
                          suffix={metric.label.includes("CO₂") ? "kg" : metric.label.includes("%") ? "%" : ""}
                        />
                        {metric.label.includes("Less spoilage") && "%"}
                        {metric.label.includes("Cheaper") && "%"}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full">
                        <div className="w-full h-4 md:h-5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      
                      {/* Label and Description */}
                      <div className="space-y-2">
                        <div className="text-base md:text-lg font-semibold">{metric.label}</div>
                        <div className="text-sm text-muted-foreground">{metric.description}</div>
                      </div>
                    </div>
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
