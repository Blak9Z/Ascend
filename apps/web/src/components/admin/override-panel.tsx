"use client";

import { Check, Loader2, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminQuestRecord, OverrideRequest } from "@/data/admin";

type AdminOverridePanelProps = {
  quests: AdminQuestRecord[];
  overrides: OverrideRequest[];
};

export function AdminOverridePanel({
  quests,
  overrides,
}: AdminOverridePanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    questId: quests[0]?.id ?? "",
    wallet: "",
    xpDelta: 0,
    reason: "",
  });

  const pendingCount = overrides.filter(
    (override) => override.status === "pending"
  ).length;

  const questOptions = useMemo(
    () =>
      quests.map((quest) => ({
        label: quest.title,
        value: quest.id,
      })),
    [quests]
  );

  const submitOverride = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Override queued for review", {
      description: `${formState.wallet} • ${formState.xpDelta} XP`,
    });
    setIsSubmitting(false);
    setFormState((prev) => ({ ...prev, wallet: "", xpDelta: 0, reason: "" }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Manual Overrides</CardTitle>
        <CardDescription>
          {pendingCount} pending approvals · two-man rule enforced.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            submitOverride().catch(() => {
              toast.error("Unable to submit override");
              setIsSubmitting(false);
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="questId">Quest</Label>
            <select
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
              id="questId"
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  questId: event.target.value,
                }))
              }
              value={formState.questId}
            >
              {questOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet</Label>
              <Input
                id="wallet"
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    wallet: event.target.value,
                  }))
                }
                placeholder="0x..."
                value={formState.wallet}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="xpDelta">XP Delta</Label>
              <Input
                id="xpDelta"
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    xpDelta: Number(event.target.value),
                  }))
                }
                type="number"
                value={formState.xpDelta}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <textarea
              className="min-h-[96px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
              id="reason"
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  reason: event.target.value,
                }))
              }
              placeholder="Explain why this override is required..."
              value={formState.reason}
            />
          </div>
          <Button
            className="w-full"
            disabled={isSubmitting || !formState.wallet || !formState.reason}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Submitting
              </>
            ) : (
              <>
                <ShieldAlert className="mr-2 size-4" />
                Queue Override
              </>
            )}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">Pending approvals</p>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {pendingCount}
            </span>
          </div>
          <div className="space-y-3">
            {overrides.map((override) => (
              <div
                className="rounded-lg border border-muted/70 px-3 py-2 text-sm"
                key={override.id}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    {override.questId} · {override.wallet}
                  </p>
                  <span className="text-muted-foreground text-xs">
                    {formatRelative(override.submittedAt)}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {override.action} · ΔXP {override.xpDelta}
                  {override.badge ? ` · Badge: ${override.badge}` : ""}
                </p>
                {override.status === "approved" ? (
                  <div className="mt-1 inline-flex items-center gap-1 text-emerald-500 text-xs">
                    <Check className="size-3" />
                    Approved by {override.reviewer}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatRelative(value: string) {
  const delta = Date.now() - new Date(value).getTime();
  const minutes = Math.round(delta / 60_000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}
