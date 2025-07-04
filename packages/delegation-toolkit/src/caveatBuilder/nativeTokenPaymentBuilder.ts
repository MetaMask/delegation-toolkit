import { type Address, encodePacked, isAddress } from 'viem';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const nativeTokenPayment = 'nativeTokenPayment';

export type NativeTokenPaymentBuilderConfig = {
  recipient: Address;
  amount: bigint;
};

/**
 * Builds a caveat struct for the NativeTokenPaymentEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object for the NativeTokenPaymentEnforcer.
 * @returns The Caveat.
 * @throws Error if the amount is invalid or the recipient address is invalid.
 */
export const nativeTokenPaymentBuilder = (
  environment: DeleGatorEnvironment,
  config: NativeTokenPaymentBuilderConfig,
): Caveat => {
  const { recipient, amount } = config;

  if (amount <= 0n) {
    throw new Error('Invalid amount: must be positive');
  }

  if (!isAddress(recipient)) {
    throw new Error('Invalid recipient: must be a valid address');
  }

  const terms = encodePacked(['address', 'uint256'], [recipient, amount]);

  const {
    caveatEnforcers: { NativeTokenPaymentEnforcer },
  } = environment;

  if (!NativeTokenPaymentEnforcer) {
    throw new Error('NativeTokenPaymentEnforcer not found in environment');
  }

  return {
    enforcer: NativeTokenPaymentEnforcer,
    terms,
    args: '0x',
  };
};
