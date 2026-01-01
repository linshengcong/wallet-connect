'use client';
import { useAccount, useBalance } from 'wagmi';

export default function EthBalance() {
  const { address, isConnected } = useAccount();
  const { data, isLoading } = useBalance({ address });

  if (!isConnected) return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="font-bold text-gray-700 mb-2">1. 查询 ETH 余额</h3>
      <p className="text-sm text-gray-500">请先连接钱包</p>
    </div>
  );

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="font-bold text-gray-700 mb-2">1. 查询 ETH 余额</h3>
      <div className="text-lg font-mono">
        {isLoading ? (
          <span className="text-gray-400">加载中...</span>
        ) : (
          <span className="text-blue-600">{data?.formatted} {data?.symbol}</span>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2 truncate">地址: {address}</p>
    </div>
  );
}

