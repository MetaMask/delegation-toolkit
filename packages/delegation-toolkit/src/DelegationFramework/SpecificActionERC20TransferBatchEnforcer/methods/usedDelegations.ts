import { SpecificActionERC20TransferBatchEnforcer } from '@metamask/delegation-abis';
import type { Client, Hex } from 'viem';
import { readContract } from 'viem/actions';

export type ReadUsedDelegationsParameters = {
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
}: ReadUsedDelegationsParameters) => {
  const isUsed = await readContract(client, {
    address: contractAddress,
    abi: SpecificActionERC20TransferBatchEnforcer.abi,
    functionName: 'usedDelegations',
    args: [delegationManager, delegationHash],
  });

  return isUsed;
};
