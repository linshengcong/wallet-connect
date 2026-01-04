'use client';
import { useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { ERC20_ADDRESS, ERC20_ABI } from '@/app/constants/token';
import { formatUnits } from 'viem';

type TransferEvent = {
  from: string;
  to: string;
  value: bigint;
  transactionHash: string;
};

export default function TransferListener() {
  const [events, setEvents] = useState<TransferEvent[]>([]);

  useWatchContractEvent({
    address: ERC20_ADDRESS,
    abi: ERC20_ABI,
    eventName: 'Transfer',
    onLogs(logs) {
      const newEvents = logs.map((log) => {
        // 由于使用了 as const ABI，这里可以自动推导类型
        const { from, to, value } = log.args;
        return {
          from: from || '',
          to: to || '',
          value: value || 0n,
          transactionHash: log.transactionHash,
        };
      });
      setEvents((prev) => [...newEvents, ...prev].slice(0, 5));
    },
  });

  return (
    <div className="p-4 border rounded shadow-sm bg-white overflow-hidden">
      <h3 className="font-bold text-gray-700 mb-2">4. 监听 Transfer 事件</h3>
      <div className="space-y-2">
        {events.length === 0 ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <p className="text-xs text-gray-500">正在实时监听链上事件...</p>
          </div>
        ) : (
          events.map((event, i) => (
            <div key={i} className="text-[10px] p-2 bg-gray-50 rounded border-l-2 border-blue-400">
              <div className="flex justify-between font-medium text-gray-600 mb-1">
                <span>转账: {formatUnits(event.value, 18)} Tokens</span>
              </div>
              <p className="truncate">From: {event.from}</p>
              <p className="truncate">To: {event.to}</p>
              <a 
                href={`https://sepolia.etherscan.io/tx/${event.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                查看交易
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

