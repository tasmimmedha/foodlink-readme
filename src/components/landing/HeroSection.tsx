"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "./AnimatedCounter";
import { GamificationBadge } from "./GamificationBadge";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 sm:pb-20">
      {/* Enhanced Background with Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,rgb(34,197,94)_1px,transparent_0)] [background-size:24px_24px]" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge/Pill Above Heading */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 sm:mb-8 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm animate-fade-in">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              AI-Powered Food Management
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight font-heading animate-fade-in-up">
            A Smarter Way to{" "}
            <span className="block mt-2 bg-gradient-to-r from-[#22c55e] via-[#16a34a] to-[#10b981] bg-clip-text text-transparent animate-gradient">
              Buy, Cook, Share & Save Food
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto text-muted-foreground font-medium leading-relaxed animate-fade-in-up delay-100">
            FoodLink helps families track food, prevent waste, and build community — all in one
            intelligent platform powered by AI.
          </p>

          {/* Gamification Counter - Enhanced */}
          <div className="mb-8 sm:mb-10 animate-fade-in-up delay-200">
            <div className="inline-flex items-center gap-3 sm:gap-4 px-5 sm:px-7 md:px-8 py-3 sm:py-3.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <GamificationBadge title="CO₂ Saved" icon="award" variant="gold" />
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  <AnimatedCounter value={864} suffix="kg" />
                </span>
                <span className="text-sm sm:text-base font-semibold text-muted-foreground">this year</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons - Enhanced */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-12 animate-fade-in-up delay-300">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto group text-base sm:text-lg px-8 sm:px-10 md:px-12 py-6 sm:py-7 bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#22c55e] text-white shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 md:px-12 py-6 sm:py-7 border-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:scale-105 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
              >
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Trust Indicators - Subtle */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm sm:text-base text-muted-foreground animate-fade-in delay-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-300" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-500" />
              <span>Join 5,000+ families</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
