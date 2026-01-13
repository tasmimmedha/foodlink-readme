"use client";

import { useEffect, useState } from "react";
import { CommunityLeaderboard } from "@/lib/server/db";
import { getLeaderboard } from "@/lib/server/community.server";
import { LeaderboardTable } from "@/components/community/LeaderboardTable";

export default function CommunityLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<CommunityLeaderboard[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLeaderboard(await getLeaderboard());
  };

  const accentMap: Record<CommunityLeaderboard["type"], string> = {
    "top-sharers": "from-amber-500 to-orange-500",
    "zero-waste": "from-emerald-500 to-lime-500",
    "volunteer-stars": "from-sky-500 to-indigo-500",
    "building-impact": "from-teal-500 to-cyan-500",
    "weekly-xp": "from-fuchsia-500 to-pink-500",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Community Leaderboard</h1>
        <p className="text-gray-500">Live rankings for sharers, volunteers, and impact champions.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {leaderboard.map((board) => (
          <LeaderboardTable
            key={board.id}
            title={formatTitle(board.type)}
            entries={board.entries}
            accent={accentMap[board.type]}
          />
        ))}
      </div>
    </div>
  );
}

function formatTitle(type: CommunityLeaderboard["type"]) {
  switch (type) {
    case "top-sharers":
      return "Top Sharers";
    case "zero-waste":
      return "Zero Waste Champions";
    case "volunteer-stars":
      return "Volunteer Stars";
    case "building-impact":
      return "Building Impact Score";
    case "weekly-xp":
      return "Weekly XP Earners";
    default:
      return type;
  }
}

