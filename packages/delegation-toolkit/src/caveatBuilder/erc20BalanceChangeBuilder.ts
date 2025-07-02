import { type Address, isAddress, encodePacked } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';
import { BalanceChangeType } from './types';

export const erc20BalanceChange = 'erc20BalanceChange';

export type Erc20BalanceChangeBuilderConfig = {
  tokenAddress: Address;
  recipient: Address;
  balance: bigint;
  changeType: BalanceChangeType;
};

/**
 * Builds a caveat struct for the ERC20BalanceChangeEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object for the ERC20 balance change.
 * @returns The Caveat.
 * @throws Error if the token address is invalid, the amount is not a positive number, or the change type is invalid.
 */
export const erc20BalanceChangeBuilder = (
  environment: DeleGatorEnvironment,
  config: Erc20BalanceChangeBuilderConfig,
): Caveat => {
  const { tokenAddress, recipient, balance, changeType } = config;

  if (!isAddress(tokenAddress, { strict: false })) {
    throw new Error('Invalid tokenAddress: must be a valid address');
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
    ['uint8', 'address', 'address', 'uint256'],
    [changeType, tokenAddress, recipient, balance],
  );

  const {
    caveatEnforcers: { ERC20BalanceChangeEnforcer },
  } = environment;

  if (!ERC20BalanceChangeEnforcer) {
    throw new Error('ERC20BalanceChangeEnforcer not found in environment');
  }

  return {
    enforcer: ERC20BalanceChangeEnforcer,
    terms,
    args: '0x',
  };
};
