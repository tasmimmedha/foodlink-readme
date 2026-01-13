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
import { Search, Edit, Trash2, Users as UsersIcon, RefreshCw } from "lucide-react";
import {
  useUsers,
  useUsersWithStats,
  useUpdateUser,
  useDeleteUser,
  useResetUserData,
} from "@/hooks/use-query-admin";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { ModuleSectionHeader } from "@/components/shared/module-section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [userToAction, setUserToAction] = useState<any>(null);

  const { toast } = useToast();
  const { data: users, isLoading } = useUsers({ search: search || undefined });
  const { data: usersWithStats } = useUsersWithStats();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const resetMutation = useResetUserData();

  const getUserStats = (userId: string) => {
    return usersWithStats?.find((u) => u.id === userId);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };

    try {
      await updateMutation.mutateAsync({ id: editingUser.id, data });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      setEditingUser(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!userToAction) return;

    try {
      await deleteMutation.mutateAsync(userToAction.id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setUserToAction(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleReset = async () => {
    if (!userToAction) return;

    try {
      await resetMutation.mutateAsync(userToAction.id);
      toast({
        title: "Success",
        description: "User data reset successfully",
      });
      setIsResetDialogOpen(false);
      setUserToAction(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset user data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-2xl">
          Manage users, view statistics, and perform administrative actions
        </p>
      </div>

      <ModuleSectionHeader
        title="All Users"
        description="Search and manage platform users"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-[300px]"
          />
        </div>
      </ModuleSectionHeader>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-2xl border-2 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            {isLoading ? (
              <SkeletonLoader variant="table" count={5} />
            ) : !users || users.length === 0 ? (
              <EmptyState
                icon={UsersIcon}
                title="No users found"
                description="Try adjusting your search criteria"
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Logs</TableHead>
                      <TableHead>XP Level</TableHead>
                      <TableHead>Waste Prevented</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const stats = getUserStats(user.id);
                      return (
                        <TableRow key={user.id} className="hover:bg-accent/50 transition-colors">
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{stats?.stats.inventoryCount || 0}</TableCell>
                          <TableCell>{stats?.stats.consumptionLogsCount || 0}</TableCell>
                          <TableCell>Level {stats?.stats.xpLevel || 0}</TableCell>
                          <TableCell>{stats?.stats.wastePrevented.toFixed(1)} kg</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingUser(user)}
                                className="hover:bg-primary/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setUserToAction(user);
                                  setIsResetDialogOpen(true);
                                }}
                                className="hover:bg-blue-50 dark:hover:bg-blue-950/30"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setUserToAction(user);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <form onSubmit={handleUpdate}>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>Update user information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editingUser.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={editingUser.email}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
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
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{userToAction?.name}"? This will permanently
              delete the user and all associated data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Data</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all data for user "{userToAction?.name}"? This will
              clear all inventory, logs, meal plans, and other user data, but keep the account
              active.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? "Resetting..." : "Reset Data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

