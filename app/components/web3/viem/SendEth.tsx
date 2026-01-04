'use client';
import { useViem } from '@/app/viemProvider';
import { parseEther, type Hash } from 'viem';
import { useState } from 'react';

export default function SendEth() {
  const { walletClient, publicClient, isConnected } = useViem();
  const [to, setTo] = useState('');
  const [value, setValue] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<Hash | ''>('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !value || !walletClient) return;

    try {
      setError(null);
      setIsSuccess(false);
      setHash('');
      setIsPending(true);

      // 发送交易
      const txHash = await walletClient.sendTransaction({
        to: to as `0x${string}`,
        value: parseEther(value)
      });

      setIsPending(false);
      setIsConfirming(true);
      setHash(txHash);

      // 等待交易确认
      await publicClient.waitForTransactionReceipt({ hash: txHash });

      setIsConfirming(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Transaction error:', err);
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 border rounded shadow-sm bg-white">
        <h3 className="font-bold text-gray-700 mb-2">2. 发送 ETH</h3>
        <p className="text-sm text-gray-500">请先连接钱包</p>
      </div>
    );
  }

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
          disabled={isPending || isConfirming}
        />
        <input 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="金额 (ETH)" 
          type="number"
          step="0.0001"
          className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
          required
          disabled={isPending || isConfirming}
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

