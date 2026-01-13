"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Share2,
  HeartHandshake,
  Trophy,
  Sparkles,
  ShoppingCart,
  Leaf,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const communityFeatures = [
  {
    icon: Share2,
    title: "Food Sharing Network",
    description:
      "Share surplus food with neighbors, claim leftovers from community members, and reduce waste together. Build a stronger, more connected neighborhood.",
    stats: "12,000+ meals shared",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: ShoppingCart,
    title: "Bulk Buying Groups",
    description:
      "Coordinate group purchases with neighbors to save money and reduce shopping trips. Split costs and share the benefits of buying in bulk.",
    stats: "150+ active groups",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Trophy,
    title: "Community Leaderboard",
    description:
      "Compete with neighbors on waste reduction, food sharing, and sustainability. Earn XP, unlock badges, and climb the community rankings.",
    stats: "5,000+ active participants",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: HeartHandshake,
    title: "Community Events",
    description:
      "Join community kitchen events, volunteer for food distribution, and participate in building-level sustainability initiatives.",
    stats: "50+ events monthly",
    color: "from-orange-500 to-red-500",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Building 5A",
    quote: "The community sharing feature has transformed how we handle excess food. We've saved hundreds of dollars and made new friends!",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Sarah",
  },
  {
    name: "Raj Patel",
    role: "Community Organizer",
    quote: "Coordinating bulk purchases through FoodLink has been a game-changer. We save 30% on groceries and reduce waste significantly.",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Raj",
  },
  {
    name: "Maria Garcia",
    role: "Building Admin",
    quote: "Our building's food waste has dropped by 60% since we started using FoodLink. The community aspect makes it fun and engaging.",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=Maria",
  },
];

export function CommunitySection() {
  return (
    <section id="community" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 mb-6">
            <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Community Powered
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-heading">
            Build a{" "}
            <span className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] bg-clip-text text-transparent">
              Stronger Community
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with neighbors, share resources, and create a sustainable food ecosystem in your
            building and neighborhood.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {communityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/50 relative overflow-hidden">
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 font-heading">{feature.title}</h3>
                        <p className="text-muted-foreground mb-3">{feature.description}</p>
                        <Badge
                          variant="secondary"
                          className={`bg-gradient-to-r ${feature.color} text-white border-0`}
                        >
                          {feature.stats}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 font-heading">
            What Our Community Says
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-8 w-8" />
                <h3 className="text-2xl md:text-3xl font-bold font-heading">
                  Join the FoodLink Community
                </h3>
              </div>
              <p className="text-emerald-50 mb-6 max-w-2xl mx-auto">
                Start sharing, saving, and building connections with your neighbors today. Every
                action contributes to a more sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg"
                  asChild
                >
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 border-2 border-white shadow-lg"
                  asChild
                >
                  <Link href="/community">
                    Explore Community
                    <Users className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
