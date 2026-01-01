'use client';

import dynamic from 'next/dynamic';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// 使用 dynamic import 并禁用 SSR，避免 Hydration 错误
const EthBalance = dynamic(() => import('./components/web3/EthBalance'), { ssr: false });
const SendEth = dynamic(() => import('./components/web3/SendEth'), { ssr: false });
const TokenBalance = dynamic(() => import('./components/web3/TokenBalance'), { ssr: false });
const TransferListener = dynamic(() => import('./components/web3/TransferListener'), { ssr: false });
const TokenTransfer = dynamic(() => import('./components/web3/TokenTransfer'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 头部与连接按钮 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">wallet交互</h1>
            <p className="mt-1 text-sm text-gray-500">Wagmi + RainbowKit</p>
          </div>
          <ConnectButton />
        </div>

        {/* 任务网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <EthBalance />
            <SendEth />
          </div>
          
          <div className="space-y-6">
            <TokenBalance />
            <TokenTransfer />
            <TransferListener />
          </div>
        </div>

        {/* 底部信息 */}
        <div className="text-center text-gray-400 text-xs py-4">
          请确保您的钱包已切换至 Sepolia 测试网
        </div>
      </div>
    </div>
  );
}
