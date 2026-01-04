import { useEthers } from "@/app/ethersProvider";
import { useEffect, useState } from "react";

export function useEthersWaitForTransactionReceipt(hash: `0x${string}`) {
  const { provider } = useEthers();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const waitForTransactionReceipt = async () => {
    if (!provider || !hash) return;
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const receipt = await provider.waitForTransaction(hash as `0x${string}`);
      console.log('receipt', receipt);
      setIsSuccess(true);
    } catch (error) {
      console.error('error', error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (hash) {
      waitForTransactionReceipt();
    }
  }, [hash]);
  return { isLoading, isSuccess, waitForTransactionReceipt };
}