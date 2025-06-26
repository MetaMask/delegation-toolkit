import { createExactCalldataTerms } from '@metamask/delegation-core';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const exactCalldata = 'exactCalldata';

/**
 * Builds a caveat struct for ExactCalldataEnforcer.
 * This enforcer ensures that the provided execution calldata matches exactly
 * the expected calldata.
 *
 * @param environment - The DeleGator environment.
 * @param callData - The expected calldata to match against.
 * @returns The Caveat.
 * @throws Error if any of the parameters are invalid.
 */
export const exactCalldataBuilder = (
  environment: DeleGatorEnvironment,
  callData: `0x${string}`,
): Caveat => {
  const terms = createExactCalldataTerms({ callData });

  const {
    caveatEnforcers: { ExactCalldataEnforcer },
  } = environment;

  if (!ExactCalldataEnforcer) {
    throw new Error('ExactCalldataEnforcer not found in environment');
  }

  return {
    enforcer: ExactCalldataEnforcer,
    terms,
    args: '0x',
  };
};
