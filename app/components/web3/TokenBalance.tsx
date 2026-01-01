'use client';
import { useAccount, useReadContract } from 'wagmi';
import { ERC20_ADDRESS, ERC20_ABI } from '@/app/constants/token';
import { formatUnits } from 'viem';

export default function TokenBalance() {
  const { address, isConnected } = useAccount();
  
  const { data: balance, isLoading, error } = useReadContract({
    address: ERC20_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: {
      enabled: !!address,
    }
  });

  const { data: symbol } = useReadContract({
    address: ERC20_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  const { data: decimals } = useReadContract({
    address: ERC20_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  if (!isConnected) return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="font-bold text-gray-700 mb-2">3. 调用 ERC20 balanceOf</h3>
      <p className="text-sm text-gray-500">请先连接钱包</p>
    </div>
  );

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="font-bold text-gray-700 mb-2">3. 调用 ERC20 balanceOf</h3>
      <div className="text-lg font-mono">
        {isLoading ? (
          <span className="text-gray-400">查询中...</span>
        ) : (
          <span className="text-green-600">
            {balance !== undefined ? formatUnits(balance, decimals || 18) : '0'} {symbol || 'Token'}
          </span>
        )}
      </div>
      {error && <p className="text-[10px] text-red-400 mt-1">合约地址有误或网络不匹配</p>}
      <p className="text-[10px] text-gray-400 mt-2 break-all">合约: {ERC20_ADDRESS}</p>
    </div>
  );
}

