import { useState, useEffect } from 'react';
import { useEthersContract } from './useEthersContract';

export function useEthersReadContract<T = any>({ 
  address, 
  abi, 
  functionName, 
  args = [],  // ✅ 在解构时设置默认值
  options 
}: {
  address: string;
  abi: any;
  functionName: string;
  args?: any[];  // ✅ 改为可选参数
  options?: { enabled?: boolean; watch?: boolean };
}){
  const { enabled = true, watch = false } = options || {};
  const contract = useEthersContract(address, abi, false);
  
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contract || !enabled) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await contract[functionName](...args);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // ✅ 如果开启 watch，监听区块更新
    if (watch && contract.runner) {
      const provider = contract.runner.provider;
      if (provider) {
        provider.on('block', fetchData);
        return () => {
          isMounted = false;
          provider.off('block', fetchData);
        };
      }
    }

    return () => {
      isMounted = false;
    };
  }, [contract, functionName, enabled, watch, ...args]);

  return { data, isLoading, error, refetch: () => {} };
}