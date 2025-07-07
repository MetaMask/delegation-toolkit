import { createERC20StreamingTerms } from '@metamask/delegation-core';
import { type Address } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';

export const erc20Streaming = 'erc20Streaming';

export type Erc20StreamingBuilderConfig = {
  tokenAddress: Address;
  initialAmount: bigint;
  maxAmount: bigint;
  amountPerSecond: bigint;
  startTime: number;
};

/**
 * Builds a caveat for ERC20 token streaming with configurable parameters.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration for the ERC20 streaming builder.
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
  config: Erc20StreamingBuilderConfig,
): Caveat => {
  const { tokenAddress, initialAmount, maxAmount, amountPerSecond, startTime } =
    config;

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
