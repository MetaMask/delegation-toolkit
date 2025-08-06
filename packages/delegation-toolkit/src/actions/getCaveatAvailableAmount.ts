import type { Address, Hex, PublicClient } from 'viem';

import * as ERC20PeriodTransferEnforcer from '../DelegationFramework/ERC20PeriodTransferEnforcer';
import * as ERC20StreamingEnforcer from '../DelegationFramework/ERC20StreamingEnforcer';
import * as MultiTokenPeriodEnforcer from '../DelegationFramework/MultiTokenPeriodEnforcer';
import * as NativeTokenPeriodTransferEnforcer from '../DelegationFramework/NativeTokenPeriodTransferEnforcer';
import * as NativeTokenStreamingEnforcer from '../DelegationFramework/NativeTokenStreamingEnforcer';
import { hashDelegation } from '@metamask/delegation-core';
import type { DeleGatorEnvironment, Delegation } from '../types';

/**
 * Shared base params for all enforcer actions
 */
export type BaseCaveatParams = {
  delegationHash: Hex;
  delegationManager?: Address;
  enforcerAddress?: Address;
  terms: Hex;
};

/**
 * Parameters for ERC20 period transfer enforcer.
 */
export type ERC20PeriodTransferParams = BaseCaveatParams;

/**
 * Parameters for ERC20 streaming enforcer.
 */
export type ERC20StreamingParams = BaseCaveatParams;

/**
 * Parameters for MultiTokenPeriodEnforcer.
 */
export type MultiTokenPeriodParams = {
  args: Hex;
} & BaseCaveatParams;

/**
 * Parameters for native token period transfer enforcer.
 */
export type NativeTokenPeriodTransferParams = BaseCaveatParams;

/**
 * Parameters for native token streaming enforcer.
 */
export type NativeTokenStreamingParams = BaseCaveatParams;

/**
 * New parameter types that accept the entire delegation
 */
export type BaseDelegationParams = {
  delegation: Delegation;
  delegationManager?: Address;
  enforcerAddress?: Address;
};

export type ERC20PeriodTransferDelegationParams = BaseDelegationParams;
export type ERC20StreamingDelegationParams = BaseDelegationParams;
export type MultiTokenPeriodDelegationParams = BaseDelegationParams;
export type NativeTokenPeriodTransferDelegationParams = BaseDelegationParams;
export type NativeTokenStreamingDelegationParams = BaseDelegationParams;

/**
 * Return type for period-based transfer enforcers
 */
export type PeriodTransferResult = {
  availableAmount: bigint;
  isNewPeriod: boolean;
  currentPeriod: bigint;
};

/**
 * Return type for streaming enforcers
 */
export type StreamingResult = {
  availableAmount: bigint;
};

/**
 * Error thrown when no matching caveat is found
 */
export class NoMatchingCaveatError extends Error {
  constructor(enforcerName: string) {
    super(`No caveat found with enforcer matching ${enforcerName}`);
    this.name = 'NoMatchingCaveatError';
  }
}

/**
 * Error thrown when multiple matching caveats are found
 */
export class MultipleMatchingCaveatsError extends Error {
  constructor(enforcerName: string) {
    super(`Multiple caveats found with enforcer matching ${enforcerName}`);
    this.name = 'MultipleMatchingCaveatsError';
  }
}

/**
 * Finds a caveat that matches the specified enforcer address
 * @param delegation - The delegation to search
 * @param enforcerAddress - The enforcer address to match
 * @returns The matching caveat
 * @throws NoMatchingCaveatError if no matching caveat is found
 * @throws MultipleMatchingCaveatsError if multiple matching caveats are found
 */
function findMatchingCaveat(
  delegation: Delegation,
  enforcerAddress: Address,
): { terms: Hex; args: Hex } {
  const matchingCaveats = delegation.caveats.filter(
    (caveat) => caveat.enforcer.toLowerCase() === enforcerAddress.toLowerCase(),
  );

  if (matchingCaveats.length === 0) {
    throw new NoMatchingCaveatError(enforcerAddress);
  }

  if (matchingCaveats.length > 1) {
    throw new MultipleMatchingCaveatsError(enforcerAddress);
  }

  return {
    terms: matchingCaveats[0].terms,
    args: matchingCaveats[0].args,
  };
}

/**
 * Resolves the delegation manager address from parameters or environment.
 *
 * @param params - The parameters object.
 * @param params.delegationManager - The delegation manager address.
 * @param environment - The delegator environment.
 * @returns The resolved delegation manager address.
 */
function resolveDelegationManager(
  params: { delegationManager?: Address },
  environment: DeleGatorEnvironment,
): Address {
  const delegationManager =
    params.delegationManager ?? environment.DelegationManager;

  if (!delegationManager) {
    throw new Error('Delegation manager address not found');
  }

  return delegationManager;
}

