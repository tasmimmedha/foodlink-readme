"use client";

import { ShopShift, ShopStaffMember } from "@/lib/server";
import { motion } from "framer-motion";
import { Clock4, MapPinned } from "lucide-react";

interface StaffShiftCardProps {
  shift: ShopShift;
  staff?: ShopStaffMember;
}

export function StaffShiftCard({ shift, staff }: StaffShiftCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-lg"
    >
      <p className="text-sm font-semibold text-slate-800">{staff?.name ?? "Team member"}</p>
      <p className="text-xs text-slate-500">{staff?.role}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <Clock4 className="h-4 w-4 text-emerald-500" />
        {shift.day} · {shift.startTime} – {shift.endTime}
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
        <MapPinned className="h-4 w-4 text-indigo-500" />
        Station: {shift.station}
      </div>
      {shift.notes && <p className="mt-2 text-xs text-slate-400">{shift.notes}</p>}
    </motion.div>
  );
}

