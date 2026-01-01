'use client';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { useState } from 'react';
import { ERC20_ADDRESS, ERC20_ABI } from '@/app/constants/token';

export default function TokenTransfer() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !amount) return;

    writeContract({
      address: ERC20_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to as `0x${string}`, parseUnits(amount, 18)],
    });
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="font-bold text-gray-700 mb-2">5. ERC20 代币转账</h3>
      <form onSubmit={handleTransfer} className="space-y-3">
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="接收地址 (0x...)" 
          className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" 
          required 
        />
        <input 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="转账数量" 
          type="number"
          className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" 
          required 
        />
        <button 
          disabled={isPending || isConfirming} 
          type="submit" 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded transition-colors disabled:bg-gray-300"
        >
          {isPending ? '请在钱包确认...' : isConfirming ? '交易确认中...' : '转账代币'}
        </button>
      </form>

      {error && <p className="text-xs text-red-500 mt-2">错误: {error.message.split('\n')[0]}</p>}
      {isSuccess && (
        <div className="mt-2 p-2 bg-green-50 rounded">
          <p className="text-xs text-green-600 font-medium">转账提交成功！</p>
          <p className="text-[10px] text-gray-500">正在等待区块确认，您可以观察上方监听器。</p>
        </div>
      )}
    </div>
  );
}

