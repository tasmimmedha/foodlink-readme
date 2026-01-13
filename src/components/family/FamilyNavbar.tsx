"use client";

import { Trophy, Settings, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/user.store";
import { motion } from "framer-motion";
import { useEnvironmentalImpact } from "@/hooks/use-query-family";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function FamilyNavbar() {
  const { user, logout } = useUserStore();
  const router = useRouter();
  const { data: impact } = useEnvironmentalImpact();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const xpProgress = impact?.xpProgress || 0;
  const level = impact?.level || 1;
  const xpPoints = impact?.xpPoints || 0;

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="flex h-16 items-center px-3 sm:px-4 lg:px-8">
        <Link href="/" className="flex flex-col gap-0.5 group">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                FoodFlow
            </span>
            <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground group-hover:text-primary transition-colors">
              family
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
              <Trophy className="h-4 w-4 text-emerald-500" />
              {level > 1 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"
                />
              )}
            </div>
            <div className="flex flex-col min-w-[140px]">
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                <span className="text-muted-foreground font-semibold">Level {level}</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 bg-emerald-500/10 text-emerald-600 border-0">
                  {xpPoints} XP
                </Badge>
              </div>
              <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-50 transition-colors p-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm ring-2 ring-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
              <DropdownMenuLabel>
                <div className="flex items-center gap-3 py-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col space-y-0.5 min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none truncate">{user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email || ""}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="focus:bg-emerald-50 focus:text-emerald-600">
                <Link href="/family/settings" className="flex items-center cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-emerald-50 focus:text-emerald-600">
                <Link href="/family/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

