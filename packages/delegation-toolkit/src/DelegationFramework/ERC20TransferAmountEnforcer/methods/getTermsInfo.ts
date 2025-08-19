import { ERC20TransferAmountEnforcer } from '@metamask/delegation-abis';
import type { Address, Client, Hex } from 'viem';
import { readContract } from 'viem/actions';

export type ReadGetTermsInfoParameters = {
  client: Client;
  contractAddress: Address;
  terms: Hex;
};

export const read = async ({
  client,
  contractAddress,
  terms,
}: ReadGetTermsInfoParameters) => {
  const [allowedContract, maxTokens] = await readContract(client, {
    address: contractAddress,
    abi: ERC20TransferAmountEnforcer.abi,
    functionName: 'getTermsInfo',
    args: [terms],
  });

  return {
    allowedContract,
    maxTokens,
  };
};
