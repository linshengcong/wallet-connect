'use client';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useState } from 'react';

export default function SendEth() {
  const { data: hash, sendTransaction, isPending, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !value) return;
    sendTransaction({ 
      to: to as `0x${string}`, 
      value: parseEther(value) 
    });
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="font-bold text-gray-700 mb-2">2. 发送 ETH</h3>
      <form onSubmit={handleSend} className="space-y-3">
        <input 
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="接收地址 (0x...)" 
          className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          required 
        />
        <input 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="金额 (ETH)" 
          type="number"
          step="0.0001"
          className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          required 
        />
        <button 
          disabled={isPending || isConfirming} 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors disabled:bg-gray-300"
        >
          {isPending ? '请在钱包确认...' : isConfirming ? '交易确认中...' : '发送 ETH'}
        </button>
      </form>
      
      {error && <p className="text-xs text-red-500 mt-2">错误: {error.message.split('\n')[0]}</p>}
      {isSuccess && (
        <div className="mt-2 p-2 bg-green-50 rounded">
          <p className="text-xs text-green-600 font-medium">发送成功！</p>
          <a 
            href={`https://sepolia.etherscan.io/tx/${hash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-blue-500 underline break-all"
          >
            在 Etherscan 查看
          </a>
        </div>
      )}
    </div>
  );
}

