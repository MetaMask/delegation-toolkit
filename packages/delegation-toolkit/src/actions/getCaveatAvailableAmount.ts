import type { Address, Hex, PublicClient } from 'viem';

import * as ERC20PeriodTransferEnforcer from '../DelegationFramework/ERC20PeriodTransferEnforcer';
import * as ERC20StreamingEnforcer from '../DelegationFramework/ERC20StreamingEnforcer';
import * as NativeTokenPeriodTransferEnforcer from '../DelegationFramework/NativeTokenPeriodTransferEnforcer';
import * as NativeTokenStreamingEnforcer from '../DelegationFramework/NativeTokenStreamingEnforcer';
import * as MultiTokenPeriodEnforcer from '../DelegationFramework/MultiTokenPeriodEnforcer';
import type { DeleGatorEnvironment } from '../types';

/**
 * Configuration for caveat enforcer client
 */
export interface CaveatEnforcerClientConfig {
  environment: DeleGatorEnvironment;
}

/**
 * Shared base params for all enforcer actions
 */
export interface BaseCaveatParams {
  delegationHash: Hex;
  delegationManager?: Address;
  enforcerAddress?: Address;
  terms: Hex;
}

/**
 * Parameters for ERC20 period transfer enforcer
 */
export interface ERC20PeriodTransferParams extends BaseCaveatParams {}

/**
 * Parameters for ERC20 streaming enforcer
 */
export interface ERC20StreamingParams extends BaseCaveatParams {}

/**
 * Parameters for MultiTokenPeriodEnforcer
 */
export interface MultiTokenPeriodParams extends BaseCaveatParams {
  args: Hex;
}

/**
 * Parameters for native token period transfer enforcer
 */
export interface NativeTokenPeriodTransferParams extends BaseCaveatParams {}

/**
 * Parameters for native token streaming enforcer
 */
export interface NativeTokenStreamingParams extends BaseCaveatParams {}

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
 * Resolves the delegation manager address from parameters or environment
 */
function resolveDelegationManager(
  params: { delegationManager?: Address },
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
 * Caveat enforcer actions for extending viem clients
 */
export const caveatEnforcerActions =
  (config: CaveatEnforcerClientConfig) => (client: PublicClient) => ({
    /**
     * Get available amount for ERC20 period transfer enforcer
     */
    getErc20PeriodTransferEnforcerAvailableAmount: async (
      params: ERC20PeriodTransferParams,
    ): Promise<PeriodTransferResult> => {
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
    },

    /**
     * Get available amount for ERC20 streaming enforcer
     */
    getErc20StreamingEnforcerAvailableAmount: async (
      params: ERC20StreamingParams,
    ): Promise<StreamingResult> => {
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
    },

    /**
     * Get available amount for multi-token period enforcer
     */
    getMultiTokenPeriodEnforcerAvailableAmount: async (
      params: MultiTokenPeriodParams,
    ): Promise<PeriodTransferResult> => {
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
    },

    /**
     * Get available amount for native token period transfer enforcer
     */
    getNativeTokenPeriodTransferEnforcerAvailableAmount: async (
      params: NativeTokenPeriodTransferParams,
    ): Promise<PeriodTransferResult> => {
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
    },

    /**
     * Get available amount for native token streaming enforcer
     */
    getNativeTokenStreamingEnforcerAvailableAmount: async (
      params: NativeTokenStreamingParams,
    ): Promise<StreamingResult> => {
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
    },
  });

/**
 * Type for client extended with caveat enforcer actions
 */
export type CaveatEnforcerClient = PublicClient &
  ReturnType<ReturnType<typeof caveatEnforcerActions>>;

/**
 * Create a viem client extended with caveat enforcer actions
 */
export function createCaveatEnforcerClient(
  client: PublicClient,
  config: CaveatEnforcerClientConfig,
): CaveatEnforcerClient {
  return client.extend(caveatEnforcerActions(config));
}
