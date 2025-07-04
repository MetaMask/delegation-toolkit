import { type Address, isAddress, encodePacked } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';
import { BalanceChangeType } from './types';

export const nativeBalanceChange = 'nativeBalanceChange';

export type NativeBalanceChangeBuilderConfig = {
  recipient: Address;
  balance: bigint;
  changeType: BalanceChangeType;
};

/**
 * Builds a caveat struct for the NativeBalanceChangeEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object for the NativeBalanceChangeEnforcer.
 * @returns The Caveat.
 * @throws Error if the recipient address is invalid or the amount is not a positive number.
 */
export const nativeBalanceChangeBuilder = (
  environment: DeleGatorEnvironment,
  config: NativeBalanceChangeBuilderConfig,
): Caveat => {
  const { recipient, balance, changeType } = config;

  if (!isAddress(recipient)) {
    throw new Error('Invalid recipient: must be a valid Address');
  }

  if (balance <= 0n) {
    throw new Error('Invalid balance: must be a positive number');
  }

  if (
    changeType !== BalanceChangeType.Increase &&
    changeType !== BalanceChangeType.Decrease
  ) {
    throw new Error('Invalid changeType: must be either Increase or Decrease');
  }

  const terms = encodePacked(
    ['uint8', 'address', 'uint256'],
    [changeType, recipient, balance],
  );

  const {
    caveatEnforcers: { NativeBalanceChangeEnforcer },
  } = environment;

  if (!NativeBalanceChangeEnforcer) {
    throw new Error('NativeBalanceChangeEnforcer not found in environment');
  }

  return {
    enforcer: NativeBalanceChangeEnforcer,
    terms,
    args: '0x',
  };
};
