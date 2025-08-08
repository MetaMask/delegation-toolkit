import type { PublicClient } from 'viem';

import type { DeleGatorEnvironment } from '../types';
import {
  caveatEnforcerActions,
  type CaveatEnforcerParams,
  type PeriodTransferResult,
  type StreamingResult,
} from './getCaveatAvailableAmount';

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

// Re-export types for convenience
export type { CaveatEnforcerParams, PeriodTransferResult, StreamingResult };
