import { useMemo } from 'react';
import { Contract } from 'ethers';
import { useEthers } from '@/app/ethersProvider';

export function useEthersContract(
  address: string,
  abi: any[],
  withSigner = false
) {
  const { provider, signer } = useEthers();

  const contract = useMemo(() => {
    if (!provider) return null;
    
    // ✅ 自动选择：需要签名用 signer，否则用 provider
    const runner = withSigner && signer ? signer : provider;
    
    return new Contract(address, abi, runner);
  }, [address, abi, provider, signer, withSigner]);

  return contract;
}