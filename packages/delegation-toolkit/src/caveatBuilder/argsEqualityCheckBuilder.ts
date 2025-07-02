import { type Hex, isHex } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';

export const argsEqualityCheck = 'argsEqualityCheck';

export type ArgsEqualityCheckBuilderConfig = {
  expectedArgs: Hex;
};

/**
 * Builds a caveat struct for the ArgsEqualityCheckEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object for the builder.
 * @returns The Caveat.
 * @throws Error if the config is invalid.
 */
export const argsEqualityCheckBuilder = (
  environment: DeleGatorEnvironment,
  config: ArgsEqualityCheckBuilderConfig,
): Caveat => {
  const { expectedArgs } = config;
  if (!isHex(expectedArgs)) {
    throw new Error('Invalid config: expectedArgs must be a valid hex string');
  }

  const {
    caveatEnforcers: { ArgsEqualityCheckEnforcer },
  } = environment;

  if (!ArgsEqualityCheckEnforcer) {
    throw new Error('ArgsEqualityCheckEnforcer not found in environment');
  }

  return {
    enforcer: ArgsEqualityCheckEnforcer,
    terms: expectedArgs,
    args: '0x',
  };
};
