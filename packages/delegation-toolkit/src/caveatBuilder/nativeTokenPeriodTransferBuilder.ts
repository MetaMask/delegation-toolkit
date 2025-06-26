import { createNativeTokenPeriodTransferTerms } from '@metamask/delegation-core';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const nativeTokenPeriodTransfer = 'nativeTokenPeriodTransfer';

/**
 * Builds a caveat struct for NativeTokenPeriodTransferEnforcer.
 * This enforcer validates that native token (ETH) transfers do not exceed a specified amount
 * within a given time period. The transferable amount resets at the beginning of each period,
 * and any unused ETH is forfeited once the period ends.
 *
 * @param environment - The DeleGator environment.
 * @param periodAmount - The maximum amount of ETH (in wei) that can be transferred per period.
 * @param periodDuration - The duration of each period in seconds.
 * @param startDate - The timestamp when the first period begins.
 * @returns The Caveat.
 * @throws Error if any of the parameters are invalid.
 */
export const nativeTokenPeriodTransferBuilder = (
  environment: DeleGatorEnvironment,
  periodAmount: bigint,
  periodDuration: number,
  startDate: number,
): Caveat => {
  const terms = createNativeTokenPeriodTransferTerms({
    periodAmount,
    periodDuration,
    startDate,
  });

  const {
    caveatEnforcers: { NativeTokenPeriodTransferEnforcer },
  } = environment;

  if (!NativeTokenPeriodTransferEnforcer) {
    throw new Error(
      'NativeTokenPeriodTransferEnforcer not found in environment',
    );
  }

  return {
    enforcer: NativeTokenPeriodTransferEnforcer,
    terms,
    args: '0x',
  };
};
