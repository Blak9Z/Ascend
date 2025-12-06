"use client";

import { Loader2, WalletMinimal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "./wallet-provider";

const methodCopy: Record<string, string> = {
  metamask: "MetaMask Snap",
  walletconnect: "WalletConnect",
  seed: "Seed",
  vault: "Vault",
};

function formatAccount(value?: string) {
  if (!value) {
    return "Wallet";
  }
  return value.length > 10
    ? `${value.slice(0, 4)}...${value.slice(-4)}`
    : value;
}

export function WalletStatusPill() {
  const {
    account,
    method,
    status,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
  } = useWallet();

  const isConnecting = status === "connecting";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Wallet actions"
          size="sm"
          variant={account ? "secondary" : "outline"}
        >
          {isConnecting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <WalletMinimal className="mr-2 size-4" />
          )}
          {account ? formatAccount(account.publicId) : "Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card">
        <DropdownMenuLabel>
          {account
            ? `Connected via ${
                method ? (methodCopy[method] ?? method) : "wallet"
              }`
            : "Connect a wallet"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {account ? (
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => disconnect()}
          >
            Disconnect
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => connectMetaMask()}
            >
              MetaMask Snap
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => connectWalletConnect()}
            >
              WalletConnect
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link className="w-full" href="/#wallet-auth">
            Open wallet panel
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
