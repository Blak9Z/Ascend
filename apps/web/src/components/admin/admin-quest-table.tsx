"use client";

import { ArrowUpRightSquare, CheckCircle2, Clock3, Lock } from "lucide-react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminQuestRecord } from "@/data/admin";
import { cn } from "@/lib/utils";

const statusIconMap: Record<
  AdminQuestRecord["status"],
  { icon: ComponentType<{ className?: string }>; tone: string }
> = {
  completed: { icon: CheckCircle2, tone: "text-emerald-500" },
  in_progress: { icon: Clock3, tone: "text-amber-500" },
  locked: { icon: Lock, tone: "text-muted-foreground" },
};

type AdminQuestTableProps = {
  quests: AdminQuestRecord[];
};

export function AdminQuestTable({ quests }: AdminQuestTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-xl">Quest Catalog</CardTitle>
          <CardDescription>
            Manage publish status, owners, and XP rewards before launch.
          </CardDescription>
        </div>
        <Button size="sm">
          <ArrowUpRightSquare className="mr-2 size-4" />
          New Quest
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="hidden gap-4 rounded-lg bg-muted/60 px-4 py-2 font-semibold text-muted-foreground text-xs uppercase lg:grid lg:grid-cols-[1.8fr_1fr_1fr_1fr_auto]">
          <span>Quest</span>
          <span>Category</span>
          <span>Owner</span>
          <span>Status</span>
          <span className="text-right">Updated</span>
        </div>
        <div className="space-y-3">
          {quests.map((quest) => {
            const statusMeta = statusIconMap[quest.status];
            const StatusIcon = statusMeta.icon;
            return (
              <div
                className="rounded-xl border border-muted/70 bg-background/60 px-4 py-3"
                key={quest.id}
              >
                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[1.8fr_1fr_1fr_1fr_auto] lg:items-center">
                  <div>
                    <p className="font-semibold">{quest.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {quest.xp} XP • {quest.badge}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {quest.category}
                  </span>
                  <span className="font-medium text-sm">{quest.owner}</span>
                  <div className="inline-flex items-center gap-2 font-semibold text-sm">
                    <StatusIcon className={cn("size-4", statusMeta.tone)} />
                    <span className={statusMeta.tone}>
                      {quest.status.replace("_", " ")}
                    </span>
                    {quest.published ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600 text-xs">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-600 text-xs">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="text-right text-muted-foreground text-xs">
                    {formatDate(quest.updatedAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
