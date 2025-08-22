import type { Client, Transport, Chain, Account } from 'viem';

import type { DeleGatorEnvironment } from '../types';
import {
  caveatEnforcerActions,
  type CaveatEnforcerParams,
  type PeriodTransferResult,
  type StreamingResult,
} from './getCaveatAvailableAmount';

/**
 * Type for client extended with caveat enforcer actions.
 * This extends the base Client type to avoid pollution from PublicClient actions.
 */
export type CaveatEnforcerClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
> = Client<TTransport, TChain, TAccount> &
  ReturnType<ReturnType<typeof caveatEnforcerActions>>;

/**
 * Create a viem client extended with caveat enforcer actions.
 *
 * @param params - The parameters object.
 * @param params.client - The viem client (can be any client type).
 * @param params.environment - The delegator environment.
 * @returns The extended client with caveat enforcer actions.
 */
export function createCaveatEnforcerClient<
  TTransport extends Transport = Transport,
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
>({
  client,
  environment,
}: {
  client: Client<TTransport, TChain, TAccount>;
  environment: DeleGatorEnvironment;
}): CaveatEnforcerClient<TTransport, TChain, TAccount> {
  return client.extend(caveatEnforcerActions({ environment }));
}

// Re-export types for convenience
export type { CaveatEnforcerParams, PeriodTransferResult, StreamingResult };
