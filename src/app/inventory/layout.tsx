import { DashboardShell } from "@/components/shared/dashboard-shell";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}

