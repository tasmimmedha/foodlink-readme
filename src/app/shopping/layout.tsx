import { DashboardShell } from "@/components/shared/dashboard-shell";

export default function ShoppingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}

