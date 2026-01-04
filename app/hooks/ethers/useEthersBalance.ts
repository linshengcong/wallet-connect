import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useEthers } from '@/app/ethersProvider';

export function useEthersBalance(watchAddress?: string) {
  const { provider, address: connectedAddress } = useEthers();
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetAddress = watchAddress || connectedAddress;

  useEffect(() => {
    if (!provider || !targetAddress) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        const bal = await provider.getBalance(targetAddress);
        if (isMounted) {
          setBalance(ethers.formatEther(bal));
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    return () => {
      isMounted = false;
    };
  }, [provider, targetAddress]);

  return { balance, isLoading, error };
}