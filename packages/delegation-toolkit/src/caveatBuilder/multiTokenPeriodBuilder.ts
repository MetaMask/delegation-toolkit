import type { Hex } from 'viem';
import { concat, isAddress, pad, toHex } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';

export type TokenPeriodConfig = {
  /**
   * The token contract address as a hex string.
   */
  token: Hex;
  /**
   * The maximum amount of tokens that can be transferred per period.
   */
  periodAmount: bigint;
  /**
   * The duration of each period in seconds.
   */
  periodDuration: number;
  /**
   * The timestamp when the first period begins in seconds.
   */
  startDate: number;
};

export type MultiTokenPeriodBuilderConfig = TokenPeriodConfig[];

export const multiTokenPeriod = 'multiTokenPeriod';

/**
 * Creates a caveat for the MultiTokenPeriodEnforcer.
 * This enforcer allows setting periodic transfer limits for multiple tokens.
 * Each token can have its own period amount, duration, and start date.
 *
 * @param environment - The DeleGator environment.
 * @param configs - The configurations for the MultiTokenPeriodBuilder.
 * @returns The caveat object for the MultiTokenPeriodEnforcer.
 */
export const multiTokenPeriodBuilder = (
  environment: DeleGatorEnvironment,
  configs: MultiTokenPeriodBuilderConfig,
): Caveat => {
  if (!configs || configs.length === 0) {
    throw new Error('MultiTokenPeriodBuilder: configs array cannot be empty');
  }

  configs.forEach((config) => {
    if (!isAddress(config.token)) {
      throw new Error(`Invalid token address: ${String(config.token)}`);
    }

    if (config.periodAmount <= 0) {
      throw new Error('Invalid period amount: must be greater than 0');
    }

    if (config.periodDuration <= 0) {
      throw new Error('Invalid period duration: must be greater than 0');
    }
  });

  // Each config requires 116 bytes:
  // - 20 bytes for token address
  // - 32 bytes for periodAmount
  // - 32 bytes for periodDuration
  // - 32 bytes for startDate
  const termsArray = configs.reduce<Hex[]>(
    (acc, { token, periodAmount, periodDuration, startDate }) => [
      ...acc,
      pad(token, { size: 20 }),
      toHex(periodAmount, { size: 32 }),
      toHex(periodDuration, { size: 32 }),
      toHex(startDate, { size: 32 }),
    ],
    [],
  );

  const terms = concat(termsArray);

  const {
    caveatEnforcers: { MultiTokenPeriodEnforcer },
  } = environment;

  if (!MultiTokenPeriodEnforcer) {
    throw new Error('MultiTokenPeriodEnforcer not found in environment');
  }

  return {
    enforcer: MultiTokenPeriodEnforcer,
    terms,
    args: '0x',
  };
};
