import { concat, toHex } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';

export const blockNumber = 'blockNumber';

export type BlockNumberBuilderConfig = {
  blockAfterThreshold: bigint;
  blockBeforeThreshold: bigint;
};

/**
 * Builds a caveat struct for the BlockNumberEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object for the BlockNumberEnforcer.
 * @returns The Caveat.
 * @throws Error if both thresholds are zero, if blockAfterThreshold is greater than or equal to blockBeforeThreshold, or if BlockNumberEnforcer is not available in the environment.
 */
export const blockNumberBuilder = (
  environment: DeleGatorEnvironment,
  config: BlockNumberBuilderConfig,
): Caveat => {
  const { blockAfterThreshold, blockBeforeThreshold } = config;

  if (blockAfterThreshold === 0n && blockBeforeThreshold === 0n) {
    throw new Error(
      'Invalid thresholds: At least one of blockAfterThreshold or blockBeforeThreshold must be specified',
    );
  }

  if (
    blockBeforeThreshold !== 0n &&
    blockAfterThreshold >= blockBeforeThreshold
  ) {
    throw new Error(
      'Invalid thresholds: blockAfterThreshold must be less than blockBeforeThreshold if both are specified',
    );
  }

  const terms = concat([
    toHex(blockAfterThreshold, {
      size: 16,
    }),
    toHex(blockBeforeThreshold, {
      size: 16,
    }),
  ]);

  const {
    caveatEnforcers: { BlockNumberEnforcer },
  } = environment;

  if (!BlockNumberEnforcer) {
    throw new Error('BlockNumberEnforcer not found in environment');
  }

  return {
    enforcer: BlockNumberEnforcer,
    terms,
    args: '0x',
  };
};
