'use client';
import { useViem } from '@/app/viemProvider';
import { parseUnits, type Hash } from 'viem';
import { sepolia } from 'viem/chains';
import { useState } from 'react';
import { ERC20_ADDRESS, ERC20_ABI } from '@/app/constants/token';

export default function TokenTransfer() {
  const { walletClient, publicClient, isConnected } = useViem();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<Hash | ''>('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !amount || !walletClient) return;

    try {
      setError(null);
      setIsSuccess(false);
      setHash('');
      setIsPending(true);

      // 调用合约 transfer 函数
      const txHash = await walletClient.writeContract({
        account: walletClient.account!,
        chain: sepolia,
        address: ERC20_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [to as `0x${string}`, parseUnits(amount, 18)],
      });

      setIsPending(false);
      setIsConfirming(true);
      setHash(txHash);

      // 等待交易确认
      await publicClient.waitForTransactionReceipt({ hash: txHash });

      setIsConfirming(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Transfer error:', err);
      let errorMessage = err.message || '转账失败';
      if (errorMessage.includes('insufficient')) {
        errorMessage = '余额不足';
      }
      setError(new Error(errorMessage));
      setIsPending(false);
      setIsConfirming(false);
    }
  };

  if (!isConnected) {
    return (
      <div className='p-4 border rounded shadow-sm bg-white'>
        <h3 className='font-bold text-gray-700 mb-2'>5. ERC20 代币转账</h3>
        <p className='text-sm text-gray-500'>请先连接钱包</p>
      </div>
    );
  }

  return (
    <div className='p-4 border rounded shadow-sm bg-white'>
      <h3 className='font-bold text-gray-700 mb-2'>5. ERC20 代币转账</h3>
      <form onSubmit={handleTransfer} className='space-y-3'>
        <input
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder='接收地址 (0x...)'
          className='w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500'
          required
          disabled={isPending || isConfirming}
        />
        <input
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder='转账数量'
          type='number'
          className='w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500'
          required
          disabled={isPending || isConfirming}
        />
        <button
          disabled={isPending || isConfirming}
          type='submit'
          className='w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded transition-colors disabled:bg-gray-300'
        >
          {isPending
            ? '请在钱包确认...'
            : isConfirming
            ? '交易确认中...'
            : '转账代币'}
        </button>
      </form>

      {error && (
        <p className='text-xs text-red-500 mt-2'>
          错误: {error.message.split('\n')[0]}
        </p>
      )}
      {isSuccess && (
        <div className='mt-2 p-2 bg-green-50 rounded'>
          <p className='text-xs text-green-600 font-medium'>转账提交成功！</p>
          <p className='text-[10px] text-gray-500'>
            正在等待区块确认，您可以观察上方监听器。
          </p>
        </div>
      )}
    </div>
  );
}
