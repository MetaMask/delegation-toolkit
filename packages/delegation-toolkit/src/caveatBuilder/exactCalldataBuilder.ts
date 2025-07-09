import { createExactCalldataTerms } from '@metamask/delegation-core';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const exactCalldata = 'exactCalldata';

export type ExactCalldataBuilderConfig = {
  /**
   * The exact calldata that must be matched as a hex string.
   */
  calldata: `0x${string}`;
};

/**
 * Builds a caveat struct for ExactCalldataEnforcer.
 * This enforcer ensures that the provided execution calldata matches exactly
 * the expected calldata.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration for the ExactCalldataBuilder.
 * @returns The Caveat.
 * @throws Error if any of the parameters are invalid.
 */
export const exactCalldataBuilder = (
  environment: DeleGatorEnvironment,
  config: ExactCalldataBuilderConfig,
): Caveat => {
  const { calldata } = config;

  const terms = createExactCalldataTerms({ calldata });

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
