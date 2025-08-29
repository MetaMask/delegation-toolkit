import { LimitedCallsEnforcer } from '@metamask/delegation-abis';
import type { Address, Client, Hex } from 'viem';
import { readContract } from 'viem/actions';

export type ReadCallCountsParameters = {
  client: Client;
  contractAddress: Address;
  delegationManager: Address;
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
