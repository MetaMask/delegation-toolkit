import type { Address } from 'viem';
import { concat, isAddress, toHex } from 'viem';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const erc20TransferAmount = 'erc20TransferAmount';

/**
 * Builds a caveat struct for ERC20TransferAmountEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param tokenAddress - The address of the ERC20 token contract.
 * @param maxAmount - The maximum amount of tokens that can be transferred.
 * @returns The Caveat.
 * @throws Error if the token address is invalid or if the max amount is not a positive number.
 */
export const erc20TransferAmountBuilder = (
  environment: DeleGatorEnvironment,
  tokenAddress: Address,
  maxAmount: bigint,
): Caveat => {
  if (!isAddress(tokenAddress, { strict: false })) {
    throw new Error('Invalid tokenAddress: must be a valid address');
  }

  if (maxAmount <= 0n) {
    throw new Error('Invalid maxAmount: must be a positive number');
  }

  const terms = concat([tokenAddress, toHex(maxAmount, { size: 32 })]);

  const {
    caveatEnforcers: { ERC20TransferAmountEnforcer },
  } = environment;

  if (!ERC20TransferAmountEnforcer) {
    throw new Error('ERC20TransferAmountEnforcer not found in environment');
  }

  return {
    enforcer: ERC20TransferAmountEnforcer,
    terms,
    args: '0x',
  };
};
