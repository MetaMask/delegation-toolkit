import { concat, isAddress, toHex, type Address, type Hex } from 'viem';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const specificActionERC20TransferBatch =
  'specificActionERC20TransferBatch';

export type SpecificActionErc20TransferBatchBuilderConfig = {
  tokenAddress: Address;
  recipient: Address;
  amount: bigint;
  target: Address;
  calldata: Hex;
};

/**
 * Builds a caveat struct for SpecificActionERC20TransferBatchEnforcer.
 * Enforces a batch of exactly 2 transactions: a specific action followed by an ERC20 transfer.
 *
 * @param environment - The DeleGator environment.
 * @param config - The configuration for the specific action ERC20 transfer batch builder.
 * @returns The Caveat.
 * @throws Error if any of the addresses are invalid or if the amount is not a positive number.
 */
export const specificActionERC20TransferBatchBuilder = (
  environment: DeleGatorEnvironment,
  config: SpecificActionErc20TransferBatchBuilderConfig,
): Caveat => {
  const { tokenAddress, recipient, amount, target, calldata } = config;

  if (!isAddress(tokenAddress, { strict: false })) {
    throw new Error('Invalid tokenAddress: must be a valid address');
  }

  if (!isAddress(recipient, { strict: false })) {
    throw new Error('Invalid recipient: must be a valid address');
  }

  if (!isAddress(target, { strict: false })) {
    throw new Error('Invalid target: must be a valid address');
  }

  if (amount <= 0n) {
    throw new Error('Invalid amount: must be a positive number');
  }

  const terms = concat([
    tokenAddress,
    recipient,
    toHex(amount, { size: 32 }),
    target,
    calldata,
  ]);

  const {
    caveatEnforcers: { SpecificActionERC20TransferBatchEnforcer },
  } = environment;

  if (!SpecificActionERC20TransferBatchEnforcer) {
    throw new Error(
      'SpecificActionERC20TransferBatchEnforcer not found in environment',
    );
  }

  return {
    enforcer: SpecificActionERC20TransferBatchEnforcer,
    terms,
    args: '0x',
  };
};
