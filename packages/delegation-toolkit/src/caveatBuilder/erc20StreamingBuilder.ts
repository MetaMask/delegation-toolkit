import { createERC20StreamingTerms } from '@metamask/delegation-core';
import { type Address } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';

export const erc20Streaming = 'erc20Streaming';

/**
 * Builds a caveat for ERC20 token streaming with configurable parameters.
 *
 * @param environment - The DeleGator environment.
 * @param tokenAddress - The tokenAddress of the ERC20 token.
 * @param initialAmount - The initial amount of tokens to release at start time.
 * @param maxAmount - The maximum amount of tokens that can be released.
 * @param amountPerSecond - The rate at which the allowance increases per second.
 * @param startTime - The timestamp from which the allowance streaming begins.
 * @returns The Caveat.
 * @throws Error if the token address is invalid.
 * @throws Error if the initial amount is a negative number.
 * @throws Error if the max amount is not greater than 0.
 * @throws Error if the max amount is less than the initial amount.
 * @throws Error if the amount per second is not a positive number.
 * @throws Error if the start time is not a positive number.
 */
export const erc20StreamingBuilder = (
  environment: DeleGatorEnvironment,
  tokenAddress: Address,
  initialAmount: bigint,
  maxAmount: bigint,
  amountPerSecond: bigint,
  startTime: number,
): Caveat => {
  const terms = createERC20StreamingTerms({
    tokenAddress,
    initialAmount,
    maxAmount,
    amountPerSecond,
    startTime,
  });

  const {
    caveatEnforcers: { ERC20StreamingEnforcer },
  } = environment;

  if (!ERC20StreamingEnforcer) {
    throw new Error('ERC20StreamingEnforcer not found in environment');
  }

  return {
    enforcer: ERC20StreamingEnforcer,
    terms,
    args: '0x',
  };
};
