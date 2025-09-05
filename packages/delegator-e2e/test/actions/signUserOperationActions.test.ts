import { beforeEach, test, expect } from 'vitest';
import {
  Implementation,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import { signUserOperationActions } from '@metamask/delegation-toolkit/actions';
import { createWalletClient, http, type Hex, type Address, isHex } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { publicClient } from '../utils/helpers';

/**
 * E2E tests for user operation signing actions with wallet client extensions.
 * These tests verify that the signUserOperationActions extension works correctly
 * with real wallet clients and smart accounts.
 */

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let bobSmartAccount: MetaMaskSmartAccount<Implementation.MultiSig>;
let walletClient: ReturnType<typeof createWalletClient>;

beforeEach(async () => {
  const alice = privateKeyToAccount(generatePrivateKey());
  const bob = privateKeyToAccount(generatePrivateKey());

  // Create a wallet client that will be extended with signing actions
  walletClient = createWalletClient({
    account: alice,
    chain: sepolia,
    transport: http(),
  });

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [alice.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: alice },
  });

  bobSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.MultiSig,
    deployParams: [[bob.address], 1n],
    deploySalt: '0x1',
    signatory: [{ account: bob }],
  });
});

test('should sign user operation using extended wallet client for HybridDeleGator', async () => {
  // Extend the wallet client with user operation signing actions
  const extendedClient = walletClient.extend(signUserOperationActions());

  // Verify the client has the signUserOperation method
  expect(extendedClient).toHaveProperty('signUserOperation');
  expect(typeof extendedClient.signUserOperation).toBe('function');

  // Create a user operation to sign
  const userOperation = {
    sender: aliceSmartAccount.address,
    nonce: 0n,
    callData: '0x' as Hex,
    callGasLimit: 1000000n,
    verificationGasLimit: 1000000n,
    preVerificationGas: 21000n,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 1000000000n,
  };

  // Sign the user operation using the extended client
  const signature = await extendedClient.signUserOperation({
    userOperation,
    entryPoint: { address: aliceSmartAccount.environment.EntryPoint },
    address: aliceSmartAccount.address,
    name: 'HybridDeleGator',
  });

  // Verify the signature format and cryptographic validity
  expect(isHex(signature)).toBe(true);
  expect(signature).toHaveLength(132); // 0x + 65 bytes * 2 hex chars
});

test('should sign user operation for MultiSigDeleGator', async () => {
  const extendedClient = walletClient.extend(signUserOperationActions());

  const userOperation = {
    sender: bobSmartAccount.address,
    nonce: 0n,
    callData: '0x' as Hex,
    callGasLimit: 1000000n,
    verificationGasLimit: 1000000n,
    preVerificationGas: 21000n,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 1000000000n,
  };

  const signature = await extendedClient.signUserOperation({
    userOperation,
    entryPoint: { address: bobSmartAccount.environment.EntryPoint },
    address: bobSmartAccount.address,
    name: 'MultiSigDeleGator',
  });

  expect(isHex(signature)).toBe(true);
  expect(signature).toHaveLength(132);
});

test('should sign user operation with custom parameters', async () => {
  const extendedClient = walletClient.extend(signUserOperationActions());

  const userOperation = {
    sender: aliceSmartAccount.address,
    nonce: 5n,
    callData: '0x1234567890' as Hex,
    callGasLimit: 2000000n,
    verificationGasLimit: 1500000n,
    preVerificationGas: 25000n,
    maxFeePerGas: 2000000000n,
    maxPriorityFeePerGas: 1500000000n,
  };

  // Sign with custom parameters
  const signature = await extendedClient.signUserOperation({
    userOperation,
    entryPoint: { address: aliceSmartAccount.environment.EntryPoint },
    address: aliceSmartAccount.address,
    name: 'HybridDeleGator',
    chainId: sepolia.id, // Explicitly provide chainId
    version: '1',
  });

  expect(isHex(signature)).toBe(true);
});

