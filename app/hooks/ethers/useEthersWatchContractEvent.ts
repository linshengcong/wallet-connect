import { useEffect, useRef } from 'react';
import { Contract } from 'ethers';
import { useEthers } from '@/app/ethersProvider';

type WatchContractEventParams = {
  address: string;
  abi: any;
  eventName: string;
  onLogs: (logs: any[]) => void;
};

export function useEthersWatchContractEvent({
  address,
  abi,
  eventName,
  onLogs,
}: WatchContractEventParams) {
  const { provider } = useEthers();
  const onLogsRef = useRef(onLogs);

  // 保持最新的回调引用
  useEffect(() => {
    onLogsRef.current = onLogs;
  }, [onLogs]);

  useEffect(() => {
    if (!provider) return;

    const contract = new Contract(address, abi, provider);

    // 事件处理函数
    const handleEvent = (...args: any[]) => {
      const event = args[args.length - 1]; // 最后一个参数是事件对象
      
      // 解析事件参数
      const parsedLog = contract.interface.parseLog({
        topics: event.log.topics,
        data: event.log.data,
      });

      // 构造 log 对象
      const log = {
        args: parsedLog?.args || {},
        transactionHash: event.log.transactionHash,
      };

      onLogsRef.current([log]);
    };

    // 监听事件
    contract.on(eventName, handleEvent);

    // 清理
    return () => {
      contract.off(eventName, handleEvent);
    };
  }, [provider, address, eventName, abi]);
}