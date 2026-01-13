"use client";

import { LandingNavbar } from "@/components/landing/Navbar";
import dynamic from "next/dynamic";

// Lazy load HeroSection with SSR disabled to prevent hydration mismatches with animations
const HeroSection = dynamic(
  () => import("@/components/landing/HeroSection").then((mod) => {
    if (!mod?.HeroSection) {
      throw new Error("HeroSection component not found");
    }
    return { default: mod.HeroSection };
  }),
  {
    loading: () => <div className="min-h-[80vh] sm:min-h-screen" />,
    ssr: false,
  }
);

// Lazy load FeatureGrid with SSR disabled to prevent hydration mismatches
const FeatureGrid = dynamic(
  () => import("@/components/landing/FeatureGrid").then((mod) => {
    if (!mod?.FeatureGrid) {
      throw new Error("FeatureGrid component not found");
    }
    return { default: mod.FeatureGrid };
  }),
  {
    loading: () => <div className="min-h-[600px]" />,
    ssr: false,
  }
);

// Lazy load below-the-fold components with SSR disabled for better performance
const HowItWorks = dynamic(
  () => import("@/components/landing/HowItWorks").then((mod) => {
    if (!mod?.HowItWorks) {
      throw new Error("HowItWorks component not found");
    }
    return { default: mod.HowItWorks };
  }),
  {
    loading: () => <div className="min-h-[600px]" />,
    ssr: false,
  }
);

const CommunitySection = dynamic(
  () => import("@/components/landing/CommunitySection").then((mod) => {
    if (!mod?.CommunitySection) {
      throw new Error("CommunitySection component not found");
    }
    return { default: mod.CommunitySection };
  }),
  {
    loading: () => <div className="min-h-[600px]" />,
    ssr: false,
  }
);

const FinalCTA = dynamic(
  () => import("@/components/landing/FinalCTA").then((mod) => {
    if (!mod?.FinalCTA) {
      throw new Error("FinalCTA component not found");
    }
    return { default: mod.FinalCTA };
  }),
  {
    loading: () => <div className="min-h-[400px]" />,
    ssr: false,
  }
);

const LandingFooter = dynamic(
  () => import("@/components/landing/Footer").then((mod) => {
    if (!mod?.LandingFooter) {
      throw new Error("LandingFooter component not found");
    }
    return { default: mod.LandingFooter };
  }),
  {
    loading: () => <div className="min-h-[200px]" />,
    ssr: false,
  }
);

export default function PublicPage() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <HeroSection />
        {/* Below-the-fold content - loaded progressively via dynamic imports */}
        <FeatureGrid />
        <HowItWorks />
        <CommunitySection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
