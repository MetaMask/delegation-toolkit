import { type Address, isAddress, encodePacked } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';
import { BalanceChangeType } from './types';

export const erc1155BalanceChange = 'erc1155BalanceChange';

export type Erc1155BalanceChangeBuilderConfig = {
  tokenAddress: Address;
  recipient: Address;
  tokenId: bigint;
  balance: bigint;
  changeType: BalanceChangeType;
};

/**
 * Builds a caveat struct for the ERC1155BalanceChangeEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object for the ERC1155 balance change.
 * @returns The Caveat.
 * @throws Error if the token address is invalid, the recipient address is invalid, or the amount is not a positive number.
 */
export const erc1155BalanceChangeBuilder = (
  environment: DeleGatorEnvironment,
  config: Erc1155BalanceChangeBuilderConfig,
): Caveat => {
  const { tokenAddress, recipient, tokenId, balance, changeType } = config;

  if (!isAddress(tokenAddress, { strict: false })) {
    throw new Error('Invalid tokenAddress: must be a valid address');
  }

  if (!isAddress(recipient, { strict: false })) {
    throw new Error('Invalid recipient: must be a valid address');
  }

  if (balance <= 0n) {
    throw new Error('Invalid balance: must be a positive number');
  }

  if (tokenId < 0) {
    throw new Error('Invalid tokenId: must be a non-negative number');
  }

  if (
    changeType !== BalanceChangeType.Increase &&
    changeType !== BalanceChangeType.Decrease
  ) {
    throw new Error('Invalid changeType: must be either Increase or Decrease');
  }

  const terms = encodePacked(
    ['uint8', 'address', 'address', 'uint256', 'uint256'],
    [changeType, tokenAddress, recipient, tokenId, balance],
  );

  const {
    caveatEnforcers: { ERC1155BalanceChangeEnforcer },
  } = environment;

  if (!ERC1155BalanceChangeEnforcer) {
    throw new Error('ERC1155BalanceChangeEnforcer not found in environment');
  }

  return {
    enforcer: ERC1155BalanceChangeEnforcer,
    terms,
    args: '0x',
  };
};
