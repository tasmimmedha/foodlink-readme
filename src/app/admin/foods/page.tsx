"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import {
  useFoodItems,
  useCategories,
  useCreateFoodItem,
  useUpdateFoodItem,
  useDeleteFoodItem,
} from "@/hooks/use-query-admin";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { ModuleSectionHeader } from "@/components/shared/module-section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function AdminFoodsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const { toast } = useToast();
  const { data: foodItems, isLoading } = useFoodItems({
    search: search || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  });
  const { data: categories } = useCategories();
  const createMutation = useCreateFoodItem();
  const updateMutation = useUpdateFoodItem();
  const deleteMutation = useDeleteFoodItem();

  const filteredItems = foodItems || [];

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      typicalExpiryDays: parseInt(formData.get("typicalExpiryDays") as string),
      storageTips: formData.get("storageTips") as string,
    };

    try {
      await createMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Food item created successfully",
      });
      setIsCreateDialogOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create food item",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      typicalExpiryDays: parseInt(formData.get("typicalExpiryDays") as string),
      storageTips: formData.get("storageTips") as string,
    };

    try {
      await updateMutation.mutateAsync({ id: editingItem.id, data });
      toast({
        title: "Success",
        description: "Food item updated successfully",
      });
      setEditingItem(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update food item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteMutation.mutateAsync(itemToDelete.id);
      toast({
        title: "Success",
        description: "Food item deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete food item",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Food Items Management
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-2xl">
          Manage the food catalog, categories, and expiry information
        </p>
      </div>

      <ModuleSectionHeader
        title="All Food Items"
        description="Search and filter food items in the catalog"
        action={{
          label: "Add Food Item",
          onClick: () => setIsCreateDialogOpen(true),
        }}
      >
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search food items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-[250px]"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ModuleSectionHeader>

      {/* Food Items Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-2xl border-2 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            {isLoading ? (
              <SkeletonLoader variant="table" count={5} />
            ) : filteredItems.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No food items found"
                description="Try adjusting your search or filters"
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Expiry Days</TableHead>
                      <TableHead>Storage Tips</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-accent/50 transition-colors">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-secondary rounded-md text-sm">
                            {item.category}
                          </span>
                        </TableCell>
                        <TableCell>{item.typicalExpiryDays} days</TableCell>
                        <TableCell className="max-w-md truncate">
                          {item.storageTips || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingItem(item)}
                              className="hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setItemToDelete(item);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Create Food Item</DialogTitle>
              <DialogDescription>Add a new food item to the catalog</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="typicalExpiryDays">Typical Expiry Days *</Label>
                <Input
                  id="typicalExpiryDays"
                  name="typicalExpiryDays"
                  type="number"
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="storageTips">Storage Tips</Label>
                <Textarea id="storageTips" name="storageTips" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Edit Food Item</DialogTitle>
                <DialogDescription>Update food item information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingItem.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select name="category" defaultValue={editingItem.category} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-expiry">Typical Expiry Days *</Label>
                  <Input
                    id="edit-expiry"
                    name="typicalExpiryDays"
                    type="number"
                    min="1"
                    defaultValue={editingItem.typicalExpiryDays}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tips">Storage Tips</Label>
                  <Textarea
                    id="edit-tips"
                    name="storageTips"
                    rows={3}
                    defaultValue={editingItem.storageTips}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Food Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