/**
 * Resolves the enforcer address from parameters or environment.
 *
 * @param enforcerName - The name of the enforcer.
 * @param params - The parameters object.
 * @param params.enforcerAddress - The enforcer address.
 * @param environment - The delegator environment.
 * @returns The resolved enforcer address.
 */
function resolveEnforcerAddress(
  enforcerName: keyof DeleGatorEnvironment['caveatEnforcers'],
  params: { enforcerAddress?: Address },
  environment: DeleGatorEnvironment,
): Address {
  if (params.enforcerAddress) {
    return params.enforcerAddress;
  }

  const enforcerAddress = environment.caveatEnforcers[enforcerName];
  if (!enforcerAddress) {
    throw new Error(`${enforcerName} not found in environment`);
  }

  return enforcerAddress;
}

/**
 * Get available amount for ERC20 period transfer enforcer.
 *
 * @param client - The viem public client.
 * @param environment - The delegator environment.
 * @param params - The parameters for the ERC20 period transfer enforcer.
 * @returns Promise resolving to the period transfer result.
 */
export async function getErc20PeriodTransferEnforcerAvailableAmount(
  client: PublicClient,
  environment: DeleGatorEnvironment,
  params: ERC20PeriodTransferParams,
): Promise<PeriodTransferResult> {
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'ERC20PeriodTransferEnforcer',
    params,
    environment,
  );

  return ERC20PeriodTransferEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationHash: params.delegationHash,
    delegationManager,
    terms: params.terms,
  });
}

/**
 * Get available amount for ERC20 streaming enforcer.
 *
 * @param client - The viem public client.
 * @param environment - The delegator environment.
 * @param params - The parameters for the ERC20 streaming enforcer.
 * @returns Promise resolving to the streaming result.
 */
export async function getErc20StreamingEnforcerAvailableAmount(
  client: PublicClient,
  environment: DeleGatorEnvironment,
  params: ERC20StreamingParams,
): Promise<StreamingResult> {
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'ERC20StreamingEnforcer',
    params,
    environment,
  );

  return ERC20StreamingEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationManager,
    delegationHash: params.delegationHash,
    terms: params.terms,
  });
}

/**
 * Get available amount for multi-token period enforcer.
 *
 * @param client - The viem public client.
 * @param environment - The delegator environment.
 * @param params - The parameters for the multi-token period enforcer.
 * @returns Promise resolving to the period transfer result.
 */
export async function getMultiTokenPeriodEnforcerAvailableAmount(
  client: PublicClient,
  environment: DeleGatorEnvironment,
  params: MultiTokenPeriodParams,
): Promise<PeriodTransferResult> {
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'MultiTokenPeriodEnforcer',
    params,
    environment,
  );

  return MultiTokenPeriodEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationHash: params.delegationHash,
    delegationManager,
    terms: params.terms,
    args: params.args,
  });
}

/**
 * Get available amount for native token period transfer enforcer.
 *
 * @param client - The viem public client.
 * @param environment - The delegator environment.
 * @param params - The parameters for the native token period transfer enforcer.
 * @returns Promise resolving to the period transfer result.
 */
export async function getNativeTokenPeriodTransferEnforcerAvailableAmount(
  client: PublicClient,
  environment: DeleGatorEnvironment,
  params: NativeTokenPeriodTransferParams,
): Promise<PeriodTransferResult> {
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'NativeTokenPeriodTransferEnforcer',
    params,
    environment,
  );

  return NativeTokenPeriodTransferEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationHash: params.delegationHash,
    delegationManager,
    terms: params.terms,
  });
}

/**
 * Get available amount for native token streaming enforcer.
 *
 * @param client - The viem public client.
 * @param environment - The delegator environment.
 * @param params - The parameters for the native token streaming enforcer.
 * @returns Promise resolving to the streaming result.
 */
export async function getNativeTokenStreamingEnforcerAvailableAmount(
  client: PublicClient,
  environment: DeleGatorEnvironment,
  params: NativeTokenStreamingParams,
): Promise<StreamingResult> {
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'NativeTokenStreamingEnforcer',
    params,
    environment,
  );

  return NativeTokenStreamingEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationManager,
    delegationHash: params.delegationHash,
    terms: params.terms,
  });
}

/**
 * Get available amount for ERC20 period transfer enforcer using delegation.
 *
 * @param client - The viem public client.
 * @param environment - The delegator environment.
 * @param params - The parameters for the ERC20 period transfer enforcer.
 * @returns Promise resolving to the period transfer result.
 */
