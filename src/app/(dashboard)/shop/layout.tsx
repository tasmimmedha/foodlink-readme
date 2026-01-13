"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/helpers";
import {
  LayoutDashboard,
  Boxes,
  AlertTriangle,
  Truck,
  LineChart,
  FileText,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/store/ui.store";
import { useUserStore } from "@/store/user.store";
import { ensureShopSeedData } from "@/lib/server/shop.seed";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/shop", icon: LayoutDashboard },
  { label: "Inventory", href: "/shop/inventory", icon: Boxes },
  { label: "Expiry Alerts", href: "/shop/expiry-alerts", icon: AlertTriangle },
  { label: "Surplus", href: "/shop/surplus", icon: Truck },
  { label: "Analytics", href: "/shop/analytics", icon: LineChart },
  { label: "Reports", href: "/shop/reports", icon: FileText },
  { label: "Profile", href: "/shop/profile", icon: Settings },
];

export default function ShopLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    ensureShopSeedData().catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <ShopTopNav />
      <div className="flex">
        <ShopSidebar />
        <main className="flex-1 mt-20 lg:ml-72 px-3 sm:px-4 md:px-6 lg:px-10 pb-12 pt-4 sm:pt-6 w-full max-w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

function ShopSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={toggleSidebar}
        aria-label="Open retail menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-72 border-r border-emerald-100/80 bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 dark:border-emerald-900/40 dark:bg-slate-950/90",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-20 flex items-center px-6 border-b border-emerald-100/70 dark:border-emerald-900/30">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent block">
              FoodFlow
            </span>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">retail</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              mounted &&
              pathname &&
              (item.href === "/shop" ? pathname === "/shop" : pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold text-sm transition-all",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/80 dark:text-gray-300 dark:hover:bg-emerald-950/30"
                )}
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
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

function ShopTopNav() {
  const { toggleSidebar } = useUIStore();
  const { user } = useUserStore();
  const retailPulse = useMemo(
    () => ({
      label: "Waste diversion",
      progress: 0.72,
      delta: "+12% this week",
    }),
    []
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-emerald-100/50 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="flex h-20 items-stretch">
        {/* Left: Logo section */}
        <div className="flex items-center gap-3 px-6 lg:px-8 border-r border-emerald-200/50">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex flex-col gap-0.5 group">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                FoodFlow
              </span>
              <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground group-hover:text-primary transition-colors">
                retail
              </span>
            </motion.div>
          </Link>
        </div>

        {/* Center: Empty space */}
        <div className="flex-1 bg-white"></div>

        {/* Right: Stats and actions */}
        <div className="flex items-center gap-4 px-6 lg:px-8 bg-white border-l border-emerald-100/50">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden xl:flex flex-col gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-2.5 shadow-sm min-w-[180px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700">{retailPulse.label}</span>
              <Badge variant="secondary" className="bg-white/80 text-emerald-600 border-0 text-xs px-2 py-0">
                {retailPulse.delta}
              </Badge>
            </div>
            <div className="h-2 rounded-full bg-white/80 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                initial={{ width: 0 }}
                animate={{ width: `${retailPulse.progress * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
          
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-emerald-50 p-0">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm ring-2 ring-white">
                    {user?.name?.[0]?.toUpperCase() ?? "S"}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.[0]?.toUpperCase() ?? "S"}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">{user?.name ?? "Store Manager"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email ?? "retail@foodflow.app"}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="focus:bg-emerald-50 focus:text-emerald-600">
                  <Link href="/shop/profile" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Store settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-emerald-50 focus:text-emerald-600">
                  <Link href="/shop/reports" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Reports
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}


