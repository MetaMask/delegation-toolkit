import type { Address, Client } from 'viem';
import { encodeFunctionData } from 'viem';
import { simulateContract, writeContract } from 'viem/actions';

import type { InitializedClient } from '../../types';

const UnpauseAbi = [
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
];

export type SimulateUnpauseParameters = {
  client: Client;
  contractAddress: Address;
};

export type ExecuteUnpauseParameters = {
  client: InitializedClient;
  contractAddress: Address;
};

export const simulate = async ({
  client,
  contractAddress,
}: SimulateUnpauseParameters) => {
  return simulateContract(client, {
    address: contractAddress,
    abi: UnpauseAbi,
    functionName: 'unpause',
  });
};

export const execute = async ({
  client,
  contractAddress,
}: ExecuteUnpauseParameters) => {
  const { request } = await simulate({
    client,
    contractAddress,
  });
  return writeContract(client, request);
};

export const encode = () => {
  return encodeFunctionData({
    abi: UnpauseAbi,
    functionName: 'unpause',
  });
};
