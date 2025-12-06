"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Shield } from "lucide-react";
import { useMemo } from "react";

import { AdminQuestTable } from "@/components/admin/admin-quest-table";
import { NotificationConsole } from "@/components/admin/notification-console";
import { AdminOverridePanel } from "@/components/admin/override-panel";
import type { QuestStatus } from "@/components/quests/types";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/components/wallet/wallet-provider";
import type { AdminQuestRecord } from "@/data/admin";
import { notificationLogs, pendingOverrides } from "@/data/admin";
import { orpc, queryClient } from "@/utils/orpc";

export default function AdminPage() {
  const {
    account,
    status: walletStatus,
    connectMetaMask,
    connectWalletConnect,
  } = useWallet();
  const isWalletConnecting = walletStatus === "connecting";

  const listFilter = { includeDrafts: true } as const;
  const questsQuery = useQuery(
    orpc.quests.list.queryOptions({ input: listFilter })
  );

  const quests = useMemo<AdminQuestRecord[]>(
    () =>
      (questsQuery.data ?? []).map((quest) => ({
        id: quest.id,
        title: quest.title,
        category: quest.category,
        status: quest.progress.status as QuestStatus,
        xp: quest.xp,
        badge: quest.badge ?? "Custom Badge",
        owner: quest.owner,
        published: quest.published,
        updatedAt: quest.updatedAt,
      })),
    [questsQuery.data]
  );

  const createQuest = useMutation({
    mutationFn: (record: AdminQuestRecord) =>
      orpc.quests.create.call({
        title: record.title,
        summary: `${record.title} auto-generated summary`,
        category: record.category,
        xp: record.xp,
        badge: record.badge,
        owner: record.owner,
        published: record.published,
        lifecycleStatus: record.published ? "ACTIVE" : "DRAFT",
        statusLabel: record.status,
        steps: [],
        rules: [],
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: orpc.quests.list.queryKey({ input: listFilter }),
      });
    },
  });

  return (
    <main className="min-h-screen bg-muted/40 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-primary text-xs uppercase tracking-[0.3em]">
                Milestone 5 control room
              </p>
              <h1 className="font-semibold text-3xl">
                Admin panel & notification command center
              </h1>
              <p className="text-muted-foreground text-sm">
                Stage quests, queue overrides, and monitor outbound
                notifications before beta launch.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-dashed px-4 py-2 text-muted-foreground text-xs uppercase">
              <Shield className="size-4" />
              Access tier: ops
            </div>
          </div>
        </section>
        <div className="rounded-2xl border border-primary/40 border-dashed bg-primary/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-primary text-xs uppercase tracking-[0.3em]">
                Wallet authorization
              </p>
              <p className="font-semibold">
                {account
                  ? `Connected: ${formatWallet(account.publicId)}`
                  : "Connect a wallet to persist quest drafts and overrides."}
              </p>
              {account ? null : (
                <p className="text-muted-foreground text-sm">
                  Use MetaMask Snap or WalletConnect to prove ops access before
                  publishing quests.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {account ? (
                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-semibold text-emerald-600 text-xs">
                  Wallet verified
                </span>
              ) : (
                <>
                  <Button
                    disabled={isWalletConnecting}
                    onClick={() => connectMetaMask()}
                    size="sm"
                  >
                    MetaMask Snap
                  </Button>
                  <Button
                    disabled={isWalletConnecting}
                    onClick={() => connectWalletConnect()}
                    size="sm"
                    variant="outline"
                  >
                    WalletConnect
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <AdminQuestTable
          isLoading={questsQuery.isLoading}
          isSubmitting={createQuest.isPending}
          onQuestCreated={(quest) => createQuest.mutate(quest)}
          quests={quests}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminOverridePanel overrides={pendingOverrides} quests={quests} />
          <NotificationConsole logs={notificationLogs} />
        </div>
      </div>
    </main>
  );
}

function formatWallet(value?: string) {
  if (!value) {
    return "Unknown wallet";
  }
  return value.length > 18
    ? `${value.slice(0, 6)}...${value.slice(-6)}`
    : value;
}
