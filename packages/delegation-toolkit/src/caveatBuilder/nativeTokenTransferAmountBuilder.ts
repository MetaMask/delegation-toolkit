import { encodePacked } from 'viem';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const nativeTokenTransferAmount = 'nativeTokenTransferAmount';

export type NativeTokenTransferAmountBuilderConfig = {
  maxAmount: bigint;
};

/**
 * Builds a caveat struct for the NativeTokenTransferAmountEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object containing the maxAmount.
 * @returns The Caveat.
 * @throws Error if the maxAmount is negative.
 */
export const nativeTokenTransferAmountBuilder = (
  environment: DeleGatorEnvironment,
  config: NativeTokenTransferAmountBuilderConfig,
): Caveat => {
  const { maxAmount } = config;

  if (maxAmount < 0n) {
    throw new Error('Invalid maxAmount: must be zero or positive');
  }

  const terms = encodePacked(['uint256'], [maxAmount]);

  const {
    caveatEnforcers: { NativeTokenTransferAmountEnforcer },
  } = environment;

  if (!NativeTokenTransferAmountEnforcer) {
    throw new Error(
      'NativeTokenTransferAmountEnforcer not found in environment',
    );
  }

  return {
    enforcer: NativeTokenTransferAmountEnforcer,
    terms,
    args: '0x',
  };
};
