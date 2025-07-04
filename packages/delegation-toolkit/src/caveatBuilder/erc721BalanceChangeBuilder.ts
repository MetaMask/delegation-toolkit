import { type Address, isAddress, encodePacked } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';
import { BalanceChangeType } from './types';

export const erc721BalanceChange = 'erc721BalanceChange';

export type Erc721BalanceChangeBuilderConfig = {
  tokenAddress: Address;
  recipient: Address;
  amount: bigint;
  changeType: BalanceChangeType;
};

/**
 * Builds a caveat struct for the ERC721BalanceChangeEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object for the ERC721 balance change.
 * @returns The Caveat.
 * @throws Error if the token address is invalid, the recipient address is invalid, or the amount is not a positive number.
 */
export const erc721BalanceChangeBuilder = (
  environment: DeleGatorEnvironment,
  config: Erc721BalanceChangeBuilderConfig,
): Caveat => {
  const { tokenAddress, recipient, amount, changeType } = config;

  if (!isAddress(tokenAddress, { strict: false })) {
    throw new Error('Invalid tokenAddress: must be a valid address');
  }

  if (!isAddress(recipient, { strict: false })) {
    throw new Error('Invalid recipient: must be a valid address');
  }

  if (amount <= 0) {
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
    [changeType, tokenAddress, recipient, amount],
  );

  const {
    caveatEnforcers: { ERC721BalanceChangeEnforcer },
  } = environment;

  if (!ERC721BalanceChangeEnforcer) {
    throw new Error('ERC721BalanceChangeEnforcer not found in environment');
  }

  return {
    enforcer: ERC721BalanceChangeEnforcer,
    terms,
    args: '0x',
  };
};
