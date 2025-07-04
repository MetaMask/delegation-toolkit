import { type Address, isAddress } from 'viem';

import type { DeleGatorEnvironment, Caveat } from '../types';

export const ownershipTransfer = 'ownershipTransfer';

export type OwnershipTransferBuilderConfig = {
  targetContract: Address;
};

/**
 * Builds a caveat struct for the OwnershipTransferEnforcer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration object for the ownership transfer builder.
 * @returns The Caveat representing the caveat for ownership transfer.
 * @throws Error if the target contract address is invalid.
 */
export const ownershipTransferBuilder = (
  environment: DeleGatorEnvironment,
  config: OwnershipTransferBuilderConfig,
): Caveat => {
  const { targetContract } = config;

  if (!isAddress(targetContract, { strict: false })) {
    throw new Error('Invalid targetContract: must be a valid address');
  }

  const terms = targetContract;

  const {
    caveatEnforcers: { OwnershipTransferEnforcer },
  } = environment;

  if (!OwnershipTransferEnforcer) {
    throw new Error('OwnershipTransferEnforcer not found in environment');
  }

  return {
    enforcer: OwnershipTransferEnforcer,
    terms,
    args: '0x',
  };
};