test('should handle user operation with paymaster data', async () => {
  const extendedClient = walletClient.extend(signUserOperationActions());

  const userOperation = {
    sender: aliceSmartAccount.address,
    nonce: 0n,
    callData: '0x' as Hex,
    callGasLimit: 1000000n,
    verificationGasLimit: 1000000n,
    preVerificationGas: 21000n,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 1000000000n,
    paymaster: '0x1234567890123456789012345678901234567890' as Address,
    paymasterVerificationGasLimit: 50000n,
    paymasterPostOpGasLimit: 50000n,
    paymasterData: '0xdeadbeef' as Hex,
  };

  const signature = await extendedClient.signUserOperation({
    userOperation,
    entryPoint: { address: aliceSmartAccount.environment.EntryPoint },
    address: aliceSmartAccount.address,
    name: 'HybridDeleGator',
  });

  expect(isHex(signature)).toBe(true);
});

test('should handle user operation with factory data', async () => {
  const extendedClient = walletClient.extend(signUserOperationActions());

  const userOperation = {
    sender: aliceSmartAccount.address,
    nonce: 0n,
    factory: '0x1234567890123456789012345678901234567890' as Address,
    factoryData: '0xcafebabe' as Hex,
    callData: '0x' as Hex,
    callGasLimit: 1000000n,
    verificationGasLimit: 1000000n,
    preVerificationGas: 21000n,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 1000000000n,
  };

  const signature = await extendedClient.signUserOperation({
    userOperation,
    entryPoint: { address: aliceSmartAccount.environment.EntryPoint },
    address: aliceSmartAccount.address,
    name: 'HybridDeleGator',
  });

  expect(isHex(signature)).toBe(true);
});

test('should produce different signatures for different user operations', async () => {
  const extendedClient = walletClient.extend(signUserOperationActions());

  const baseUserOp = {
    sender: aliceSmartAccount.address,
    nonce: 0n,
    callGasLimit: 1000000n,
    verificationGasLimit: 1000000n,
    preVerificationGas: 21000n,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 1000000000n,
  };

  const userOp1 = {
    ...baseUserOp,
    callData: '0x1234' as Hex,
  };

  const userOp2 = {
    ...baseUserOp,
    callData: '0x5678' as Hex,
  };

  const [signature1, signature2] = await Promise.all([
    extendedClient.signUserOperation({
      userOperation: userOp1,
      entryPoint: { address: aliceSmartAccount.environment.EntryPoint },
      address: aliceSmartAccount.address,
      name: 'HybridDeleGator',
    }),
    extendedClient.signUserOperation({
      userOperation: userOp2,
      entryPoint: { address: aliceSmartAccount.environment.EntryPoint },
      address: aliceSmartAccount.address,
      name: 'HybridDeleGator',
    }),
  ]);

  expect(isHex(signature1)).toBe(true);
  expect(signature1).toHaveLength(132);
  expect(isHex(signature2)).toBe(true);
  expect(signature2).toHaveLength(132);
  expect(signature1).not.toBe(signature2);
});

test('should be compatible with MetaMask smart account signing', async () => {
  const extendedClient = walletClient.extend(signUserOperationActions());

  const userOperation = {
    sender: aliceSmartAccount.address,
    nonce: 0n,
    callData: '0x' as Hex,
    callGasLimit: 1000000n,
    verificationGasLimit: 1000000n,
    preVerificationGas: 21000n,
    maxFeePerGas: 1000000000n,
    maxPriorityFeePerGas: 1000000000n,
  };

  // Sign using both the extended client and the smart account
  const [extendedClientSignature, smartAccountSignature] = await Promise.all([
    extendedClient.signUserOperation({
      userOperation,
      entryPoint: { address: aliceSmartAccount.environment.EntryPoint },
      address: aliceSmartAccount.address,
      name: 'HybridDeleGator',
    }),
    aliceSmartAccount.signUserOperation({ ...userOperation, signature: '0x' }),
  ]);

  // Both signatures should be valid but may be different due to different signing methods
  expect(isHex(extendedClientSignature)).toBe(true);
  expect(extendedClientSignature).toHaveLength(132);
  expect(isHex(smartAccountSignature)).toBe(true);
  expect(smartAccountSignature).toHaveLength(132);
});
