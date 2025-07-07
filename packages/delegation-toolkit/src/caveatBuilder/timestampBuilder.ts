import { createTimestampTerms } from '@metamask/delegation-core';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const timestamp = 'timestamp';

export type TimestampBuilderConfig = {
  afterThreshold: number;
  beforeThreshold: number;
};

/**
 * Builds a caveat struct for the TimestampEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object for the TimestampEnforcer.
 * @returns The Caveat.
 * @throws Error if any of the parameters are invalid.
 */
export const timestampBuilder = (
  environment: DeleGatorEnvironment,
  config: TimestampBuilderConfig,
): Caveat => {
  const { afterThreshold, beforeThreshold } = config;

  const terms = createTimestampTerms({
    timestampAfterThreshold: afterThreshold,
    timestampBeforeThreshold: beforeThreshold,
  });

  const {
    caveatEnforcers: { TimestampEnforcer },
  } = environment;

  if (!TimestampEnforcer) {
    throw new Error('TimestampEnforcer not found in environment');
  }

  return {
    enforcer: TimestampEnforcer,
    terms,
    args: '0x',
  };
};
