"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpiryStatusBadge } from "./expiry-status-badge";
import { formatDate } from "@/lib/helpers";

interface InventoryItemCardProps {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
  category?: string;
  location?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function InventoryItemCard({
  id,
  name,
  quantity,
  unit,
  expiryDate,
  category,
  location,
  onEdit,
  onDelete,
}: InventoryItemCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            {category && <Badge variant="secondary">{category}</Badge>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Quantity:</span>
          <span className="font-medium">
            {quantity} {unit || ""}
          </span>
        </div>
        {expiryDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Expires:</span>
            <div className="flex items-center gap-2">
              <span>{formatDate(expiryDate)}</span>
              <ExpiryStatusBadge expiryDate={expiryDate} />
            </div>
          </div>
        )}
        {location && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">{location}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

