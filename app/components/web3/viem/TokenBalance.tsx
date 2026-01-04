'use client';
import { useViem } from '@/app/viemProvider';
import { ERC20_ADDRESS, ERC20_ABI } from '@/app/constants/token';
import { formatUnits } from 'viem';
import { useState, useEffect } from 'react';

export default function TokenBalance() {
  const { address, isConnected, publicClient } = useViem();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [symbol, setSymbol] = useState<string>('Token');
  const [decimals, setDecimals] = useState<number>(18);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setIsLoading(false);
      return;
    }

    const fetchTokenData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 并行请求
        const [balanceResult, symbolResult, decimalsResult] = await Promise.all([
          publicClient.readContract({
            address: ERC20_ADDRESS,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address]
          }),
          publicClient.readContract({
            address: ERC20_ADDRESS,
            abi: ERC20_ABI,
            functionName: 'symbol'
          }),
          publicClient.readContract({
            address: ERC20_ADDRESS,
            abi: ERC20_ABI,
            functionName: 'decimals'
          })
        ]);

        setBalance(balanceResult as bigint);
        setSymbol(symbolResult as string);
        setDecimals(decimalsResult as number);
      } catch (err: any) {
        console.error('Error fetching token data:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenData();

    // 监听新区块，自动更新余额
    const unwatch = publicClient.watchBlockNumber({
      onBlockNumber: () => {
        fetchTokenData();
      }
    });

    return () => {
      unwatch();
    };
  }, [isConnected, address, publicClient]);

  if (!isConnected) return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="font-bold text-gray-700 mb-2">3. 调用 ERC20 balanceOf</h3>
      <p className="text-sm text-gray-500">请先连接钱包</p>
    </div>
  );

  const displayBalance = (() => {
    try {
      return balance != null ? formatUnits(balance, decimals) : '0';
    } catch {
      return '0';
    }
  })();

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="font-bold text-gray-700 mb-2">3. 调用 ERC20 balanceOf</h3>
      <div className="text-lg font-mono">
        {isLoading ? (
          <span className="text-gray-400">查询中...</span>
        ) : (
          <span className="text-green-600">
            {displayBalance} {symbol}
          </span>
        )}
      </div>
      {error && <p className="text-[10px] text-red-400 mt-1">合约地址有误或网络不匹配</p>}
      <p className="text-[10px] text-gray-400 mt-2 break-all">合约: {ERC20_ADDRESS}</p>
    </div>
  );
}

