import { IdEnforcer } from '@metamask/delegation-abis';
import type { Client, Hex } from 'viem';
import { readContract } from 'viem/actions';

export type ReadGetTermsInfoParameters = {
  client: Client;
  contractAddress: `0x${string}`;
  terms: Hex;
};

export const read = async ({
  client,
  contractAddress,
  terms,
}: ReadGetTermsInfoParameters) => {
  const id = await readContract(client, {
    address: contractAddress,
    abi: IdEnforcer.abi,
    functionName: 'getTermsInfo',
    args: [terms],
  });

  return id;
};
