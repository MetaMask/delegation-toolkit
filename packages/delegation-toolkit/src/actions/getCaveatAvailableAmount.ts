import type { Address, Hex, PublicClient } from 'viem';

import { getDelegationHashOffchain } from '../delegation';
import * as ERC20PeriodTransferEnforcer from '../DelegationFramework/ERC20PeriodTransferEnforcer';
import * as ERC20StreamingEnforcer from '../DelegationFramework/ERC20StreamingEnforcer';
import * as MultiTokenPeriodEnforcer from '../DelegationFramework/MultiTokenPeriodEnforcer';
import * as NativeTokenPeriodTransferEnforcer from '../DelegationFramework/NativeTokenPeriodTransferEnforcer';
import * as NativeTokenStreamingEnforcer from '../DelegationFramework/NativeTokenStreamingEnforcer';
import type { DeleGatorEnvironment, Delegation } from '../types';

/**
 * Parameters for all caveat enforcer actions.
 */
export type CaveatEnforcerParams = {
  delegation: Delegation;
};

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
 * Finds a caveat that matches the specified enforcer address.
 * @param delegation - The delegation to search.
 * @param enforcerAddress - The enforcer address to match.
 * @returns The matching caveat.
 * @throws Error if no matching caveat is found.
 * @throws Error if multiple matching caveats are found.
 */
function findMatchingCaveat({
  delegation,
  enforcerAddress,
  enforcerName,
}: {
  delegation: Delegation;
  enforcerAddress: Address;
  enforcerName: keyof DeleGatorEnvironment['caveatEnforcers'];
}): { terms: Hex; args: Hex } {
  const matchingCaveats = delegation.caveats.filter(
    (caveat) => caveat.enforcer.toLowerCase() === enforcerAddress.toLowerCase(),
  );

  if (matchingCaveats.length === 0) {
    throw new Error(`No caveat found with enforcer matching ${enforcerName}`);
  }

  if (matchingCaveats.length > 1) {
    throw new Error(
      `Multiple caveats found with enforcer matching ${enforcerName}`,
    );
  }

  const [{ terms, args }] = matchingCaveats as unknown as [
    { terms: Hex; args: Hex },
  ];

  return {
    terms,
    args,
  };
}

/**
 * Gets the delegation manager address from environment.
 *
 * @param environment - The delegator environment.
 * @returns The delegation manager address.
 */
function getDelegationManager(environment: DeleGatorEnvironment): Address {
  if (!environment.DelegationManager) {
    throw new Error('Delegation manager address not found');
  }

  return environment.DelegationManager;
}

/**
 * Gets the enforcer address from environment.
 *
 * @param enforcerName - The name of the enforcer.
 * @param environment - The delegator environment.
 * @returns The enforcer address.
 */
function getEnforcerAddress({
  enforcerName,
  environment,
}: {
  enforcerName: keyof DeleGatorEnvironment['caveatEnforcers'];
  environment: DeleGatorEnvironment;
}): Address {
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
  params: CaveatEnforcerParams,
): Promise<PeriodTransferResult> {
  const enforcerName = 'ERC20PeriodTransferEnforcer';

  const delegationManager = getDelegationManager(environment);
  const enforcerAddress = getEnforcerAddress({
    enforcerName,
    environment,
  });

  const delegationHash = getDelegationHashOffchain(params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName,
  });

  return ERC20PeriodTransferEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationHash,
    delegationManager,
    terms,
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
  params: CaveatEnforcerParams,
): Promise<StreamingResult> {
  const enforcerName = 'ERC20StreamingEnforcer';
  const delegationManager = getDelegationManager(environment);
  const enforcerAddress = getEnforcerAddress({
    enforcerName,
    environment,
  });

  const delegationHash = getDelegationHashOffchain(params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName,
  });

  return ERC20StreamingEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationManager,
    delegationHash,
    terms,
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
  params: CaveatEnforcerParams,
): Promise<PeriodTransferResult> {
  const enforcerName = 'MultiTokenPeriodEnforcer';
  const delegationManager = getDelegationManager(environment);
  const enforcerAddress = getEnforcerAddress({
    enforcerName,
    environment,
  });

  const delegationHash = getDelegationHashOffchain(params.delegation);
  const { terms, args } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName,
  });

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
  params: CaveatEnforcerParams,
): Promise<PeriodTransferResult> {
  const enforcerName = 'NativeTokenPeriodTransferEnforcer';
  const delegationManager = getDelegationManager(environment);
  const enforcerAddress = getEnforcerAddress({
    enforcerName,
    environment,
  });

  const delegationHash = getDelegationHashOffchain(params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName,
  });

  return NativeTokenPeriodTransferEnforcer.read.getAvailableAmount({
    client,
    contractAddress: enforcerAddress,
    delegationHash,
    delegationManager,
    terms,
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
  params: CaveatEnforcerParams,
): Promise<StreamingResult> {
  const enforcerName = 'NativeTokenStreamingEnforcer';
  const delegationManager = getDelegationManager(environment);
  const enforcerAddress = getEnforcerAddress({
    enforcerName,
    environment,
  });

  const delegationHash = getDelegationHashOffchain(params.delegation);
  const { terms } = findMatchingCaveat({
    delegation: params.delegation,
    enforcerAddress,
    enforcerName,
  });

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
      params: CaveatEnforcerParams,
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
      params: CaveatEnforcerParams,
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
      params: CaveatEnforcerParams,
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
      params: CaveatEnforcerParams,
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
      params: CaveatEnforcerParams,
    ): Promise<StreamingResult> => {
      return getNativeTokenStreamingEnforcerAvailableAmount(
        client,
        environment,
        params,
      );
    },
  });
