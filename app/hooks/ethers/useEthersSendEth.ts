import { useEthers } from "@/app/ethersProvider";
import { ethers, parseEther } from "ethers";
import { useState } from "react";

export function useEthersSendEth() {
  const { signer, provider } = useEthers();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);

    const sendEth = async (to: string, value: string) => {
      if (!signer || !provider) return;
      setIsPending(true);
      setIsConfirming(false);
      setIsSuccess(false);
      setError(null);
      setHash(null);
      try {
        const tx = await signer.sendTransaction({ to: to as `0x${string}`, value: parseEther(value) as bigint });
        setHash(tx.hash as `0x${string}`);
        setIsConfirming(true);
        const receipt = await provider.waitForTransaction(tx.hash as `0x${string}`);
        console.log('receipt', receipt);
        setIsSuccess(true);
        const newBalance = await provider.getBalance(await signer.getAddress());
        console.log('newBalance', ethers.formatEther(newBalance));
      } catch (error) {
        console.error('error', error);
        setError(error as Error);
        setIsSuccess(false);
        setIsPending(false);
        setIsConfirming(false);
      } finally {
        setIsPending(false);
        setIsConfirming(false);
      }
    };

  return { sendEth, isPending, isConfirming, isSuccess, error, hash };
}