"use client";

import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Loader2,
  PlugZap,
  Radio,
  Shield,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWallet } from "./wallet-provider";

const methodLabel: Record<
  NonNullable<ReturnType<typeof useWallet>["method"]>,
  string
> = {
  metamask: "MetaMask",
  walletconnect: "WalletConnect",
  seed: "Seed",
  vault: "Vault",
};

function formatIdentity(identity?: string) {
  if (!identity) {
    return "Not connected";
  }
  return identity.length > 16
    ? `${identity.slice(0, 6)}...${identity.slice(-4)}`
    : identity;
}

export function WalletConnectPanel() {
  const {
    account,
    method,
    status,
    error,
    walletConnectUri,
    isWalletConnectPending,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
  } = useWallet();

  const isConnecting = status === "connecting";

  return (
    <Card className="border-primary/20 bg-background/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1 text-primary text-xs uppercase tracking-[0.3em]">
          <Shield className="size-3.5" />
          Wallet Auth
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl">
            Bring your Qubic identity online
          </CardTitle>
          <CardDescription>
            Connect a wallet via MetaMask Snap or WalletConnect to unlock the
            quest creator, ledger overrides, and live rewards monitoring.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-primary/30 border-dashed bg-primary/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
                Current session
              </p>
              <p className="font-semibold text-lg">
                {account ? formatIdentity(account.publicId) : "No wallet"}
              </p>
              {account ? (
                <p className="text-muted-foreground text-sm">
                  Auth via{" "}
                  {method ? (methodLabel[method] ?? method) : "unknown"}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Connect a wallet to start shipping quests.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {account ? (
                <Button
                  disabled={isConnecting}
                  onClick={disconnect}
                  variant="outline"
                >
                  Disconnect
                </Button>
              ) : null}
              <Button
                className="min-w-[180px]"
                disabled={isConnecting}
                onClick={connectMetaMask}
              >
                {isConnecting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <PlugZap className="mr-2 size-4" />
                )}
                Connect MetaMask
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            disabled={isConnecting}
            onClick={connectWalletConnect}
            size="lg"
            variant="secondary"
          >
            {isConnecting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Radio className="mr-2 size-4" />
            )}
            WalletConnect
          </Button>
          <Button
            disabled={isConnecting || !!account}
            onClick={connectMetaMask}
            size="lg"
            variant="outline"
          >
            <ArrowRight className="mr-2 size-4" />
            {account ? "Wallet linked" : "MetaMask Snap"}
          </Button>
        </div>

        <WalletConnectUriNotice
          pending={isWalletConnectPending}
          uri={walletConnectUri}
        />

        <WalletErrorBanner error={error} />
      </CardContent>
    </Card>
  );
}

function WalletConnectUriNotice({
  uri,
  pending,
}: {
  uri: string | null;
  pending: boolean;
}) {
  const [copied, setCopied] = useState(false);

  if (!uri) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-muted bg-muted/40 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-sm">WalletConnect Session</p>
          <p className="text-muted-foreground text-xs">
            {pending
              ? "Scan QR code in your wallet app and approve."
              : "Waiting for approval..."}
          </p>
        </div>
        <Button
          className="min-w-[120px]"
          onClick={async () => {
            if (typeof navigator !== "undefined" && navigator.clipboard) {
              await navigator.clipboard.writeText(uri);
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            }
          }}
          size="sm"
          variant="ghost"
        >
          {copied ? (
            <CheckCircle2 className="mr-2 size-4 text-emerald-500" />
          ) : (
            <Copy className="mr-2 size-4" />
          )}
          Copy URI
        </Button>
      </div>
      <code className="block max-h-28 overflow-y-auto rounded-xl bg-background px-3 py-2 text-muted-foreground text-xs">
        {uri}
      </code>
    </div>
  );
}

function WalletErrorBanner({ error }: { error: string | null }) {
  if (!error) {
    return null;
  }

  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive text-sm">
      {error}
    </div>
  );
}