export async function getErc20PeriodTransferEnforcerAvailableAmountFromDelegation(
  client: PublicClient,
  environment: DeleGatorEnvironment,
  params: ERC20PeriodTransferDelegationParams,
): Promise<PeriodTransferResult> {
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'ERC20PeriodTransferEnforcer',
    params,
    environment,
  );

  const delegationHash = hashDelegation(params.delegation);
  const { terms } = findMatchingCaveat(params.delegation, enforcerAddress);

  return ERC20PeriodTransferEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationHash,
    delegationManager,
    terms,
  });
}

/**
 * Get available amount for ERC20 streaming enforcer using delegation.
 *
 * @param client - The viem public client.
 * @param environment - The delegator environment.
 * @param params - The parameters for the ERC20 streaming enforcer.
 * @returns Promise resolving to the streaming result.
 */
export async function getErc20StreamingEnforcerAvailableAmountFromDelegation(
  client: PublicClient,
  environment: DeleGatorEnvironment,
  params: ERC20StreamingDelegationParams,
): Promise<StreamingResult> {
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'ERC20StreamingEnforcer',
    params,
    environment,
  );

  const delegationHash = hashDelegation(params.delegation);
  const { terms } = findMatchingCaveat(params.delegation, enforcerAddress);

  return ERC20StreamingEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationManager,
    delegationHash,
    terms,
  });
}

/**
 * Get available amount for multi-token period enforcer using delegation.
 *
 * @param client - The viem public client.
 * @param environment - The delegator environment.
 * @param params - The parameters for the multi-token period enforcer.
 * @returns Promise resolving to the period transfer result.
 */
export async function getMultiTokenPeriodEnforcerAvailableAmountFromDelegation(
  client: PublicClient,
  environment: DeleGatorEnvironment,
  params: MultiTokenPeriodDelegationParams,
): Promise<PeriodTransferResult> {
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'MultiTokenPeriodEnforcer',
    params,
    environment,
  );

  const delegationHash = hashDelegation(params.delegation);
  const { terms, args } = findMatchingCaveat(params.delegation, enforcerAddress);

  return MultiTokenPeriodEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationHash,
    delegationManager,
    terms,
    args,
  });
}

/**
 * Get available amount for native token period transfer enforcer using delegation.
 *
 * @param client - The viem public client.
 * @param environment - The delegator environment.
 * @param params - The parameters for the native token period transfer enforcer.
 * @returns Promise resolving to the period transfer result.
 */
export async function getNativeTokenPeriodTransferEnforcerAvailableAmountFromDelegation(
  client: PublicClient,
  environment: DeleGatorEnvironment,
  params: NativeTokenPeriodTransferDelegationParams,
): Promise<PeriodTransferResult> {
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'NativeTokenPeriodTransferEnforcer',
    params,
    environment,
  );

  const delegationHash = hashDelegation(params.delegation);
  const { terms } = findMatchingCaveat(params.delegation, enforcerAddress);

  return NativeTokenPeriodTransferEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationManager,
    delegationHash,
    terms,
  });
}

/**
 * Get available amount for native token streaming enforcer using delegation.
 *
 * @param client - The viem public client.
 * @param environment - The delegator environment.
 * @param params - The parameters for the native token streaming enforcer.
 * @returns Promise resolving to the streaming result.
 */
export async function getNativeTokenStreamingEnforcerAvailableAmountFromDelegation(
  client: PublicClient,
  environment: DeleGatorEnvironment,
  params: NativeTokenStreamingDelegationParams,
): Promise<StreamingResult> {
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'NativeTokenStreamingEnforcer',
    params,
    environment,
  );

  const delegationHash = hashDelegation(params.delegation);
  const { terms } = findMatchingCaveat(params.delegation, enforcerAddress);

  return NativeTokenStreamingEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationManager,
    delegationHash,
    terms,
  });
}

/**
 * Caveat enforcer actions for extending viem clients.
 *
 * @param params - The parameters object.
 * @param params.environment - The delegator environment.
 * @returns A function that takes a client and returns the client extension with caveat enforcer actions.
 */
