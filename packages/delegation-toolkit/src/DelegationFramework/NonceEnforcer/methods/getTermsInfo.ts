import { NonceEnforcer } from '@metamask/delegation-abis';
import type { Address, Client, Hex } from 'viem';
import { readContract } from 'viem/actions';

export type ReadGetTermsInfoParameters = {
  client: Client;
  contractAddress: Address;
  terms: Hex;
};

export const read = async ({
  client,
  contractAddress,
  terms,
}: ReadGetTermsInfoParameters) => {
  const nonce = await readContract(client, {
    address: contractAddress,
    abi: NonceEnforcer.abi,
    functionName: 'getTermsInfo',
    args: [terms],
  });

  return nonce;
};
