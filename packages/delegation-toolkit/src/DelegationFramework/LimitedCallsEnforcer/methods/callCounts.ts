import { LimitedCallsEnforcer } from '@metamask/delegation-abis';
import type { Client, Hex } from 'viem';
import { readContract } from 'viem/actions';

export type ReadCallCountsParameters = {
  client: Client;
  contractAddress: `0x${string}`;
  delegationManager: `0x${string}`;
  delegationHash: Hex;
};

export const read = async ({
  client,
  contractAddress,
  delegationManager,
  delegationHash,
}: ReadCallCountsParameters) => {
  const count = await readContract(client, {
    address: contractAddress,
    abi: LimitedCallsEnforcer.abi,
    functionName: 'callCounts',
    args: [delegationManager, delegationHash],
  });

  return count;
};
