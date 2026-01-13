"use client";

import {
  useShopStaff,
  useStaffTasks,
  useAddStaffTask,
  useToggleStaffTask,
  useShopShifts,
} from "@/hooks/use-query-shop";
import { StaffTaskCard } from "@/components/shop/StaffTaskCard";
import { StaffShiftCard } from "@/components/shop/StaffShiftCard";
import { StaffModal } from "@/components/shop/StaffModal";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddTaskInput } from "@/lib/server/shop.staff.server";

export default function StaffPage() {
  const { data: staff = [] } = useShopStaff();
  const { data: tasks = [] } = useStaffTasks();
  const { data: shifts = [] } = useShopShifts();
  const addTaskMutation = useAddStaffTask();
  const toggleTaskMutation = useToggleStaffTask();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState<AddTaskInput>({
    title: "",
    description: "",
    assigneeId: "",
    due: new Date().toISOString().slice(0, 10),
    category: "expiry",
    priority: "medium",
  });

  const assignee = staff.find((member) => member.id === selectedStaff);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Staff & shifts</h1>
        <p className="text-sm text-slate-500">
          Assign expiry checks, pricing updates, and donation prep to your team.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {staff.map((member) => (
          <Card
            key={member.id}
            className="cursor-pointer rounded-3xl border-slate-100 bg-white/95 shadow-lg"
            onClick={() => setSelectedStaff(member.id)}
          >
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
              <p className="text-sm text-slate-500">{member.role}</p>
            </CardHeader>
            <CardContent className="text-xs text-slate-400">
              Shift: {member.shift} · {member.contact}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">Task board</h2>
          {tasks.map((task) => (
            <StaffTaskCard
              key={task.id}
              task={task}
              assignee={staff.find((member) => member.id === task.assigneeId)}
              onToggle={(record) => toggleTaskMutation.mutate(record.id)}
            />
          ))}
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">Add new task</h2>
          <form
            className="space-y-3 rounded-3xl border border-slate-100 bg-white/95 p-4 shadow-lg"
            onSubmit={(event) => {
              event.preventDefault();
              addTaskMutation.mutate(taskForm);
            }}
          >
            <Field label="Title">
              <Input
                value={taskForm.title}
                onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
              />
            </Field>
            <Field label="Description">
              <Input
                value={taskForm.description}
                onChange={(event) =>
                  setTaskForm({ ...taskForm, description: event.target.value })
                }
              />
            </Field>
            <Field label="Assignee">
              <select
                className="h-10 w-full rounded-2xl border border-slate-200 px-3 text-sm"
                value={taskForm.assigneeId}
                onChange={(event) =>
                  setTaskForm({ ...taskForm, assigneeId: event.target.value })
                }
              >
                <option value="">Select staff</option>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Due date">
              <Input
                type="date"
                value={taskForm.due}
                onChange={(event) => setTaskForm({ ...taskForm, due: event.target.value })}
              />
            </Field>
            <Button type="submit" className="w-full" disabled={addTaskMutation.isPending}>
              Assign task
            </Button>
          </form>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-800">Shift schedule</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {shifts.map((shift) => (
            <StaffShiftCard
              key={shift.id}
              shift={shift}
              staff={staff.find((member) => member.id === shift.staffId)}
            />
          ))}
        </div>
      </div>

      <StaffModal
        open={Boolean(selectedStaff)}
        staff={assignee}
        tasks={tasks.filter((task) => task.assigneeId === selectedStaff)}
        onClose={() => setSelectedStaff(null)}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-slate-500">{label}</Label>
      {children}
    </div>
  );
}

