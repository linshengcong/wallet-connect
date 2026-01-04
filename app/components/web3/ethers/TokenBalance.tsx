'use client';
import { ERC20_ABI, ERC20_ADDRESS } from '@/app/constants/token';
import { useEthers } from '@/app/ethersProvider';
import { useEthersReadContract } from '@/app/hooks/ethers';
import { formatUnits } from 'ethers';

export default function TokenBalance() {
  const { isConnected, address } = useEthers();
  const {
    data: balance,
    isLoading,
    error,
  } = useEthersReadContract({
    address: ERC20_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address!],
  });
  const { data: symbol } = useEthersReadContract({
    address: ERC20_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'symbol',
    args: [],
  });
  const { data: decimals } = useEthersReadContract({
    address: ERC20_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
    args: [],
  });

  const formattedBalance = () => {
    // 检查所有必需的值
    if (balance == null || decimals == null) {
      return '0';
    }

    try {
      return formatUnits(balance, decimals);
    } catch (err) {
      console.error('Format error:', err);
      return '0';
    }
  };
  if (!isConnected)
    return (
      <div className='p-4 border rounded shadow-sm bg-white'>
        <h3 className='font-bold text-gray-700 mb-2'>
          3. 调用 ERC20 balanceOf
        </h3>
        <p className='text-sm text-gray-500'>请先连接钱包</p>
      </div>
    );

  return (
    <div className='p-4 border rounded shadow-sm bg-white'>
      <h3 className='font-bold text-gray-700 mb-2'>3. 调用 ERC20 balanceOf</h3>
      <div className='text-lg font-mono'>
        {isLoading ? (
          <span className='text-gray-400'>查询中...</span>
        ) : (
          <span className='text-green-600'>
            {formattedBalance()} {symbol || 'Token'}
          </span>
        )}
      </div>
      {error && (
        <p className='text-[10px] text-red-400 mt-1'>
          合约地址有误或网络不匹配
        </p>
      )}
      <p className='text-[10px] text-gray-400 mt-2 break-all'>
        合约: {ERC20_ADDRESS}
      </p>
    </div>
  );
}
