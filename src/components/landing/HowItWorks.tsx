"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Home, Heart, ArrowRight } from "lucide-react";
import { GamificationBadge } from "./GamificationBadge";

const steps = [
  {
    number: "01",
    icon: Receipt,
    title: "Capture Food Purchases",
    description:
      "Scan receipts, use barcode scanning, or manually input items. Our OCR technology automatically extracts product details and adds them to your inventory.",
    badge: "Scanner Pro",
    points: 25,
  },
  {
    number: "02",
    icon: Home,
    title: "Use Smarter at Home",
    description:
      "Track inventory in real-time, get expiry alerts, plan meals based on what you have, and manage leftovers efficiently to reduce waste.",
    badge: "Meal Master",
    points: 50,
  },
  {
    number: "03",
    icon: Heart,
    title: "Share & Give Back",
    description:
      "Post excess food on the community feed, join bulk buying groups, donate to neighbors, and participate in building-level food sharing programs.",
    badge: "Community Hero",
    points: 100,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-heading">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform how you manage food and reduce waste.
          </p>
        </motion.div>

        <div className="relative" style={{ perspective: "1200px" }}>
          {/* Connection Lines - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{
                    y: -15,
                    rotateX: 5,
                    rotateY: index === 1 ? 0 : index === 0 ? 5 : -5,
                    transition: { duration: 0.3 },
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative"
                >
                  <Card className="h-full text-center hover:shadow-2xl transition-all duration-300 group border-2 hover:border-primary/50 relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl" />
                    
                    <CardHeader className="relative z-10">
                      <div className="flex items-center justify-center mb-4">
                        <motion.div
                          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center relative shadow-lg group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-10 w-10 text-white" />
                          <span className="absolute -top-3 -right-3 text-3xl font-bold text-muted-foreground/20 font-heading">
                            {step.number}
                          </span>
                        </motion.div>
                      </div>
                      <div className="flex justify-center mb-2">
                        <GamificationBadge
                          title={step.badge}
                          points={step.points}
                          icon="star"
                          variant="gold"
                        />
                      </div>
                      <CardTitle className="text-xl mb-2 font-heading">{step.title}</CardTitle>
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Arrow - Desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                      <motion.div
                        animate={{
                          x: [0, 8, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="h-8 w-8 text-primary drop-shadow-lg" />
                      </motion.div>
                    </div>
                  )}

                  {/* Arrow - Mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-6">
                      <motion.div
                        animate={{
                          y: [0, 8, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="h-8 w-8 text-primary rotate-90 drop-shadow-lg" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
