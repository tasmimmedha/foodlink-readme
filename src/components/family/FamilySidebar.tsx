"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Calendar,
  ShoppingCart,
  BarChart3,
  Leaf,
  Settings,
  History,
  Trophy,
  Menu,
  X,
  UserCog,
  Apple,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers";
import { useUIStore } from "@/store/ui.store";
import { useState, useEffect } from "react";

// Define navigation outside component to ensure stability
// Using explicit icon mapping to prevent hydration issues
const NAVIGATION_ITEMS = [
  { id: "dashboard", name: "Dashboard", href: "/family", icon: "LayoutDashboard" },
  { id: "inventory", name: "Inventory", href: "/family/inventory", icon: "Package" },
  { id: "meal-planner", name: "Meal Planner", href: "/family/meal-planner", icon: "Calendar" },
  { id: "shopping-list", name: "Shopping List", href: "/family/shopping-list", icon: "ShoppingCart" },
  { id: "nutrition", name: "Nutrition", href: "/family/nutrition", icon: "Apple" },
  { id: "analytics", name: "Analytics", href: "/family/analytics", icon: "BarChart3" },
  { id: "impact", name: "Impact", href: "/family/impact", icon: "Leaf" },
  { id: "preferences", name: "Preferences", href: "/family/preferences", icon: "Settings" },
  { id: "logs", name: "Logs", href: "/family/logs", icon: "History" },
  { id: "badges", name: "Badges", href: "/family/badges", icon: "Trophy" },
  { id: "settings", name: "Settings", href: "/family/settings", icon: "UserCog" },
] as const;

// Icon mapping for stable references
const ICON_MAP = {
  LayoutDashboard,
  Package,
  Calendar,
  ShoppingCart,
  Apple,
  BarChart3,
  Leaf,
  Settings,
  History,
  Trophy,
  UserCog,
} as const;

export function FamilySidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [mounted, setMounted] = useState(false);

  // Only set mounted after client-side hydration to avoid mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper function to check if a path is active
  // Always return false during SSR (when mounted is false) to ensure consistent rendering
  const getIsActive = (href: string): boolean => {
    // During SSR and initial render, always return false to match server
    if (!mounted || !pathname) return false;
    
    if (href === "/family") {
      // For root, only match exact path or /family/ (but not /family/something)
      return pathname === "/family" || pathname === "/family/";
    }
    // For other paths, match exact or starts with path + "/"
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 border-r border-emerald-100/60 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-2xl transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-emerald-100/70 lg:hidden">
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block">
              FoodFlow
            </span>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">family</p>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = getIsActive(item.href);
            const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  if (mounted && typeof window !== "undefined" && window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30"
                )}
              >
                {IconComponent && <IconComponent className="h-5 w-5 shrink-0" aria-hidden="true" />}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-30 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
}

