import type { Client, Address } from 'viem';
import { readContract } from 'viem/actions';

// NOTE: ABIs have been extracted and minimized for reuse across contracts. These methods are included in our contracts but are not a part of the EIP712 standard itself.

export type ReadGetDomainVersionParameters = {
  client: Client;
  contractAddress: Address;
};

export const read = async ({
  client,
  contractAddress,
}: ReadGetDomainVersionParameters) =>
  await readContract(client, {
    address: contractAddress,
    abi: [
      {
        type: 'function',
        name: 'DOMAIN_VERSION',
        inputs: [],
        outputs: [
          {
            name: '',
            type: 'string',
            internalType: 'string',
          },
        ],
        stateMutability: 'view',
      },
    ],
    functionName: 'DOMAIN_VERSION',
  });
