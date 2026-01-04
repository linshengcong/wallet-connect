import { useState, useCallback } from 'react';
import { useEthersContract } from './useEthersContract';

// ✅ 只接收 address 和 abi，不接收 functionName 和 args
export function useEthersWriteContract(address: string, abi: any) {
  const contract = useEthersContract(address, abi, true); // ✅ 使用 signer
  
  const [hash, setHash] = useState<string>('');
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ✅ writeContract 接收 functionName 和 args
  const writeContract = useCallback(async (
    functionName: string,
    args: any[]
  ) => {
    if (!contract) {
      setError(new Error('Contract not initialized'));
      return;
    }

    try {
      setError(null);
      setIsSuccess(false);
      setHash('');
      setIsPending(true);

      console.log('Calling contract function:', functionName, 'with args:', args);

      // 调用合约函数
      const tx = await contract[functionName](...args);
      
      console.log('Transaction sent:', tx.hash);
      
      setIsPending(false);
      setIsConfirming(true);
      setHash(tx.hash);

      // 等待确认
      const receipt = await tx.wait();
      
      console.log('Transaction confirmed:', receipt);
      
      setIsConfirming(false);
      setIsSuccess(true);
      
      return tx;
    } catch (err: any) {
      console.error('Write contract error:', err);
      
      // ✅ 友好的错误提示
      let errorMessage = err.message;
      if (err.code === 'ACTION_REJECTED') {
        errorMessage = '用户取消了交易';
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = '余额不足';
      }
      
      setError(new Error(errorMessage));
      setIsPending(false);
      setIsConfirming(false);
    }
  }, [contract]);

  const reset = useCallback(() => {
    setHash('');
    setIsPending(false);
    setIsConfirming(false);
    setIsSuccess(false);
    setError(null);
  }, []);

  return {
    writeContract,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset
  };
}