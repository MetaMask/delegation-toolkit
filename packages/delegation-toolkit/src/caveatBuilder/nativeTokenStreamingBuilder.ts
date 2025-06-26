import { createNativeTokenStreamingTerms } from '@metamask/delegation-core';

import type { DeleGatorEnvironment, Caveat } from '../types';

export const nativeTokenStreaming = 'nativeTokenStreaming';

/**
 * Builds a caveat struct for the NativeTokenStreamingEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param initialAmount - The initial amount of tokens to release at start time.
 * @param maxAmount - The maximum amount of tokens that can be released.
 * @param amountPerSecond - The rate at which the allowance increases per second.
 * @param startTime - The timestamp from which the allowance streaming begins.
 * @returns The Caveat.
 * @throws Error if any of the parameters are invalid.
 */
export const nativeTokenStreamingBuilder = (
  environment: DeleGatorEnvironment,
  initialAmount: bigint,
  maxAmount: bigint,
  amountPerSecond: bigint,
  startTime: number,
): Caveat => {
  const terms = createNativeTokenStreamingTerms({
    initialAmount,
    maxAmount,
    amountPerSecond,
    startTime,
  });

  const {
    caveatEnforcers: { NativeTokenStreamingEnforcer },
  } = environment;

  if (!NativeTokenStreamingEnforcer) {
    throw new Error('NativeTokenStreamingEnforcer not found in environment');
  }

  return {
    enforcer: NativeTokenStreamingEnforcer,
    terms,
    args: '0x',
  };
};
