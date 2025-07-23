import { ERC20StreamingEnforcer } from '@metamask/delegation-abis';
import type { Address, Client, Hex } from 'viem';
import { readContract } from 'viem/actions';

export type ReadGetAvailableAmountParameters = {
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
}: ReadGetAvailableAmountParameters) => {
  const result = await readContract(client, {
    address: contractAddress,
    abi: ERC20StreamingEnforcer.abi,
    functionName: 'getAvailableAmount',
    args: [delegationManager, delegationHash],
  });

  return {
    availableAmount: result,
  };
};
