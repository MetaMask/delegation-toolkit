import { DelegationManager } from '@metamask/delegation-abis';
import type { Address, Client } from 'viem';
import { encodeFunctionData } from 'viem';
import { simulateContract, writeContract } from 'viem/actions';

import { toDelegationStruct } from '../../../delegation';
import type { Delegation } from '../../../types';
import type { InitializedClient } from '../../types';
import type { NarrowAbiToFunction } from '../../utils';

export type EncodeEnableDelegationParameters = {
  delegation: Delegation;
};

export type SimulateEnableDelegationParameters = {
  client: Client;
  delegationManagerAddress: Address;
} & EncodeEnableDelegationParameters;

export type ExecuteEnableDelegationParameters = {
  client: InitializedClient;
  delegationManagerAddress: Address;
} & EncodeEnableDelegationParameters;

export const simulate = async ({
  client,
  delegationManagerAddress,
  delegation,
}: SimulateEnableDelegationParameters) => {
  const abi = DelegationManager.abi as any as NarrowAbiToFunction<
    typeof DelegationManager.abi,
    'enableDelegation'
  >;

  const delegationStruct = toDelegationStruct(delegation);

  return simulateContract(client, {
    address: delegationManagerAddress,
    abi,
    functionName: 'enableDelegation',
    args: [delegationStruct],
  });
};

export const execute = async ({
  client,
  delegationManagerAddress,
  delegation,
}: ExecuteEnableDelegationParameters) => {
  const { request } = await simulate({
    client,
    delegationManagerAddress,
    delegation,
  });

  return writeContract(client, request);
};

export const encode = ({ delegation }: EncodeEnableDelegationParameters) => {
  const delegationStruct = toDelegationStruct(delegation);

  return encodeFunctionData({
    abi: DelegationManager.abi,
    functionName: 'enableDelegation',
    args: [delegationStruct],
  });
};
