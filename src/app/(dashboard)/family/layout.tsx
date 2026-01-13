"use client";

import { FamilySidebar } from "@/components/family/FamilySidebar";
import { FamilyNavbar } from "@/components/family/FamilyNavbar";
import { cn } from "@/lib/helpers";
import { ReactNode } from "react";

export default function FamilyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-emerald-25 to-white dark:from-gray-950 dark:via-gray-930 dark:to-gray-900">
      <FamilyNavbar />
      <div className="flex flex-1">
        <FamilySidebar />
        <main className={cn("flex-1 p-3 sm:p-4 md:p-6 lg:p-8 lg:ml-64 transition-all duration-300 w-full max-w-full overflow-x-hidden")}>
          {children}
        </main>
      </div>
    </div>
  );
}

