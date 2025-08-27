import { SpecificActionERC20TransferBatchEnforcer } from '@metamask/delegation-abis';
import type { Client, Hex } from 'viem';
import { readContract } from 'viem/actions';

export type ReadGetTermsInfoParameters = {
  client: Client;
  contractAddress: `0x${string}`;
  terms: Hex;
};

export type TermsData = {
  tokenAddress: `0x${string}`;
  recipient: `0x${string}`;
  amount: bigint;
  firstTarget: `0x${string}`;
  firstCalldata: Hex;
};

export const read = async ({
  client,
  contractAddress,
  terms,
}: ReadGetTermsInfoParameters): Promise<TermsData> => {
  const termsData = await readContract(client, {
    address: contractAddress,
    abi: SpecificActionERC20TransferBatchEnforcer.abi,
    functionName: 'getTermsInfo',
    args: [terms],
  });

  return termsData as TermsData;
};
