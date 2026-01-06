'use client';

import React, { useState } from 'react';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { Config, http, WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { EthersProvider } from './ethersProvider';
import { ViemProvider } from './viemProvider';

// const config = getDefaultConfig({
//   appName: 'My Web3 App',
//   projectId: '5ca6481675fc0944dd1f48aa12538b31',
//   chains: [sepolia],
//   ssr: true,
// });

// const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    // ✅ 在组件内部使用 useState 懒加载，确保只在客户端创建
    const [config] = useState<Config>(() =>
      getDefaultConfig({
        appName: 'My Web3 App',
        projectId: '5ca6481675fc0944dd1f48aa12538b31',
        chains: [sepolia],
        ssr: true,
        transports: {
          [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
        },
      })
    );
  
    const [queryClient] = useState(() => new QueryClient());
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
