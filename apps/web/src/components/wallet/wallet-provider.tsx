"use client";

import type {
  AuthMethod,
  AuthSession,
  WalletConnectAuthOptions,
} from "@nouslabs/sdk/wallet";
import {
  AuthError,
  connectWalletConnect,
  createMetaMaskSession,
  createWalletConnectSession,
} from "@nouslabs/sdk/wallet";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type WalletStatus = "idle" | "connecting" | "connected";

type WalletContextValue = {
  account: AuthSession["account"] | null;
  method: AuthMethod | null;
  status: WalletStatus;
  error: string | null;
  walletConnectUri: string | null;
  isWalletConnectPending: boolean;
  connectMetaMask: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const walletConnectMetadata = {
  name: "Ascend Quest Ops",
  description: "Ascend quest engine wallet auth",
  url: "https://ascend.quest",
  icons: ["https://avatars.githubusercontent.com/u/16409631?s=200&v=4"],
};

function getProjectId() {
  return process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";
}

function normaliseError(error: unknown) {
  if (error instanceof AuthError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown wallet error";
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<WalletStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [walletConnectState, setWalletConnectState] = useState<{
    uri: string;
    waitForApproval: (() => Promise<AuthSession>) | null;
  } | null>(null);

  const resetWalletConnect = useCallback(() => {
    setWalletConnectState(null);
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await session?.disconnect?.();
    } catch {
      // ignore disconnect errors
    } finally {
      setSession(null);
      setStatus("idle");
      resetWalletConnect();
    }
  }, [resetWalletConnect, session]);

  const connectMetaMask = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    try {
      const nextSession = await createMetaMaskSession();
      setSession(nextSession);
      setStatus("connected");
      resetWalletConnect();
    } catch (err) {
      setError(normaliseError(err));
      setStatus(session ? "connected" : "idle");
    }
  }, [resetWalletConnect, session]);

  const connectWalletConnectHandler = useCallback(
    async (options: WalletConnectAuthOptions) => {
      setStatus("connecting");
      setError(null);
      try {
        const connection = await connectWalletConnect(options);
        setWalletConnectState({
          uri: connection.uri,
          waitForApproval: connection.waitForApproval,
        });
        const approvedSession = await connection.waitForApproval();
        setSession(approvedSession);
        setStatus("connected");
        resetWalletConnect();
      } catch (err) {
        setError(normaliseError(err));
        setStatus(session ? "connected" : "idle");
      }
    },
    [resetWalletConnect, session]
  );

  const connectWalletConnectAction = useCallback(async () => {
    const projectId = getProjectId();
    if (!projectId) {
      setError(
        "Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable for WalletConnect."
      );
      return;
    }

    await connectWalletConnectHandler({
      projectId,
      metadata: walletConnectMetadata,
      chainId: "qubic:mainnet",
    });
  }, [connectWalletConnectHandler]);

  useEffect(() => {
    const projectId = getProjectId();
    if (!projectId || typeof window === "undefined") {
      return;
    }

    let cancelled = false;
    const resume = async () => {
      try {
        const resumed = await createWalletConnectSession({
          projectId,
          metadata: walletConnectMetadata,
          chainId: "qubic:mainnet",
        });
        if (!cancelled) {
          setSession(resumed);
          setStatus("connected");
        }
      } catch {
        // ignore missing session errors
      }
    };

    resume().catch(() => {
      // ignore resume failures
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      account: session?.account ?? null,
      method: session?.account.method ?? null,
      status,
      error,
      walletConnectUri: walletConnectState?.uri ?? null,
      isWalletConnectPending: Boolean(walletConnectState?.waitForApproval),
      connectMetaMask,
      connectWalletConnect: connectWalletConnectAction,
      disconnect,
    }),
    [
      connectMetaMask,
      connectWalletConnectAction,
      disconnect,
      error,
      session,
      status,
      walletConnectState,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
