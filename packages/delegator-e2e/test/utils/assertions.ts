import { Address } from 'viem';
import { expect } from 'vitest';
import { publicClient } from './helpers';
import type { UserOperationReceipt } from 'viem/account-abstraction';
// common assertions to be shared across tests

export const expectCodeAt = async (address: Address, message?: string) => {
  const code = await publicClient.getCode({ address });
  expect(code, message || `Expected code deployed to ${address}`).toBeDefined();
};

export const expectNoCodeAt = async (address: Address, message?: string) => {
  const code = await publicClient.getCode({ address });
  expect(
    code,
    message || `Expected no code deployed to ${address}`,
  ).toBeUndefined();
};

// todo: make this attempt to decode the failure logs
// that is why I've made this asyncronous
export const expectUserOperationToSucceed = async (
  receipt: UserOperationReceipt,
  message?: string,
) => {
  expect(
    receipt.success,
    message || `Expected user operation ${receipt.userOpHash} to succeed`,
  ).toBeTruthy();
};
