"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

type NotificationChannel = {
  id: string;
  label: string;
  description: string;
  docsUrl: string;
};

type NotificationsPanelProps = {
  channels: NotificationChannel[];
};

export function NotificationsPanel({ channels }: NotificationsPanelProps) {
  const [enabledChannels, setEnabledChannels] = useState<
    Record<string, boolean>
  >(() =>
    channels.reduce<Record<string, boolean>>((acc, channel) => {
      acc[channel.id] = channel.id !== "zapier";
      return acc;
    }, {})
  );

  const toggleChannel = (id: string) => {
    setEnabledChannels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notification Channels</CardTitle>
        <CardDescription>
          Route quest progress to your ops stack.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {channels.map((channel) => (
          <div
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-muted/60 p-3"
            key={channel.id}
          >
            <Checkbox
              aria-label={`${channel.label} notification toggle`}
              checked={!!enabledChannels[channel.id]}
              onCheckedChange={() => toggleChannel(channel.id)}
            />
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                {channel.label}
                <Button asChild size="sm" variant="ghost">
                  <a href={channel.docsUrl} rel="noreferrer" target="_blank">
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                {channel.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
