'use client';
import { useEthers } from '@/app/ethersProvider';

export function EthersConnectButton() {
  const { isConnected, address, connect, disconnect } = useEthers();

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
      >
        连接钱包
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="bg-gray-100 px-3 py-2 rounded-lg">
        <span className="text-xs text-gray-600">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
      <button
        onClick={disconnect}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
      >
        断开
      </button>
    </div>
  );
}