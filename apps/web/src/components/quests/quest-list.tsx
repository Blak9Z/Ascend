"use client";

import { CheckCircle2, Clock3, Lock, Sparkles, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Quest } from "./types";

const statusConfig: Record<Quest["status"], { label: string; tone: string }> = {
  locked: { label: "Locked", tone: "text-muted-foreground" },
  in_progress: { label: "In Progress", tone: "text-amber-500" },
  completed: { label: "Completed", tone: "text-emerald-500" },
};

type QuestListProps = {
  quests: Quest[];
  activeQuestId?: string;
  onSelect: (quest: Quest) => void;
};

export function QuestList({ quests, activeQuestId, onSelect }: QuestListProps) {
  return (
    <div className="space-y-3">
      {quests.map((quest) => {
        const status = statusConfig[quest.status];
        let statusIcon = <Sparkles className="size-4" />;

        if (quest.status === "completed") {
          statusIcon = <CheckCircle2 className="size-4" />;
        } else if (quest.status === "locked") {
          statusIcon = <Lock className="size-4" />;
        }

        return (
          <Card
            className={cn(
              "border-muted/60 transition hover:border-primary/50",
              quest.id === activeQuestId && "border-primary shadow-md"
            )}
            key={quest.id}
          >
            <CardHeader className="gap-3 sm:flex sm:items-center sm:justify-between">
              <div>
                <CardTitle className="font-semibold text-base">
                  {quest.title}
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2 font-medium text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Sparkles className="size-3" /> {quest.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-primary">
                    <Target className="size-3" /> {quest.xp} XP
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="size-3" /> ~{quest.estimatedMinutes}m
                  </span>
                </CardDescription>
              </div>
              <div className="text-right font-semibold text-xs uppercase tracking-wide">
                <span className={status.tone}>{status.label}</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-muted-foreground text-sm">{quest.summary}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between font-semibold text-xs">
                  <span>Progress</span>
                  <span>{quest.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      quest.status === "completed"
                        ? "bg-emerald-500"
                        : "bg-primary"
                    )}
                    style={{ width: `${quest.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>{quest.badge}</span>
                <span className="uppercase tracking-wide">
                  {quest.difficulty}
                </span>
              </div>
              <Button
                className="justify-between"
                onClick={() => onSelect(quest)}
                size="sm"
                variant={quest.id === activeQuestId ? "default" : "outline"}
              >
                {quest.id === activeQuestId ? "Viewing" : "View Details"}
                {statusIcon}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
