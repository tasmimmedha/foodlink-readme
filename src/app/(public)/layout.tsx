import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FoodFlow - Smart Food Management",
  description: "Manage your food inventory, reduce waste, and connect with your community",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

