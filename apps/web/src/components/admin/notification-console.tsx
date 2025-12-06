"use client";

import { BellRing, RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NotificationLog } from "@/data/admin";
import { cn } from "@/lib/utils";

const channelColor: Record<
  NotificationLog["channel"],
  { label: string; tone: string }
> = {
  discord: { label: "Discord", tone: "text-indigo-500" },
  notion: { label: "Notion", tone: "text-emerald-500" },
  sheets: { label: "Sheets", tone: "text-amber-500" },
  zapier: { label: "Zapier", tone: "text-rose-500" },
};

const statusPill: Record<
  NotificationLog["status"],
  { label: string; className: string }
> = {
  sent: {
    label: "Sent",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  },
  retrying: {
    label: "Retrying",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  },
  failed: {
    label: "Failed",
    className: "bg-rose-500/10 text-rose-600 border-rose-500/30",
  },
};

type NotificationConsoleProps = {
  logs: NotificationLog[];
};

export function NotificationConsole({ logs }: NotificationConsoleProps) {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-lg">Notification Console</CardTitle>
          <CardDescription>
            Track delivery retries and replay failed payloads.
          </CardDescription>
        </div>
        <div className="inline-flex items-center gap-2 text-muted-foreground text-xs uppercase">
          <BellRing className="size-4" />
          All channels
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {logs.map((log) => {
          const channel = channelColor[log.channel];
          const status = statusPill[log.status];
          return (
            <div className="rounded-xl border border-muted/70 p-3" key={log.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{log.questId}</p>
                  <p className="text-muted-foreground text-xs">
                    Issued {formatTimestamp(log.issuedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold text-xs",
                      status.className
                    )}
                  >
                    {log.status === "failed" ? (
                      <TriangleAlert className="size-3" />
                    ) : (
                      <RefreshCw className="size-3" />
                    )}
                    {status.label}
                  </span>
                  <span className={cn("font-semibold", channel.tone)}>
                    {channel.label}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <p className="text-muted-foreground">
                  Attempt #{log.attempt} · Channel {log.channel}
                </p>
                {log.status !== "sent" ? (
                  <Button size="sm" variant="outline">
                    <RefreshCw className="mr-1.5 size-3.5" />
                    Replay
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
}
