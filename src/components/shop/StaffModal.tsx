"use client";

import { ShopStaffMember, ShopStaffTask } from "@/lib/server";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface StaffModalProps {
  open: boolean;
  staff?: ShopStaffMember | null;
  tasks?: ShopStaffTask[];
  onClose: () => void;
}

export function StaffModal({ open, staff, tasks = [], onClose }: StaffModalProps) {
  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-3xl bg-white/95 p-0 shadow-2xl dark:bg-slate-900/95">
        <DialogHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <DialogTitle>{staff.name}</DialogTitle>
          <DialogDescription>{staff.role}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-6 py-5 text-sm text-slate-600">
          <p>Shift: {staff.shift}</p>
          <p>Contact: {staff.contact}</p>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Responsibilities</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {staff.responsibilities.map((item) => (
                <Badge key={item} variant="secondary" className="rounded-full">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Open tasks</p>
            <ul className="mt-2 space-y-1">
              {tasks.length === 0 && <li className="text-xs text-slate-400">No tasks assigned</li>}
              {tasks.map((task) => (
                <li key={task.id} className="rounded-2xl border border-slate-100 px-3 py-2">
                  <p className="font-semibold text-slate-700">{task.title}</p>
                  <p className="text-xs text-slate-400">Due {new Date(task.due).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

