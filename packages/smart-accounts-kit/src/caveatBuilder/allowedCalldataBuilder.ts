import { type Hex, concat, isHex, toHex } from 'viem';

import type { SmartAccountsEnvironment, Caveat } from '../types';

export const allowedCalldata = 'allowedCalldata';

export type AllowedCalldataBuilderConfig = {
  /**
   * The index in the calldata byte array (including the 4-byte method selector)
   * where the expected calldata starts.
   */
  startIndex: number;
  /**
   * The expected calldata as a hex string that must match at the specified index.
   */
  value: Hex;
};

/**
 * Builds a caveat struct for AllowedCalldataEnforcer that restricts calldata to a specific value at a given index.
 *
 * @param environment - The SmartAccountsEnvironment.
 * @param config - The configuration object containing startIndex and value.
 * @returns The Caveat.
 * @throws Error if the value is not a valid hex string, if startIndex is negative, or if startIndex is not a whole number.
 */
export const allowedCalldataBuilder = (
  environment: SmartAccountsEnvironment,
  config: AllowedCalldataBuilderConfig,
): Caveat => {
  const { startIndex, value } = config;

  if (!isHex(value)) {
    throw new Error('Invalid value: must be a valid hex string');
  }

  if (startIndex < 0) {
    throw new Error('Invalid startIndex: must be zero or positive');
  }

  if (!Number.isInteger(startIndex)) {
    throw new Error('Invalid startIndex: must be a whole number');
  }

  const startIndexHex = toHex(startIndex, { size: 32 });

  const terms = concat([startIndexHex, value]);

  const {
    caveatEnforcers: { AllowedCalldataEnforcer },
  } = environment;

  if (!AllowedCalldataEnforcer) {
    throw new Error('AllowedCalldataEnforcer not found in environment');
  }

  return {
    enforcer: AllowedCalldataEnforcer,
    terms,
    args: '0x',
  };
};
