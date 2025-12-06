"use client";

import {
  AlertTriangle,
  CheckCircle2,
  LoaderPinwheel,
  Target,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { MilestoneSummary } from "@/data/milestones";
import { cn } from "@/lib/utils";

const statusMeta = {
  complete: {
    label: "Complete",
    icon: CheckCircle2,
    className:
      "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  in_progress: {
    label: "In Progress",
    icon: LoaderPinwheel,
    className:
      "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-200",
  },
  blocked: {
    label: "Blocked",
    icon: AlertTriangle,
    className:
      "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-200",
  },
};

type MilestoneTimelineProps = {
  milestones: MilestoneSummary[];
};

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  return (
    <section className="rounded-2xl border border-primary/10 bg-card p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-primary text-xs uppercase tracking-widest">
            Milestone progress
          </p>
          <h2 className="font-semibold text-xl sm:text-2xl">
            Roadmap through Milestone 3
          </h2>
          <p className="text-muted-foreground text-sm">
            Snapshot of deliverables that shipped plus what is queued next.
          </p>
        </div>
        <div className="inline-flex items-center rounded-full border border-dashed px-4 py-2 text-muted-foreground text-xs uppercase tracking-wide">
          <Target className="mr-2 size-4" />
          Ops owner: @nouslabs
        </div>
      </div>

      <div className="space-y-5">
        {milestones.map((milestone) => {
          const meta = statusMeta[milestone.status];
          const Icon = meta.icon;
          return (
            <Card className="border-muted bg-muted/5" key={milestone.id}>
              <CardContent className="space-y-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">
                      {milestone.timeframe}
                    </p>
                    <h3 className="font-semibold text-lg sm:text-xl">
                      {milestone.title}
                    </h3>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold text-xs",
                      meta.className
                    )}
                  >
                    <Icon className="size-4" />
                    {meta.label}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm">
                  {milestone.description}
                </p>

                <div>
                  <div className="mb-2 flex items-center justify-between font-semibold text-muted-foreground text-xs uppercase">
                    <span>Progress</span>
                    <span>{milestone.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        milestone.status === "complete"
                          ? "bg-emerald-500"
                          : "bg-primary"
                      )}
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <MilestoneList
                    items={milestone.highlights}
                    label="Highlights"
                  />
                  <MilestoneList
                    items={milestone.deliverables}
                    label="Key deliverables"
                  />
                  <MilestoneList items={milestone.nextUp} label="Next up" />
                </div>

                {milestone.blockers?.length ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-amber-900 text-sm dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                    <p className="mb-1 font-semibold uppercase tracking-wide">
                      Blockers
                    </p>
                    <ul className="list-disc space-y-1 pl-4">
                      {milestone.blockers.map((blocker) => (
                        <li key={blocker}>{blocker}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

type MilestoneListProps = {
  label: string;
  items: string[];
};

function MilestoneList({ label, items }: MilestoneListProps) {
  return (
    <div>
      <p className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
        {label}
      </p>
      <ul className="space-y-2 text-muted-foreground text-sm">
        {items.map((item) => (
          <li className="leading-relaxed" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
