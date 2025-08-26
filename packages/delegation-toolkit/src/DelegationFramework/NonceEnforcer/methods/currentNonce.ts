import { NonceEnforcer } from '@metamask/delegation-abis';
import type { Client } from 'viem';
import { readContract } from 'viem/actions';

export type ReadCurrentNonceParameters = {
  client: Client;
  contractAddress: `0x${string}`;
  delegationManager: `0x${string}`;
  delegator: `0x${string}`;
};

export const read = async ({
  client,
  contractAddress,
  delegationManager,
  delegator,
}: ReadCurrentNonceParameters) => {
  const nonce = await readContract(client, {
    address: contractAddress,
    abi: NonceEnforcer.abi,
    functionName: 'currentNonce',
    args: [delegationManager, delegator],
  });

  return nonce;
};