export const caveatEnforcerActions =
  ({ environment }: { environment: DeleGatorEnvironment }) =>
  (client: PublicClient) => ({
    /**
     * Get available amount for ERC20 period transfer enforcer.
     *
     * @param params - The parameters for the ERC20 period transfer enforcer.
     * @returns Promise resolving to the period transfer result.
     */
    getErc20PeriodTransferEnforcerAvailableAmount: async (
      params: ERC20PeriodTransferParams,
    ): Promise<PeriodTransferResult> => {
      return getErc20PeriodTransferEnforcerAvailableAmount(
        client,
        environment,
        params,
      );
    },

    /**
     * Get available amount for ERC20 streaming enforcer.
     *
     * @param params - The parameters for the ERC20 streaming enforcer.
     * @returns Promise resolving to the streaming result.
     */
    getErc20StreamingEnforcerAvailableAmount: async (
      params: ERC20StreamingParams,
    ): Promise<StreamingResult> => {
      return getErc20StreamingEnforcerAvailableAmount(
        client,
        environment,
        params,
      );
    },

    /**
     * Get available amount for multi-token period enforcer.
     *
     * @param params - The parameters for the multi-token period enforcer.
     * @returns Promise resolving to the period transfer result.
     */
    getMultiTokenPeriodEnforcerAvailableAmount: async (
      params: MultiTokenPeriodParams,
    ): Promise<PeriodTransferResult> => {
      return getMultiTokenPeriodEnforcerAvailableAmount(
        client,
        environment,
        params,
      );
    },

    /**
     * Get available amount for native token period transfer enforcer.
     *
     * @param params - The parameters for the native token period transfer enforcer.
     * @returns Promise resolving to the period transfer result.
     */
    getNativeTokenPeriodTransferEnforcerAvailableAmount: async (
      params: NativeTokenPeriodTransferParams,
    ): Promise<PeriodTransferResult> => {
      return getNativeTokenPeriodTransferEnforcerAvailableAmount(
        client,
        environment,
        params,
      );
    },

    /**
     * Get available amount for native token streaming enforcer.
     *
     * @param params - The parameters for the native token streaming enforcer.
     * @returns Promise resolving to the streaming result.
     */
    getNativeTokenStreamingEnforcerAvailableAmount: async (
      params: NativeTokenStreamingParams,
    ): Promise<StreamingResult> => {
      return getNativeTokenStreamingEnforcerAvailableAmount(
        client,
        environment,
        params,
      );
    },

    /**
     * Get available amount for ERC20 period transfer enforcer using delegation.
     *
     * @param params - The parameters for the ERC20 period transfer enforcer.
     * @returns Promise resolving to the period transfer result.
     */
    getErc20PeriodTransferEnforcerAvailableAmountFromDelegation: async (
      params: ERC20PeriodTransferDelegationParams,
    ): Promise<PeriodTransferResult> => {
      return getErc20PeriodTransferEnforcerAvailableAmountFromDelegation(
        client,
        environment,
        params,
      );
    },

    /**
     * Get available amount for ERC20 streaming enforcer using delegation.
     *
     * @param params - The parameters for the ERC20 streaming enforcer.
     * @returns Promise resolving to the streaming result.
     */
    getErc20StreamingEnforcerAvailableAmountFromDelegation: async (
      params: ERC20StreamingDelegationParams,
    ): Promise<StreamingResult> => {
      return getErc20StreamingEnforcerAvailableAmountFromDelegation(
        client,
        environment,
        params,
      );
    },

    /**
     * Get available amount for multi-token period enforcer using delegation.
     *
     * @param params - The parameters for the multi-token period enforcer.
     * @returns Promise resolving to the period transfer result.
     */
    getMultiTokenPeriodEnforcerAvailableAmountFromDelegation: async (
      params: MultiTokenPeriodDelegationParams,
    ): Promise<PeriodTransferResult> => {
      return getMultiTokenPeriodEnforcerAvailableAmountFromDelegation(
        client,
        environment,
        params,
      );
    },

    /**
     * Get available amount for native token period transfer enforcer using delegation.
     *
     * @param params - The parameters for the native token period transfer enforcer.
     * @returns Promise resolving to the period transfer result.
     */
    getNativeTokenPeriodTransferEnforcerAvailableAmountFromDelegation: async (
      params: NativeTokenPeriodTransferDelegationParams,
    ): Promise<PeriodTransferResult> => {
      return getNativeTokenPeriodTransferEnforcerAvailableAmountFromDelegation(
        client,
        environment,
        params,
      );
    },

    /**
     * Get available amount for native token streaming enforcer using delegation.
     *
     * @param params - The parameters for the native token streaming enforcer.
     * @returns Promise resolving to the streaming result.
     */
    getNativeTokenStreamingEnforcerAvailableAmountFromDelegation: async (
      params: NativeTokenStreamingDelegationParams,
    ): Promise<StreamingResult> => {
      return getNativeTokenStreamingEnforcerAvailableAmountFromDelegation(
        client,
        environment,
        params,
      );
    },
  });

/**
 * Type for client extended with caveat enforcer actions.
 */
export type CaveatEnforcerClient = PublicClient &
  ReturnType<ReturnType<typeof caveatEnforcerActions>>;

/**
 * Create a viem client extended with caveat enforcer actions.
 *
 * @param params - The parameters object.
 * @param params.client - The viem public client.
 * @param params.environment - The delegator environment.
 * @returns The extended client with caveat enforcer actions.
 */
export function createCaveatEnforcerClient({
  client,
  environment,
}: {
  client: PublicClient;
  environment: DeleGatorEnvironment;
}): CaveatEnforcerClient {
  return client.extend(caveatEnforcerActions({ environment }));
}
