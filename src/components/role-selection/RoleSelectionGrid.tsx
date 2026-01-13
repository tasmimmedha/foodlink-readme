"use client";

import { useRouter } from "next/navigation";
import { useRoleStore } from "@/store/role.store";
import { RoleCard, RoleCardProps } from "./RoleCard";
import { Users, Heart, HandHeart, ShoppingBag, UtensilsCrossed } from "lucide-react";

const ROLES: Omit<RoleCardProps, "onClick" | "delay">[] = [
  {
    id: "family",
    title: "Family",
    description: "Manage household food, preferences, and members all in one place",
    icon: Users,
  },
  {
    id: "community-member",
    title: "Community Member",
    description: "Connect with neighbors, share resources, and build community",
    icon: Heart,
  },
  {
    id: "charity-admin",
    title: "Charity / NGO Admin",
    description: "Manage donations, coordinate food distribution, and track impact",
    icon: HandHeart,
  },
  {
    id: "shop-staff",
    title: "Shop / Retail Staff",
    description: "Manage inventory, process orders, and coordinate with customers",
    icon: ShoppingBag,
  },
  {
    id: "restaurant-staff",
    title: "Restaurant / Food Service Staff",
    description: "Manage kitchen inventory, track food waste, and optimize operations",
    icon: UtensilsCrossed,
  },
];

const ROLE_ROUTES: Record<string, string> = {
  family: "/family",
  "community-member": "/community",
  "charity-admin": "/ngo",
  "shop-staff": "/shop",
  "restaurant-staff": "/restaurant",
};

export function RoleSelectionGrid() {
  const router = useRouter();
  const { setRole } = useRoleStore();

  const handleRoleSelect = (roleId: string) => {
    // Set role in store
    setRole(roleId as any);
    
    // Get route for the role
    const route = ROLE_ROUTES[roleId] || "/dashboard";
    
    // Navigate to role-specific dashboard
    router.push(route);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ROLES.map((role, index) => (
        <RoleCard
          key={role.id}
          {...role}
          delay={index * 0.1}
          onClick={() => handleRoleSelect(role.id)}
        />
      ))}
    </div>
  );
}

