import {
  ERC20PeriodTransferEnforcer,
  MultiTokenPeriodEnforcer,
  NativeTokenPeriodTransferEnforcer,
  ERC20StreamingEnforcer,
  NativeTokenStreamingEnforcer,
} from '@metamask/delegation-abis';
import type { Address, Hex, PublicClient, Client } from 'viem';

import { getDeleGatorEnvironment } from '../delegatorEnvironment';
import type { DeleGatorEnvironment } from '../types';

/**
 * Supported caveat enforcer names for getAvailableAmount queries
 */
export type CaveatEnforcerName =
  | 'ERC20PeriodTransferEnforcer'
  | 'MultiTokenPeriodEnforcer'
  | 'NativeTokenPeriodTransferEnforcer'
  | 'ERC20StreamingEnforcer'
  | 'NativeTokenStreamingEnforcer';

/**
 * Common parameters for all caveat enforcer queries
 */
export interface BaseCaveatParams {
  delegationHash: Hex;
  delegationManager?: Address;
  enforcerAddress?: Address;
}

/**
 * Parameters for period-based transfer enforcers
 */
export interface PeriodTransferParams extends BaseCaveatParams {
  terms: Hex;
}

/**
 * Parameters for MultiTokenPeriodEnforcer (requires additional args)
 */
export interface MultiTokenPeriodParams extends PeriodTransferParams {
  args: Hex;
}

/**
 * Parameters for streaming enforcers (no terms required)
 */
export interface StreamingParams extends BaseCaveatParams {
  // No additional parameters needed for streaming enforcers
}

/**
 * Parameter types for each caveat enforcer
 */
export type CaveatEnforcerParams = {
  ERC20PeriodTransferEnforcer: PeriodTransferParams;
  MultiTokenPeriodEnforcer: MultiTokenPeriodParams;
  NativeTokenPeriodTransferEnforcer: PeriodTransferParams;
  ERC20StreamingEnforcer: StreamingParams;
  NativeTokenStreamingEnforcer: StreamingParams;
};

/**
 * Return type for period-based transfer enforcers
 */
export interface PeriodTransferResult {
  availableAmount: bigint;
  isNewPeriod: boolean;
  currentPeriod: bigint;
}

/**
 * Return type for streaming enforcers
 */
export interface StreamingResult {
  availableAmount: bigint;
}

/**
 * Return types for each caveat enforcer
 */
export type CaveatEnforcerResult = {
  ERC20PeriodTransferEnforcer: PeriodTransferResult;
  MultiTokenPeriodEnforcer: PeriodTransferResult;
  NativeTokenPeriodTransferEnforcer: PeriodTransferResult;
  ERC20StreamingEnforcer: StreamingResult;
  NativeTokenStreamingEnforcer: StreamingResult;
};

/**
 * Configuration for caveat utility functions
 */
export interface CaveatUtilsConfig {
  environment?: DeleGatorEnvironment;
}

/**
 * Helper function to get environment from client or use provided environment
 */
function getEnvironmentFromClientOrConfig(
  client: PublicClient,
  config?: CaveatUtilsConfig,
): DeleGatorEnvironment {
  if (config?.environment) {
    return config.environment;
  }

  const chainId = client.chain?.id;
  if (!chainId) {
    throw new Error('Chain ID not found in client');
  }
  return getDeleGatorEnvironment(chainId);
}

/**
 * Resolves the delegation manager address from parameters or environment
 */
function resolveDelegationManager(
  params: BaseCaveatParams,
  environment: DeleGatorEnvironment,
): Address {
  const delegationManager =
    params.delegationManager || environment.DelegationManager;

  if (!delegationManager) {
    throw new Error('Delegation manager address not found');
  }

  return delegationManager;
}

/**
 * Resolves the enforcer address from parameters or environment
 */
function resolveEnforcerAddress(
  caveatName: CaveatEnforcerName,
  params: BaseCaveatParams,
  environment: DeleGatorEnvironment,
): Address {
  if (params.enforcerAddress) {
    return params.enforcerAddress;
  }

  const enforcerAddress = environment.caveatEnforcers[caveatName];
  if (!enforcerAddress) {
    throw new Error(`${caveatName} not found in environment`);
  }

  return enforcerAddress;
}

