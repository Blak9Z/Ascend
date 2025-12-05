"use client";

import { Award, Flame, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ProfileOverviewProps = {
  handle: string;
  level: number;
  xp: number;
  streakDays: number;
  badges: { id: string; label: string; tier: string }[];
};

export function ProfileOverview({
  handle,
  level,
  xp,
  streakDays,
  badges,
}: ProfileOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{handle}</CardTitle>
        <CardDescription className="text-sm">
          Operator dashboard for @nouslabs milestone quests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-muted-foreground text-xs uppercase">Level</div>
            <div className="font-semibold text-2xl">{level}</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-muted-foreground text-xs uppercase">XP</div>
            <div className="font-semibold text-2xl">{xp.toLocaleString()}</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-muted-foreground text-xs uppercase">
              Streak
            </div>
            <div className="font-semibold text-2xl">{streakDays}d</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
            <Award className="size-4" /> Badge Shelf
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                className="rounded-full border border-muted border-dashed px-3 py-1 font-medium text-xs"
                key={badge.id}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-2 text-muted-foreground text-xs">
          <div className="inline-flex items-center gap-2">
            <Wallet className="size-4" /> Wallets synced via EasyConnect
          </div>
          <div className="inline-flex items-center gap-2">
            <Flame className="size-4 text-amber-500" /> Weekly streak boosts
            active
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
