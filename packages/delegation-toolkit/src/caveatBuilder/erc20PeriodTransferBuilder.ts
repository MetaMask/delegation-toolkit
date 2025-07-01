import { createERC20TokenPeriodTransferTerms } from '@metamask/delegation-core';
import type { Address } from 'viem';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const erc20PeriodTransfer = 'erc20PeriodTransfer';

/**
 * Builds a caveat struct for ERC20PeriodTransferEnforcer.
 * This enforcer validates that ERC20 token transfers do not exceed a specified amount
 * within a given time period. The transferable amount resets at the beginning of each period,
 * and any unused tokens are forfeited once the period ends.
 *
 * @param environment - The DeleGator environment.
 * @param tokenAddress - The address of the ERC20 token contract.
 * @param periodAmount - The maximum amount of tokens that can be transferred per period.
 * @param periodDuration - The duration of each period in seconds.
 * @param startDate - The timestamp when the first period begins.
 * @returns The Caveat.
 * @throws Error if the token address is invalid or if any of the numeric parameters are invalid.
 */
export const erc20PeriodTransferBuilder = (
  environment: DeleGatorEnvironment,
  tokenAddress: Address,
  periodAmount: bigint,
  periodDuration: number,
  startDate: number,
): Caveat => {
  const terms = createERC20TokenPeriodTransferTerms({
    tokenAddress,
    periodAmount,
    periodDuration,
    startDate,
  });

  const {
    caveatEnforcers: { ERC20PeriodTransferEnforcer },
  } = environment;

  if (!ERC20PeriodTransferEnforcer) {
    throw new Error('ERC20PeriodTransferEnforcer not found in environment');
  }

  return {
    enforcer: ERC20PeriodTransferEnforcer,
    terms,
    args: '0x',
  };
};
