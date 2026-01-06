'use client';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  type WalletClient,
  type PublicClient,
  type Address,
} from 'viem';
import { sepolia } from 'viem/chains';

const WALLET_STATE_KEY = 'viem_wallet_state';

type WalletState = {
  status: 'connected' | 'disconnected';
  address?: string;
};

type ViemContextType = {
  walletClient: WalletClient | null;
  publicClient: PublicClient;
  address: Address | '';
  chainId: number;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const ViemContext = createContext<ViemContextType | undefined>(undefined);

export function ViemProvider({ children }: { children: ReactNode }) {
  // ✅ 初始化 publicClient（只读，不需要钱包）
  const [publicClient] = useState<PublicClient>(() =>
    createPublicClient({
      chain: sepolia,
      transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
    })
  );

  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [address, setAddress] = useState<Address | ''>('');
  const [chainId, setChainId] = useState(sepolia.id);
  const [isConnected, setIsConnected] = useState(false);

  // ✅ 检查连接
  const checkConnection = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_accounts',
      })) as Address[];

      if (accounts.length > 0) {
        const client = createWalletClient({
          account: accounts[0],
          chain: sepolia,
          transport: custom(window.ethereum),
        });

        setWalletClient(client);
        setAddress(accounts[0]);
        setIsConnected(true);

        // 保存连接状态
        localStorage.setItem(
          WALLET_STATE_KEY,
          JSON.stringify({
            status: 'connected',
            address: accounts[0],
          })
        );
      }
    } catch (error) {
      console.error('Check connection error:', error);
    }
  }, []);

  // ✅ 断开连接
  const disconnect = useCallback(() => {
    localStorage.setItem(
      WALLET_STATE_KEY,
      JSON.stringify({
        status: 'disconnected',
      })
    );

    setWalletClient(null);
    setAddress('');
    setIsConnected(false);
  }, []);
  // ✅ 初始化：检查是否之前连接过 + 监听事件
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const savedState = localStorage.getItem(WALLET_STATE_KEY);
    const state: WalletState | null = savedState
      ? JSON.parse(savedState)
      : null;

    if (state?.status !== 'disconnected') {
      queueMicrotask(() => {
        checkConnection();
      });
    }

    // 监听账户变化
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        localStorage.removeItem(WALLET_STATE_KEY);
        queueMicrotask(() => {
          checkConnection();
        });
      }
    };

    // 监听链变化
    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.(
        'accountsChanged',
        handleAccountsChanged
      );
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [checkConnection, disconnect]);

  // ✅ 连接钱包
  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('请先安装 MetaMask!');
      return;
    }

    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as Address[];

      if (accounts.length > 0) {
        const client = createWalletClient({
          account: accounts[0],
          chain: sepolia,
          transport: custom(window.ethereum),
        });

        setWalletClient(client);
        setAddress(accounts[0]);
        setIsConnected(true);

        localStorage.setItem(
          WALLET_STATE_KEY,
          JSON.stringify({
            status: 'connected',
            address: accounts[0],
          })
        );
      }
    } catch (error) {
      console.error('Connect error:', error);
    }
  }, []);

  return (
    <ViemContext.Provider
      value={{
        walletClient,
        publicClient,
        address,
        chainId,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </ViemContext.Provider>
  );
}

export function useViem() {
  const context = useContext(ViemContext);
  if (context === undefined) {
    throw new Error('useViem must be used within ViemProvider');
  }
  return context;
}
