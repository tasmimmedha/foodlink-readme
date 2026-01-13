"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";

interface Donation {
  id: string;
  name: string;
  amount: number;
  time: string;
}

const mockDonations: Donation[] = [
  { id: "1", name: "Sarah M.", amount: 25, time: "2m ago" },
  { id: "2", name: "John D.", amount: 50, time: "5m ago" },
  { id: "3", name: "Emma L.", amount: 15, time: "8m ago" },
  { id: "4", name: "Mike T.", amount: 100, time: "12m ago" },
  { id: "5", name: "Lisa K.", amount: 30, time: "15m ago" },
];

export function LiveDonationBox() {
  const [donations, setDonations] = useState<Donation[]>(mockDonations.slice(0, 5));

  useEffect(() => {
    // Simulate new donations appearing
    const interval = setInterval(() => {
      const newDonation: Donation = {
        id: Date.now().toString(),
        name: ["Alex", "Maria", "David", "Sophie", "Tom", "Anna"][Math.floor(Math.random() * 6)] + " " + ["R.", "K.", "M.", "L.", "S."][Math.floor(Math.random() * 5)],
        amount: [10, 15, 20, 25, 30, 50, 100][Math.floor(Math.random() * 7)],
        time: "now",
      };
      setDonations((prev) => [newDonation, ...prev.slice(0, 4)]);
    }, 8000); // New donation every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-8 md:right-12 lg:right-16 xl:right-20 z-40 w-[calc(100vw-2rem)] sm:w-80 md:w-96 lg:w-[28rem] max-w-sm">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-md rounded-lg border border-primary/20 shadow-2xl p-3 sm:p-4"
      >
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary/10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full blur-sm opacity-50 animate-pulse" />
            <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFD700] relative z-10" />
          </div>
          <h3 className="font-bold text-sm sm:text-base md:text-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            Live Donations
          </h3>
        </div>

        <div className="space-y-2 max-h-48 sm:max-h-56 md:max-h-64 overflow-y-auto custom-scrollbar pr-1">
          <AnimatePresence mode="popLayout">
            {donations.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-2 p-2 rounded-md bg-gradient-to-r from-primary/5 to-primary/0 hover:from-primary/10 hover:to-primary/5 transition-all duration-200"
              >
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                    <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-foreground truncate">
                      {donation.name}
                    </span>
                    <span className="font-bold text-xs sm:text-sm bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent whitespace-nowrap">
                      ${donation.amount}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{donation.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

