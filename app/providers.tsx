'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Config, http, WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { EthersProvider } from './ethersProvider';
import { ViemProvider } from './viemProvider';

// ✅ 使用 useSyncExternalStore 检测客户端挂载（React 18+ 推荐方式）
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // 客户端返回 true
    () => false  // SSR 返回 false
  );
}

// ✅ 在模块级别创建配置（只在客户端执行）
let cachedConfig: Config | null = null;
function getConfig(): Config {
  if (!cachedConfig) {
    cachedConfig = getDefaultConfig({
      appName: 'My Web3 App',
      projectId: '5ca6481675fc0944dd1f48aa12538b31',
      chains: [sepolia],
      ssr: true,
      transports: {
        [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
      },
    });
  }
  return cachedConfig;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  const [queryClient] = useState(() => new QueryClient());

  // ✅ SSR 时渲染占位符
  if (!isClient) {
    return <>{children}</>;
  }

  const config = getConfig();

  return (
    <WagmiProvider config={config}>
      <EthersProvider>
        <ViemProvider>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>{children}</RainbowKitProvider>
          </QueryClientProvider>
        </ViemProvider>
      </EthersProvider>
    </WagmiProvider>
  );
}
