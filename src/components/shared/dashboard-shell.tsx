"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { cn } from "@/lib/helpers";

interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className={cn("flex-1 p-6 lg:p-8 lg:ml-64", className)}>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

