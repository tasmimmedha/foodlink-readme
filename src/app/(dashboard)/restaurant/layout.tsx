"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUIStore } from "@/store/ui.store";
import { useUserStore } from "@/store/user.store";
import { cn } from "@/lib/helpers";
import { ensureRestaurantSeeded } from "@/lib/server/restaurant.seed";
import {
  LayoutDashboard,
  Package,
  Utensils,
  Leaf,
  HeartHandshake,
  Activity,
  Settings,
  Menu,
  LogOut,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/restaurant", label: "Dashboard", icon: LayoutDashboard },
  { href: "/restaurant/inventory", label: "Inventory", icon: Package },
  { href: "/restaurant/menu-analysis", label: "Menu Analysis", icon: Utensils },
  { href: "/restaurant/surplus", label: "Surplus", icon: Leaf },
  { href: "/restaurant/donation-history", label: "Donation History", icon: HeartHandshake },
  { href: "/restaurant/analytics", label: "Analytics", icon: Activity },
  { href: "/restaurant/preferences", label: "Preferences", icon: Settings },
] as const;

export default function RestaurantLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    ensureRestaurantSeeded().catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 dark:from-gray-950 dark:via-gray-930 dark:to-gray-900">
      <RestaurantTopNav />
      <div className="flex">
        <RestaurantSidebar />
        <main className="flex-1 mt-20 lg:ml-72 px-3 sm:px-4 md:px-6 lg:px-10 pb-12 pt-4 sm:pt-6 w-full max-w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

function RestaurantSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
        aria-label="Open restaurant menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <aside
        className={cn(
          "fixed top-20 left-0 z-30 h-[calc(100vh-5rem)] w-72 border-r border-emerald-100/60 bg-white/85 dark:bg-gray-950/90 backdrop-blur-xl shadow-2xl transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              mounted &&
              pathname &&
              (item.href === "/restaurant" ? pathname === "/restaurant" : pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30"
                )}
                onClick={() => {
                  if (mounted && typeof window !== "undefined" && window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function RestaurantTopNav() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const xp = useMemo(() => ({ current: 420, next: 500, level: 5 }), []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="flex h-20 items-center px-4 lg:px-8">
        <Link href="/" className="flex flex-col gap-0.5 group">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              FoodFlow
            </span>
            <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground group-hover:text-primary transition-colors">
              restaurant
            </span>
          </motion.div>
        </Link>
        <div className="flex items-center gap-4 ml-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-emerald-200/50 hover:border-emerald-300/70 transition-colors shadow-sm"
          >
            <div className="relative">
              <Activity className="h-4 w-4 text-emerald-500" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"
              />
            </div>
            <div className="flex flex-col min-w-[150px]">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-gray-500">Level {xp.level}</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-emerald-500/10 text-emerald-600 border-0">
                  {xp.current} XP
                </Badge>
              </div>
              <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp.current / xp.next) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-50 p-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm ring-2 ring-white">
                  {user?.name?.[0]?.toUpperCase() ?? "R"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
              <DropdownMenuLabel>
                <div className="flex items-center gap-3 py-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.[0]?.toUpperCase() ?? "R"}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">{user?.name ?? "Restaurant Lead"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="focus:bg-emerald-50 focus:text-emerald-600">
                <Link href="/restaurant/preferences" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

