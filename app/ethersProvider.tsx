'use client';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';

const WALLET_STATE_KEY = 'ethers_wallet_state';

type WalletState = {
  status: 'connected' | 'disconnected';
  address?: string;
};

type EthersContextType = {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string;
  chainId: number;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const EthersContext = createContext<EthersContextType | undefined>(undefined);

export function EthersProvider({ children }: { children: ReactNode }) {
  const [provider] = useState<ethers.BrowserProvider | null>(() => {
    if (typeof window === 'undefined' || !window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  });

  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const checkConnection = useCallback(async (prov: ethers.BrowserProvider) => {
    try {
      const accounts = await prov.send('eth_accounts', []);
      if (accounts.length > 0) {
        const s = await prov.getSigner();
        const addr = await s.getAddress();
        const network = await prov.getNetwork();
        
        setSigner(s);
        setAddress(addr);
        setChainId(Number(network.chainId));
        setIsConnected(true);
        
        localStorage.setItem(WALLET_STATE_KEY, JSON.stringify({
          status: 'connected',
          address: addr
        }));
      }
    } catch (error) {
      console.error('Check connection error:', error);
    }
  }, []);

  // ✅ 初始化连接检查
  useEffect(() => {
    if (!provider) return;

    const savedState = localStorage.getItem(WALLET_STATE_KEY);
    const state: WalletState | null = savedState ? JSON.parse(savedState) : null;

    if (state?.status !== 'disconnected') {
      queueMicrotask(() => {
        checkConnection(provider);
      });
    }
  }, [provider, checkConnection]);

  const connect = useCallback(async () => {
    if (!provider) {
      alert('请先安装 MetaMask!');
      return;
    }
    
    try {
      await provider.send('eth_requestAccounts', []);
      await checkConnection(provider);
    } catch (error) {
      console.error('Connect error:', error);
    }
  }, [provider, checkConnection]);

  const disconnect = useCallback(() => {
    localStorage.setItem(WALLET_STATE_KEY, JSON.stringify({
      status: 'disconnected'
    }));
    
    setSigner(null);
    setAddress('');
    setChainId(0);
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (!window.ethereum || !provider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        queueMicrotask(() => {
          checkConnection(provider);
        });
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      setChainId(parseInt(chainIdHex, 16));
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [provider, checkConnection, disconnect]);

  return (
    <EthersContext.Provider 
      value={{ 
        provider, 
        signer, 
        address,
        chainId,
        isConnected,
        connect,
        disconnect
      }}
    >
      {children}
    </EthersContext.Provider>
  );
}

export function useEthers() {
  const context = useContext(EthersContext);
  if (context === undefined) {
    throw new Error('useEthers must be used within EthersProvider');
  }
  return context;
}