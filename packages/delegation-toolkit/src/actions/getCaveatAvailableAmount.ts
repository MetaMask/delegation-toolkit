import type { Address, Hex, PublicClient } from 'viem';

import * as ERC20PeriodTransferEnforcer from '../DelegationFramework/ERC20PeriodTransferEnforcer';
import * as ERC20StreamingEnforcer from '../DelegationFramework/ERC20StreamingEnforcer';
import * as MultiTokenPeriodEnforcer from '../DelegationFramework/MultiTokenPeriodEnforcer';
import * as NativeTokenPeriodTransferEnforcer from '../DelegationFramework/NativeTokenPeriodTransferEnforcer';
import * as NativeTokenStreamingEnforcer from '../DelegationFramework/NativeTokenStreamingEnforcer';
import type { DeleGatorEnvironment } from '../types';

/**
 * Configuration for caveat enforcer client
 */
export type CaveatEnforcerClientConfig = {
  environment: DeleGatorEnvironment;
};

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
 * @param config - The configuration for caveat enforcers.
 * @param params - The parameters for the ERC20 period transfer enforcer.
 * @returns Promise resolving to the period transfer result.
 */
export async function getErc20PeriodTransferEnforcerAvailableAmount(
  client: PublicClient,
  config: CaveatEnforcerClientConfig,
  params: ERC20PeriodTransferParams,
): Promise<PeriodTransferResult> {
  const delegationManager = resolveDelegationManager(
    params,
    config.environment,
  );
  const enforcerAddress = resolveEnforcerAddress(
    'ERC20PeriodTransferEnforcer',
    params,
    config.environment,
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
 * @param config - The configuration for caveat enforcers.
 * @param params - The parameters for the ERC20 streaming enforcer.
 * @returns Promise resolving to the streaming result.
 */
export async function getErc20StreamingEnforcerAvailableAmount(
  client: PublicClient,
  config: CaveatEnforcerClientConfig,
  params: ERC20StreamingParams,
): Promise<StreamingResult> {
  const delegationManager = resolveDelegationManager(
    params,
    config.environment,
  );
  const enforcerAddress = resolveEnforcerAddress(
    'ERC20StreamingEnforcer',
    params,
    config.environment,
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
 * @param config - The configuration for caveat enforcers.
 * @param params - The parameters for the multi-token period enforcer.
 * @returns Promise resolving to the period transfer result.
 */
export async function getMultiTokenPeriodEnforcerAvailableAmount(
  client: PublicClient,
  config: CaveatEnforcerClientConfig,
  params: MultiTokenPeriodParams,
): Promise<PeriodTransferResult> {
  const delegationManager = resolveDelegationManager(
    params,
    config.environment,
  );
  const enforcerAddress = resolveEnforcerAddress(
    'MultiTokenPeriodEnforcer',
    params,
    config.environment,
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
 * @param config - The configuration for caveat enforcers.
 * @param params - The parameters for the native token period transfer enforcer.
 * @returns Promise resolving to the period transfer result.
 */
export async function getNativeTokenPeriodTransferEnforcerAvailableAmount(
  client: PublicClient,
  config: CaveatEnforcerClientConfig,
  params: NativeTokenPeriodTransferParams,
): Promise<PeriodTransferResult> {
  const delegationManager = resolveDelegationManager(
    params,
    config.environment,
  );
  const enforcerAddress = resolveEnforcerAddress(
    'NativeTokenPeriodTransferEnforcer',
    params,
    config.environment,
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
 * @param config - The configuration for caveat enforcers.
 * @param params - The parameters for the native token streaming enforcer.
 * @returns Promise resolving to the streaming result.
 */
export async function getNativeTokenStreamingEnforcerAvailableAmount(
  client: PublicClient,
  config: CaveatEnforcerClientConfig,
  params: NativeTokenStreamingParams,
): Promise<StreamingResult> {
  const delegationManager = resolveDelegationManager(
    params,
    config.environment,
  );
  const enforcerAddress = resolveEnforcerAddress(
    'NativeTokenStreamingEnforcer',
    params,
    config.environment,
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
 * Caveat enforcer actions for extending viem clients.
 *
 * @param params - The parameters object.
 * @param params.client - The viem public client.
 * @param params.config - The configuration for caveat enforcers.
 * @returns The client extension with caveat enforcer actions.
 */
export const caveatEnforcerActions = ({
  client,
  config,
}: {
  client: PublicClient;
  config: CaveatEnforcerClientConfig;
}) => ({
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
      config,
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
    return getErc20StreamingEnforcerAvailableAmount(client, config, params);
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
    return getMultiTokenPeriodEnforcerAvailableAmount(client, config, params);
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
      config,
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
      config,
      params,
    );
  },
});

/**
 * Type for client extended with caveat enforcer actions.
 */
export type CaveatEnforcerClient = PublicClient &
  ReturnType<typeof caveatEnforcerActions>;

/**
 * Create a viem client extended with caveat enforcer actions.
 *
 * @param params - The parameters object.
 * @param params.client - The viem public client.
 * @param params.config - The configuration for caveat enforcers.
 * @returns The extended client with caveat enforcer actions.
 */
export function createCaveatEnforcerClient({
  client,
  config,
}: {
  client: PublicClient;
  config: CaveatEnforcerClientConfig;
}): CaveatEnforcerClient {
  return client.extend((extendedClient) =>
    caveatEnforcerActions({ client: extendedClient, config }),
  );
}
