import { DeleGatorCore } from '@metamask/delegation-abis';
import type { Address, Client } from 'viem';
import { readContract } from 'viem/actions';

export type ReadGetDelegationManagerParameters = {
  client: Client;
  contractAddress: Address;
};

export const read = async ({
  client,
  contractAddress,
}: ReadGetDelegationManagerParameters) =>
  await readContract(client, {
    address: contractAddress,
    abi: DeleGatorCore.abi,
    functionName: 'delegationManager',
  });
