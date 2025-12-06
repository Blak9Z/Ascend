"use client";

import { ArrowUpRightSquare, CheckCircle2, Clock3, Lock } from "lucide-react";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";

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
  onQuestCreated?: (quest: AdminQuestRecord) => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
};

type DraftQuest = {
  title: string;
  category: string;
  xp: number;
  badge: string;
  owner: string;
  status: AdminQuestRecord["status"];
  published: boolean;
};

const defaultDraft: DraftQuest = {
  title: "",
  category: "Onboarding",
  xp: 50,
  badge: "",
  owner: "@nouslabs",
  status: "in_progress",
  published: false,
};

export function AdminQuestTable({
  quests,
  onQuestCreated,
  isLoading,
  isSubmitting,
}: AdminQuestTableProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<DraftQuest>(defaultDraft);

  const disableSubmit = useMemo(
    () => !(draft.title.trim() && draft.badge.trim()),
    [draft.title, draft.badge]
  );

  const handleCreate = () => {
    if (disableSubmit) {
      return;
    }
    const id =
      draft.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `quest-${Date.now()}`;

    const record: AdminQuestRecord = {
      id,
      title: draft.title.trim(),
      category: draft.category,
      status: draft.status,
      xp: draft.xp,
      badge: draft.badge.trim(),
      owner: draft.owner.trim() || "@nouslabs",
      published: draft.published,
      updatedAt: new Date().toISOString(),
    };
    setDraft(defaultDraft);
    setIsCreating(false);
    onQuestCreated?.(record);
  };

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-xl">Quest Catalog</CardTitle>
          <CardDescription>
            Manage publish status, owners, and XP rewards before launch.
          </CardDescription>
        </div>
        <Button onClick={() => setIsCreating((prev) => !prev)} size="sm">
          <ArrowUpRightSquare className="mr-2 size-4" />
          {isCreating ? "Close" : "New Quest"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCreating ? (
          <div className="rounded-xl border border-primary/40 border-dashed bg-primary/5 p-4">
            <form
              className="grid gap-3 md:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                handleCreate();
              }}
            >
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="quest-title">Title</Label>
                <Input
                  id="quest-title"
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Quest title"
                  value={draft.title}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quest-category">Category</Label>
                <Input
                  id="quest-category"
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                  value={draft.category}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quest-owner">Owner</Label>
                <Input
                  id="quest-owner"
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      owner: event.target.value,
                    }))
                  }
                  value={draft.owner}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quest-xp">XP</Label>
                <Input
                  id="quest-xp"
                  min={0}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      xp: Number(event.target.value),
                    }))
                  }
                  type="number"
                  value={draft.xp}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quest-badge">Badge</Label>
                <Input
                  id="quest-badge"
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      badge: event.target.value,
                    }))
                  }
                  value={draft.badge}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quest-status">Status</Label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  id="quest-status"
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      status: event.target.value as AdminQuestRecord["status"],
                    }))
                  }
                  value={draft.status}
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="locked">Locked</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quest-published">Visibility</Label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  id="quest-published"
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      published: event.target.value === "published",
                    }))
                  }
                  value={draft.published ? "published" : "draft"}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Button
                  className="w-full"
                  disabled={disableSubmit || isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Saving..." : "Save Quest"}
                </Button>
              </div>
            </form>
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-xl border border-muted/70 border-dashed bg-background/50 px-4 py-6 text-center text-muted-foreground text-sm">
            Loading quests...
          </div>
        ) : (
          <>
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
                          {quest.xp} XP Жњ {quest.badge}
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
          </>
        )}
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
