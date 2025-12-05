"use client";

import { ArrowUpRight, CheckCircle2, Circle, TimerReset } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Quest } from "./types";

type QuestDetailProps = {
  quest: Quest;
};

export function QuestDetail({ quest }: QuestDetailProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-col gap-2">
        <div className="text-primary text-xs uppercase tracking-wide">
          Featured Quest
        </div>
        <CardTitle className="font-semibold text-2xl">{quest.title}</CardTitle>
        <CardDescription className="text-base">{quest.summary}</CardDescription>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            <ArrowUpRight className="size-4" /> {quest.xp} XP
          </span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <TimerReset className="size-4" /> ~{quest.estimatedMinutes} min
            sprint
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-xs uppercase tracking-wide">
            {quest.difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold text-muted-foreground text-sm">Steps</p>
          <div className="mt-2 space-y-2">
            {quest.steps.map((step) => (
              <div
                className="flex items-start gap-3 rounded-lg border border-muted/60 border-dashed p-3"
                key={step.id}
              >
                {step.status === "done" ? (
                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-500" />
                ) : (
                  <Circle className="mt-0.5 size-4 text-muted-foreground" />
                )}
                <div className="space-y-1">
                  <p className="font-medium text-sm">{step.label}</p>
                  <p className="text-muted-foreground text-xs">
                    {step.evidence ?? "Auto-detected via EasyConnect"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="min-w-[200px] flex-1">Continue Quest</Button>
          <Button className="min-w-[180px] flex-1" variant="secondary">
            View Rewards
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
