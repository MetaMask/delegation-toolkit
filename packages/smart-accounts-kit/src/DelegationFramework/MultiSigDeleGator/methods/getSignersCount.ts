import { MultiSigDeleGator } from '@metamask/delegation-abis';
import type { Address, Client } from 'viem';
import { readContract } from 'viem/actions';

export type ReadGetSignersCountParameters = {
  client: Client;
  multiSigDeleGatorAddress: Address;
};

export const read = async ({
  client,
  multiSigDeleGatorAddress,
}: ReadGetSignersCountParameters) =>
  await readContract(client, {
    address: multiSigDeleGatorAddress,
    abi: MultiSigDeleGator.abi,
    functionName: 'getSignersCount',
  });
