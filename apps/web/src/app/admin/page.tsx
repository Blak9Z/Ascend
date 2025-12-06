import { Shield } from "lucide-react";

import { AdminQuestTable } from "@/components/admin/admin-quest-table";
import { NotificationConsole } from "@/components/admin/notification-console";
import { AdminOverridePanel } from "@/components/admin/override-panel";
import {
  adminQuestRecords,
  notificationLogs,
  pendingOverrides,
} from "@/data/admin";

export default function AdminPage() {
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

        <AdminQuestTable quests={adminQuestRecords} />

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminOverridePanel
            overrides={pendingOverrides}
            quests={adminQuestRecords}
          />
          <NotificationConsole logs={notificationLogs} />
        </div>
      </div>
    </main>
  );
}
