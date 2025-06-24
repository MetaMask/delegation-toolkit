import { createTimestampTerms } from '@metamask/delegation-core';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const timestamp = 'timestamp';

/**
 * Builds a caveat struct for the TimestampEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param timestampAfterThreshold - The timestamp (in seconds) after which the delegation can be used.
 * @param timestampBeforeThreshold - The timestamp (in seconds) before which the delegation can be used.
 * @returns The Caveat.
 * @throws Error if any of the parameters are invalid.
 */
export const timestampBuilder = (
  environment: DeleGatorEnvironment,
  timestampAfterThreshold: number,
  timestampBeforeThreshold: number,
): Caveat => {
  const terms = createTimestampTerms({
    timestampAfterThreshold,
    timestampBeforeThreshold,
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
