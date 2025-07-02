import { createNativeTokenStreamingTerms } from '@metamask/delegation-core';

import type { DeleGatorEnvironment, Caveat } from '../types';

export const nativeTokenStreaming = 'nativeTokenStreaming';

export type NativeTokenStreamingBuilderConfig = {
  initialAmount: bigint;
  maxAmount: bigint;
  amountPerSecond: bigint;
  startTime: number;
};

/**
 * Builds a caveat struct for the NativeTokenStreamingEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object for the NativeTokenStreamingEnforcer.
 * @returns The Caveat.
 * @throws Error if any of the parameters are invalid.
 */
export const nativeTokenStreamingBuilder = (
  environment: DeleGatorEnvironment,
  config: NativeTokenStreamingBuilderConfig,
): Caveat => {
  const { initialAmount, maxAmount, amountPerSecond, startTime } = config;

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
