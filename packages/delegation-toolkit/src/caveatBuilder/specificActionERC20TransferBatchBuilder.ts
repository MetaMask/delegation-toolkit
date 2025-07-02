import { concat, isAddress, toHex, type Address, type Hex } from 'viem';

import type { Caveat, DeleGatorEnvironment } from '../types';

export const specificActionERC20TransferBatch =
  'specificActionERC20TransferBatch';

export type SpecificActionErc20TransferBatchBuilderConfig = {
  tokenAddress: Address;
  recipient: Address;
  amount: bigint;
  firstTarget: Address;
  firstCalldata: Hex;
};

/**
 * Builds a caveat struct for SpecificActionERC20TransferBatchEnforcer.
 * Enforces a batch of exactly 2 transactions: a specific action followed by an ERC20 transfer.
 *
 * @param environment - The DeleGator environment.
 * @param tokenAddress - The address of the ERC20 token contract.
 * @param recipient - The address that will receive the tokens.
 * @param amount - The amount of tokens to transfer.
 * @param firstTarget - The target address for the first transaction.
 * @param firstCalldata - The calldata for the first transaction.
 * @returns The Caveat.
 * @throws Error if any of the addresses are invalid or if the amount is not a positive number.
 */
export const specificActionERC20TransferBatchBuilder = (
  environment: DeleGatorEnvironment,
  config: SpecificActionErc20TransferBatchBuilderConfig,
): Caveat => {
  const { tokenAddress, recipient, amount, firstTarget, firstCalldata } =
    config;

  if (!isAddress(tokenAddress, { strict: false })) {
    throw new Error('Invalid tokenAddress: must be a valid address');
  }

  if (!isAddress(recipient, { strict: false })) {
    throw new Error('Invalid recipient: must be a valid address');
  }

  if (!isAddress(firstTarget, { strict: false })) {
    throw new Error('Invalid firstTarget: must be a valid address');
  }

  if (amount <= 0n) {
    throw new Error('Invalid amount: must be a positive number');
  }

  const terms = concat([
    tokenAddress,
    recipient,
    toHex(amount, { size: 32 }),
    firstTarget,
    firstCalldata,
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
