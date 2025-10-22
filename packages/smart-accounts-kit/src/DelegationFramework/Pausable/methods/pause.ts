import type { Address, Client } from 'viem';
import { encodeFunctionData } from 'viem';
import { simulateContract, writeContract } from 'viem/actions';

import type { InitializedClient } from '../../types';

const PauseAbi = [
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
];

export type SimulatePauseParameters = {
  client: Client;
  contractAddress: Address;
};

export type ExecutePauseParameters = {
  client: InitializedClient;
  contractAddress: Address;
};

export const simulate = async ({
  client,
  contractAddress,
}: SimulatePauseParameters) => {
  return simulateContract(client, {
    address: contractAddress,
    abi: PauseAbi,
    functionName: 'pause',
  });
};

export const execute = async ({
  client,
  contractAddress,
}: ExecutePauseParameters) => {
  const { request } = await simulate({
    client,
    contractAddress,
  });
  return writeContract(client, request);
};

export const encode = () => {
  return encodeFunctionData({
    abi: PauseAbi,
    functionName: 'pause',
  });
};
