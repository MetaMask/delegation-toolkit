import { IdEnforcer } from '@metamask/delegation-abis';
import type { Client } from 'viem';
import { readContract } from 'viem/actions';

export type ReadGetIsUsedParameters = {
  client: Client;
  contractAddress: `0x${string}`;
  delegationManager: `0x${string}`;
  delegator: `0x${string}`;
  id: bigint;
};

export const read = async ({
  client,
  contractAddress,
  delegationManager,
  delegator,
  id,
}: ReadGetIsUsedParameters) => {
  const isUsed = await readContract(client, {
    address: contractAddress,
    abi: IdEnforcer.abi,
    functionName: 'getIsUsed',
    args: [delegationManager, delegator, id],
  });

  return isUsed;
};
