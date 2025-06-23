import { DelegationManager } from '@metamask/delegation-abis';
import type { Address, Client } from 'viem';
import { encodeFunctionData } from 'viem';
import { simulateContract, writeContract } from 'viem/actions';

import { encodePermissionContexts } from '../../../delegation';
import { encodeExecutionCalldatas } from '../../../executions';
import type { ExecutionMode, ExecutionStruct } from '../../../executions';
import type { Delegation } from '../../../types';
import type { InitializedClient } from '../../types';
import type { NarrowAbiToFunction } from '../../utils';

export type EncodeRedeemDelegationsParameters = {
  delegations: Delegation[][];
  modes: ExecutionMode[];
  executions: ExecutionStruct[][];
};

export type SimulateRedeemDelegationsParameters = {
  client: Client;
  delegationManagerAddress: Address;
} & EncodeRedeemDelegationsParameters;

export type ExecuteRedeemDelegationsParameters = {
  client: InitializedClient;
  delegationManagerAddress: Address;
} & EncodeRedeemDelegationsParameters;

export const simulate = async ({
  client,
  delegationManagerAddress,
  delegations,
  modes,
  executions,
}: SimulateRedeemDelegationsParameters) => {
  const abi = DelegationManager.abi as any as NarrowAbiToFunction<
    typeof DelegationManager.abi,
    'redeemDelegations'
  >;

  return simulateContract(client, {
    address: delegationManagerAddress,
    abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts(delegations),
      modes,
      encodeExecutionCalldatas(executions),
    ],
  });
};

export const execute = async ({
  client,
  delegationManagerAddress,
  delegations,
  modes,
  executions,
}: ExecuteRedeemDelegationsParameters) => {
  const { request } = await simulate({
    client,
    delegationManagerAddress,
    delegations,
    modes,
    executions,
  });

  return writeContract(client, request);
};

export const encode = ({
  delegations,
  modes,
  executions,
}: EncodeRedeemDelegationsParameters) => {
  return encodeFunctionData({
    abi: DelegationManager.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts(delegations),
      modes,
      encodeExecutionCalldatas(executions),
    ],
  });
};