/**
 * Gets available amount for ERC20PeriodTransferEnforcer
 */
export async function getERC20PeriodTransferAvailableAmountAction(
  client: PublicClient,
  params: PeriodTransferParams,
  config?: CaveatUtilsConfig,
): Promise<PeriodTransferResult> {
  const environment = getEnvironmentFromClientOrConfig(client, config);
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'ERC20PeriodTransferEnforcer',
    params,
    environment,
  );

  const result = await client.readContract({
    address: enforcerAddress,
    abi: ERC20PeriodTransferEnforcer.abi,
    functionName: 'getAvailableAmount',
    args: [params.delegationHash, delegationManager, params.terms],
  });

  const [availableAmount, isNewPeriod, currentPeriod] = result;

  return {
    availableAmount,
    isNewPeriod,
    currentPeriod,
  };
}

/**
 * Gets available amount for MultiTokenPeriodEnforcer
 */
export async function getMultiTokenPeriodAvailableAmountAction(
  client: PublicClient,
  params: MultiTokenPeriodParams,
  config?: CaveatUtilsConfig,
): Promise<PeriodTransferResult> {
  const environment = getEnvironmentFromClientOrConfig(client, config);
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'MultiTokenPeriodEnforcer',
    params,
    environment,
  );

  const result = await client.readContract({
    address: enforcerAddress,
    abi: MultiTokenPeriodEnforcer.abi,
    functionName: 'getAvailableAmount',
    args: [params.delegationHash, delegationManager, params.terms, params.args],
  });

  const [availableAmount, isNewPeriod, currentPeriod] = result;

  return {
    availableAmount,
    isNewPeriod,
    currentPeriod,
  };
}

/**
 * Gets available amount for NativeTokenPeriodTransferEnforcer
 */
export async function getNativeTokenPeriodTransferAvailableAmountAction(
  client: PublicClient,
  params: PeriodTransferParams,
  config?: CaveatUtilsConfig,
): Promise<PeriodTransferResult> {
  const environment = getEnvironmentFromClientOrConfig(client, config);
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'NativeTokenPeriodTransferEnforcer',
    params,
    environment,
  );

  const result = await client.readContract({
    address: enforcerAddress,
    abi: NativeTokenPeriodTransferEnforcer.abi,
    functionName: 'getAvailableAmount',
    args: [params.delegationHash, delegationManager, params.terms],
  });

  const [availableAmount, isNewPeriod, currentPeriod] = result;

  return {
    availableAmount,
    isNewPeriod,
    currentPeriod,
  };
}

/**
 * Gets available amount for ERC20StreamingEnforcer
 */
export async function getERC20StreamingAvailableAmountAction(
  client: PublicClient,
  params: StreamingParams,
  config?: CaveatUtilsConfig,
): Promise<StreamingResult> {
  const environment = getEnvironmentFromClientOrConfig(client, config);
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'ERC20StreamingEnforcer',
    params,
    environment,
  );

  const result = await client.readContract({
    address: enforcerAddress,
    abi: ERC20StreamingEnforcer.abi,
    functionName: 'getAvailableAmount',
    args: [delegationManager, params.delegationHash],
  });

  return {
    availableAmount: result,
  };
}

/**
 * Gets available amount for NativeTokenStreamingEnforcer
 */
export async function getNativeTokenStreamingAvailableAmountAction(
  client: PublicClient,
  params: StreamingParams,
  config?: CaveatUtilsConfig,
): Promise<StreamingResult> {
  const environment = getEnvironmentFromClientOrConfig(client, config);
  const delegationManager = resolveDelegationManager(params, environment);
  const enforcerAddress = resolveEnforcerAddress(
    'NativeTokenStreamingEnforcer',
    params,
    environment,
  );

  const result = await client.readContract({
    address: enforcerAddress,
    abi: NativeTokenStreamingEnforcer.abi,
    functionName: 'getAvailableAmount',
    args: [delegationManager, params.delegationHash],
  });

  return {
    availableAmount: result,
  };
}

