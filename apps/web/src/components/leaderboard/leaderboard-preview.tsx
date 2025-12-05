"use client";

import { Trophy } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LeaderboardEntry = {
  rank: number;
  handle: string;
  xp: number;
  questsCompleted: number;
  streakDays: number;
};

type LeaderboardPreviewProps = {
  entries: LeaderboardEntry[];
};

export function LeaderboardPreview({ entries }: LeaderboardPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Leaderboard</CardTitle>
            <CardDescription>Bi-weekly sprint snapshot.</CardDescription>
          </div>
          <Trophy className="size-6 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y text-sm">
          {entries.map((entry) => (
            <div
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3"
              key={entry.rank}
            >
              <span className="font-semibold text-muted-foreground text-xs">
                #{entry.rank.toString().padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold">{entry.handle}</p>
                <p className="text-muted-foreground text-xs">
                  {entry.questsCompleted} quests / {entry.streakDays}d streak
                </p>
              </div>
              <span className="font-bold font-mono text-base">
                {entry.xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
