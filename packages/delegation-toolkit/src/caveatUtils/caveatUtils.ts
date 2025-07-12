import {
  ERC20PeriodTransferEnforcer,
  MultiTokenPeriodEnforcer,
  NativeTokenPeriodTransferEnforcer,
  ERC20StreamingEnforcer,
  NativeTokenStreamingEnforcer,
} from '@metamask/delegation-abis';
import type { Address, Hex, PublicClient } from 'viem';

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
  client: PublicClient;
  environment?: DeleGatorEnvironment;
}

/**
 * Main class for handling caveat enforcer queries
 */
export class CaveatUtils {
  private client: PublicClient;
  private environment: DeleGatorEnvironment;

  constructor(config: CaveatUtilsConfig) {
    this.client = config.client;
    this.environment = config.environment ?? this.getEnvironmentFromClient();
  }

  /**
   * Gets the environment from the client's chain ID
   */
  private getEnvironmentFromClient(): DeleGatorEnvironment {
    const chainId = this.client.chain?.id;
    if (!chainId) {
      throw new Error('Chain ID not found in client');
    }
    return getDeleGatorEnvironment(chainId);
  }

  /**
   * Resolves the delegation manager address from parameters or environment
   */
  private resolveDelegationManager(params: BaseCaveatParams): Address {
    const delegationManager =
      params.delegationManager || this.environment.DelegationManager;

    if (!delegationManager) {
      throw new Error('Delegation manager address not found');
    }

    return delegationManager;
  }

  /**
   * Resolves the enforcer address from parameters or environment
   */
  private resolveEnforcerAddress(
    caveatName: CaveatEnforcerName,
    params: BaseCaveatParams,
  ): Address {
    if (params.enforcerAddress) {
      return params.enforcerAddress;
    }

    const enforcerAddress = this.environment.caveatEnforcers[caveatName];
    if (!enforcerAddress) {
      throw new Error(`${caveatName} not found in environment`);
    }

    return enforcerAddress;
  }

  /**
   * Gets available amount for ERC20PeriodTransferEnforcer
   */
  async getERC20PeriodTransferAvailableAmount(
    params: PeriodTransferParams,
  ): Promise<PeriodTransferResult> {
    const delegationManager = this.resolveDelegationManager(params);
    const enforcerAddress = this.resolveEnforcerAddress(
      'ERC20PeriodTransferEnforcer',
      params,
    );

    const result = await this.client.readContract({
      address: enforcerAddress,
      abi: ERC20PeriodTransferEnforcer.abi,
      functionName: 'getAvailableAmount',
      args: [params.delegationHash, delegationManager, params.terms],
    });

    return {
      availableAmount: result[0],
      isNewPeriod: result[1],
      currentPeriod: result[2],
    };
  }

  /**
   * Gets available amount for MultiTokenPeriodEnforcer
   */
  async getMultiTokenPeriodAvailableAmount(
    params: MultiTokenPeriodParams,
  ): Promise<PeriodTransferResult> {
    const delegationManager = this.resolveDelegationManager(params);
    const enforcerAddress = this.resolveEnforcerAddress(
      'MultiTokenPeriodEnforcer',
      params,
    );

    const result = await this.client.readContract({
      address: enforcerAddress,
      abi: MultiTokenPeriodEnforcer.abi,
      functionName: 'getAvailableAmount',
      args: [
        params.delegationHash,
        delegationManager,
        params.terms,
        params.args,
      ],
    });

    return {
      availableAmount: result[0],
      isNewPeriod: result[1],
      currentPeriod: result[2],
    };
  }

  /**
   * Gets available amount for NativeTokenPeriodTransferEnforcer
   */
  async getNativeTokenPeriodTransferAvailableAmount(
    params: PeriodTransferParams,
  ): Promise<PeriodTransferResult> {
    const delegationManager = this.resolveDelegationManager(params);
    const enforcerAddress = this.resolveEnforcerAddress(
      'NativeTokenPeriodTransferEnforcer',
      params,
    );

    const result = await this.client.readContract({
      address: enforcerAddress,
      abi: NativeTokenPeriodTransferEnforcer.abi,
      functionName: 'getAvailableAmount',
      args: [params.delegationHash, delegationManager, params.terms],
    });

    return {
      availableAmount: result[0],
      isNewPeriod: result[1],
      currentPeriod: result[2],
    };
  }

  /**
   * Gets available amount for ERC20StreamingEnforcer
   */
  async getERC20StreamingAvailableAmount(
    params: StreamingParams,
  ): Promise<StreamingResult> {
    const delegationManager = this.resolveDelegationManager(params);
    const enforcerAddress = this.resolveEnforcerAddress(
      'ERC20StreamingEnforcer',
      params,
    );

    const result = await this.client.readContract({
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
  async getNativeTokenStreamingAvailableAmount(
    params: StreamingParams,
  ): Promise<StreamingResult> {
    const delegationManager = this.resolveDelegationManager(params);
    const enforcerAddress = this.resolveEnforcerAddress(
      'NativeTokenStreamingEnforcer',
      params,
    );

    const result = await this.client.readContract({
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
   * Generic method to get available amount for any supported caveat enforcer
   */
  async getAvailableAmount<T extends CaveatEnforcerName>(
    caveatName: T,
    params: CaveatEnforcerParams[T],
  ): Promise<CaveatEnforcerResult[T]> {
    switch (caveatName) {
      case 'ERC20PeriodTransferEnforcer':
        return this.getERC20PeriodTransferAvailableAmount(
          params as PeriodTransferParams,
        ) as Promise<CaveatEnforcerResult[T]>;

      case 'MultiTokenPeriodEnforcer':
        return this.getMultiTokenPeriodAvailableAmount(
          params as MultiTokenPeriodParams,
        ) as Promise<CaveatEnforcerResult[T]>;

      case 'NativeTokenPeriodTransferEnforcer':
        return this.getNativeTokenPeriodTransferAvailableAmount(
          params as PeriodTransferParams,
        ) as Promise<CaveatEnforcerResult[T]>;

      case 'ERC20StreamingEnforcer':
        return this.getERC20StreamingAvailableAmount(
          params as StreamingParams,
        ) as Promise<CaveatEnforcerResult[T]>;

      case 'NativeTokenStreamingEnforcer':
        return this.getNativeTokenStreamingAvailableAmount(
          params as StreamingParams,
        ) as Promise<CaveatEnforcerResult[T]>;

      default:
        throw new Error(`Unsupported caveat enforcer: ${caveatName}`);
    }
  }
}

/**
 * Factory function to create a CaveatUtils instance
 */
export function createCaveatUtils(config: CaveatUtilsConfig): CaveatUtils {
  return new CaveatUtils(config);
}

/**
 * Standalone utility function to get available amount for a specific caveat enforcer
 */
export async function getCaveatAvailableAmount<T extends CaveatEnforcerName>(
  caveatName: T,
  params: CaveatEnforcerParams[T],
  config: CaveatUtilsConfig,
): Promise<CaveatEnforcerResult[T]> {
  const utils = createCaveatUtils(config);
  return utils.getAvailableAmount(caveatName, params);
}