/**
 * Generic action to get available amount for any supported caveat enforcer
 */
export async function getCaveatAvailableAmountAction<
  T extends CaveatEnforcerName,
>(
  client: PublicClient,
  caveatName: T,
  params: CaveatEnforcerParams[T],
  config?: CaveatUtilsConfig,
): Promise<CaveatEnforcerResult[T]> {
  switch (caveatName) {
    case 'ERC20PeriodTransferEnforcer':
      return getERC20PeriodTransferAvailableAmountAction(
        client,
        params as PeriodTransferParams,
        config,
      ) as Promise<CaveatEnforcerResult[T]>;

    case 'MultiTokenPeriodEnforcer':
      return getMultiTokenPeriodAvailableAmountAction(
        client,
        params as MultiTokenPeriodParams,
        config,
      ) as Promise<CaveatEnforcerResult[T]>;

    case 'NativeTokenPeriodTransferEnforcer':
      return getNativeTokenPeriodTransferAvailableAmountAction(
        client,
        params as PeriodTransferParams,
        config,
      ) as Promise<CaveatEnforcerResult[T]>;

    case 'ERC20StreamingEnforcer':
      return getERC20StreamingAvailableAmountAction(
        client,
        params as StreamingParams,
        config,
      ) as Promise<CaveatEnforcerResult[T]>;

    case 'NativeTokenStreamingEnforcer':
      return getNativeTokenStreamingAvailableAmountAction(
        client,
        params as StreamingParams,
        config,
      ) as Promise<CaveatEnforcerResult[T]>;

    default:
      throw new Error(`Unsupported caveat enforcer: ${caveatName}`);
  }
}

/**
 * Viem actions builder for caveat utilities
 * Returns actions that can be used to extend a PublicClient
 */
export const caveatUtilsActions =
  (config?: CaveatUtilsConfig) => (client: Client) => ({
    /**
     * Gets available amount for ERC20PeriodTransferEnforcer
     */
    getERC20PeriodTransferAvailableAmount: async (
      params: PeriodTransferParams,
    ): Promise<PeriodTransferResult> =>
      getERC20PeriodTransferAvailableAmountAction(
        client as PublicClient,
        params,
        config,
      ),

    /**
     * Gets available amount for MultiTokenPeriodEnforcer
     */
    getMultiTokenPeriodAvailableAmount: async (
      params: MultiTokenPeriodParams,
    ): Promise<PeriodTransferResult> =>
      getMultiTokenPeriodAvailableAmountAction(
        client as PublicClient,
        params,
        config,
      ),

    /**
     * Gets available amount for NativeTokenPeriodTransferEnforcer
     */
    getNativeTokenPeriodTransferAvailableAmount: async (
      params: PeriodTransferParams,
    ): Promise<PeriodTransferResult> =>
      getNativeTokenPeriodTransferAvailableAmountAction(
        client as PublicClient,
        params,
        config,
      ),

    /**
     * Gets available amount for ERC20StreamingEnforcer
     */
    getERC20StreamingAvailableAmount: async (
      params: StreamingParams,
    ): Promise<StreamingResult> =>
      getERC20StreamingAvailableAmountAction(
        client as PublicClient,
        params,
        config,
      ),

    /**
     * Gets available amount for NativeTokenStreamingEnforcer
     */
    getNativeTokenStreamingAvailableAmount: async (
      params: StreamingParams,
    ): Promise<StreamingResult> =>
      getNativeTokenStreamingAvailableAmountAction(
        client as PublicClient,
        params,
        config,
      ),

    /**
     * Generic method to get available amount for any supported caveat enforcer
     */
    getCaveatAvailableAmount: async <T extends CaveatEnforcerName>(
      caveatName: T,
      params: CaveatEnforcerParams[T],
    ): Promise<CaveatEnforcerResult[T]> =>
      getCaveatAvailableAmountAction(
        client as PublicClient,
        caveatName,
        params,
        config,
      ),
  });
