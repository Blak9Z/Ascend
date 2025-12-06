"use client";

import { Disc, Gift, NotepadText, Share, ShieldCheck, Zap } from "lucide-react";
import type { ComponentType } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RewardLedgerEntry } from "@/data/rewards";
import { cn } from "@/lib/utils";

type RewardFeedProps = {
  entries: RewardLedgerEntry[];
};

type ChannelId = RewardLedgerEntry["deliveryChannels"][number];

const channelMeta: Record<
  ChannelId,
  { icon: ComponentType<{ className?: string }>; label: string }
> = {
  discord: { icon: Disc, label: "Discord" },
  notion: { icon: NotepadText, label: "Notion" },
  sheets: { icon: Share, label: "Sheets" },
  zapier: { icon: Zap, label: "Zapier" },
};

export function RewardFeed({ entries }: RewardFeedProps) {
  return (
    <Card>
      <CardHeader className="gap-1">
        <CardTitle className="text-lg">Reward Ledger</CardTitle>
        <CardDescription className="text-sm">
          XP, badges, and streak boosts emitted by the reward worker.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => (
          <FeedRow entry={entry} key={entry.id} />
        ))}
      </CardContent>
    </Card>
  );
}

type FeedRowProps = {
  entry: RewardLedgerEntry;
};

function FeedRow({ entry }: FeedRowProps) {
  const issuedDate = new Date(entry.issuedAt);
  const PrimaryIcon = entry.badge ? ShieldCheck : Gift;

  return (
    <div className="rounded-xl border border-muted/60 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary/10 p-2 text-primary">
            <PrimaryIcon className="size-4" />
          </span>
          <div>
            <p className="font-semibold">{entry.questTitle}</p>
            <p className="text-muted-foreground text-xs">
              Issued to {entry.handle} · {entry.wallet}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          {issuedDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
          <Gift className="size-3.5" /> +{entry.xpDelta.toLocaleString()} XP
        </span>
        {entry.badge ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 font-semibold text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/10 dark:text-amber-200">
            <ShieldCheck className="size-3.5" /> {entry.badge}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-semibold">
          <Zap className="size-3" /> {entry.streakDays} day streak
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {entry.deliveryChannels.map((channel) => {
          const meta = channelMeta[channel];
          const Icon = meta.icon;
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border border-muted px-2.5 py-1 text-xs"
              )}
              key={`${entry.id}-${channel}`}
            >
              <Icon className="size-3.5" /> {meta.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
