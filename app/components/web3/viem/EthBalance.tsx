'use client';
import { useViem } from '@/app/viemProvider';
import { useState, useEffect } from 'react';
import { formatEther } from 'viem';

export default function EthBalance() {
  const { address, isConnected, publicClient } = useViem();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !address) {
      setIsLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        const bal = await publicClient.getBalance({ address });
        setBalance(formatEther(bal));
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    // 监听新区块，自动更新余额
    const unwatch = publicClient.watchBlockNumber({
      onBlockNumber: () => {
        fetchBalance();
      }
    });

    return () => {
      unwatch();
    };
  }, [isConnected, address, publicClient]);

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
          <span className="text-blue-600">{balance} ETH</span>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2 truncate">地址: {address}</p>
    </div>
  );
}

