import { beforeEach, expect, test } from 'vitest';
import {
  publicClient,
  fundAddress,
  randomAddress,
  deployCounter,
  transport,
  gasPrice,
} from './utils/helpers';
import {
  expectCodeAt,
  expectNoCodeAt,
  expectUserOperationToSucceed,
} from './utils/assertions';

import {
  Implementation,
  toMetaMaskSmartAccount,
  aggregateSignature,
  signUserOperation,
  type MetaMaskSmartAccount,
  type PartialSignature,
} from '@metamask/delegation-toolkit';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

import {
  Account,
  createClient,
  createWalletClient,
  encodeFunctionData,
  parseEther,
} from 'viem';
import { chain } from '../src/config';
import { sponsoredBundlerClient } from './utils/helpers';
import CounterMetadata from './utils/counter/metadata.json';

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.MultiSig>;

let signers: Account[];

beforeEach(async () => {
  signers = [
    privateKeyToAccount(generatePrivateKey()),
    privateKeyToAccount(generatePrivateKey()),
    privateKeyToAccount(generatePrivateKey()),
  ];
  // take all but the first signer as the signatory
  const signatory = signers.slice(1).map((account) => ({
    account,
  }));

  const client = createClient({ transport, chain });

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.MultiSig,
    deployParams: [signers.map((account) => account.address), 2n],
    deploySalt: '0x',
    signatory,
  });
});

/*
  Alice creates a DeleGatorSmartAccount for a counterfactual Multisig delegator account.
  
  She then uses the smart account to submit various user operations.
*/

test('maincase: Send value to a recipient', async () => {
  const value = parseEther('1');
  const recipient = randomAddress();

  const beforeBalance = await publicClient.getBalance({ address: recipient });
  expect(beforeBalance, "Recipient's initial balance should be zero").toBe(0n);

  const { address } = aliceSmartAccount;
  await fundAddress(address, value);

  await expectNoCodeAt(
    address,
    `Unexpected code found at gator address: ${address}`,
  );

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [
      {
        to: recipient,
        data: '0x',
        value,
      },
    ],
    ...gasPrice,
  });

  await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  await expectUserOperationToSucceed(receipt);

  const afterBalance = await publicClient.getBalance({ address: recipient });
  expect(
    afterBalance,
    "Recipient's balance should match the transferred value",
  ).toBe(value);

  await expectCodeAt(
    address,
    `Expected code to be deployed to gator address: ${address}`,
  );
});

test('Send a useroperation with an aggregated signature', async () => {
  const value = parseEther('1');
  const recipient = randomAddress();

  const beforeBalance = await publicClient.getBalance({ address: recipient });
  expect(beforeBalance, "Recipient's initial balance should be zero").toBe(0n);

  const { address } = aliceSmartAccount;
  await fundAddress(address, value);

  await expectNoCodeAt(
    address,
    `Unexpected code found at gator address: ${address}`,
  );

  const userOperation = await sponsoredBundlerClient.prepareUserOperation({
    account: aliceSmartAccount,
    calls: [
      {
        to: recipient,
        data: '0x',
        value,
      },
    ],
    ...gasPrice,
  });

  // signatures could be gathered asyncronously by different parties
  const partialSignatures: PartialSignature[] = await Promise.all(
    signers.slice(1).map(async (signer) => {
      const wallet = createWalletClient({ account: signer, transport, chain });

      const partialSignature = await signUserOperation({
        signer: wallet,
        userOperation,
        address: aliceSmartAccount.address,
        entryPoint: { address: aliceSmartAccount.entryPoint.address },
        chainId: chain.id,
        name: 'MultiSigDeleGator',
      });

      return {
        signer: signer.address,
        signature: partialSignature,
        type: 'ECDSA',
      };
    }),
  );

  const signature = aggregateSignature({ signatures: partialSignatures });

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    ...userOperation,
    signature,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  await expectUserOperationToSucceed(receipt);

  const afterBalance = await publicClient.getBalance({ address: recipient });
  expect(
    afterBalance,
    "Recipient's balance should match the transferred value",
  ).toBe(value);

  await expectCodeAt(
    address,
    `Expected code to be deployed to gator address: ${address}`,
  );
});

test('Deploy Counter contract and increment via user operation', async () => {
  const { address } = aliceSmartAccount;
  await fundAddress(address, parseEther('1'));

  await expectNoCodeAt(
    address,
    `Unexpected code found at gator address: ${address}`,
  );

  const aliceCounter = await deployCounter(aliceSmartAccount.address);

  const countBefore = await publicClient.readContract({
    address: aliceCounter.address,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });

  expect(countBefore, 'Initial counter value should be zero').toBe(0n);

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [
      {
        to: aliceCounter.address,
        data: encodeFunctionData({
          abi: CounterMetadata.abi,
          functionName: 'increment',
        }),
      },
    ],
    ...gasPrice,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

  const countAfter = await publicClient.readContract({
    address: aliceCounter.address,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countAfter, 'Counter value should be incremented to 1').toBe(1n);

  await expectCodeAt(
    address,
    `Expected code to be deployed to gator address: ${address}`,
  );
});

test('Execute multiple calls in a single UserOperation', async () => {
  const address = await aliceSmartAccount.getAddress();
  const value = parseEther('1');
  await fundAddress(address, value);

  await expectNoCodeAt(
    address,
    `Unexpected code found at gator address: ${address}`,
  );

  const aliceCounter = await deployCounter(aliceSmartAccount.address);

  const countBefore = await publicClient.readContract({
    address: aliceCounter.address,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countBefore, 'Initial counter value should be zero').toBe(0n);

  const recipient = randomAddress();

  const balanceBefore = await publicClient.getBalance({ address: recipient });
  expect(balanceBefore, "Recipient's initial balance should be zero").toBe(0n);

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [
      {
        to: recipient,
        value: value,
        data: '0x',
      },
      {
        to: aliceCounter.address,
        data: encodeFunctionData({
          abi: CounterMetadata.abi,
          functionName: 'increment',
        }),
      },
    ],
    ...gasPrice,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

  const countAfter = await publicClient.readContract({
    address: aliceCounter.address,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countAfter, 'Counter value should be incremented to 1').toBe(1n);

  const balanceAfter = await publicClient.getBalance({ address: recipient });
  expect(
    balanceAfter,
    "Recipient's balance should increase by the transferred value",
  ).toBe(balanceBefore + value);

  await expectCodeAt(
    address,
    `Expected code to be deployed to gator address: ${address}`,
  );
});

test('Alice attempts to execute transactions without funding the account', async () => {
  const address = await aliceSmartAccount.getAddress();

  const aliceCounter = await deployCounter(address);

  const countBefore = await publicClient.readContract({
    address: aliceCounter.address,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countBefore, 'Initial counter value should be zero').toBe(0n);

  const recipient = randomAddress();

  const balanceBefore = await publicClient.getBalance({ address: recipient });
  expect(balanceBefore, "Recipient's initial balance should be zero").toBe(0n);

  const value = parseEther('1');

  await expect(
    sponsoredBundlerClient.sendUserOperation({
      account: aliceSmartAccount,
      calls: [
        {
          to: aliceCounter.address,
          data: encodeFunctionData({
            abi: CounterMetadata.abi,
            functionName: 'increment',
          }),
        },
        {
          to: recipient,
          value: value,
          data: '0x',
        },
      ],
      ...gasPrice,
    }),
  ).rejects.toThrow();

  const countAfter = await publicClient.readContract({
    address: aliceCounter.address,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countAfter, 'Counter value should remain unchanged').toBe(0n);

  const balanceAfter = await publicClient.getBalance({ address: recipient });
  expect(balanceAfter, "Recipient's balance should remain unchanged").toBe(0n);
});

test('Alice calls a function directly on her smart contract account', async () => {
  const { address } = await aliceSmartAccount;

  const newThreshold = 3n;
  const callData = encodeFunctionData({
    abi: aliceSmartAccount.abi,
    functionName: 'updateThreshold',
    args: [newThreshold],
  });

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [
      {
        to: address,
        data: callData,
      },
    ],
    ...gasPrice,
  });

  const userOperationReceipt =
    await sponsoredBundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

  expect(userOperationReceipt.success, 'User operation should succeed').toBe(
    true,
  );

  const thresholdAfter = await publicClient.readContract({
    address,
    abi: aliceSmartAccount.abi,
    functionName: 'getThreshold',
  });

  expect(
    thresholdAfter,
    'Threshold should be updated to the new threshold',
  ).toBe(newThreshold);

  await expectCodeAt(
    address,
    `Expected code to be deployed to gator address: ${address}`,
  );
});

test('Alice executes multiple calls, including a call to a function directly on her smart contract account', async () => {
  const { address } = await aliceSmartAccount;

  const recipient = randomAddress();
  const value = parseEther('1');
  await fundAddress(aliceSmartAccount.address, value);

  const balanceBefore = await publicClient.getBalance({ address: recipient });
  expect(balanceBefore, "Recipient's initial balance should be zero").toBe(0n);

  const newThreshold = 3n;
  const callData = encodeFunctionData({
    abi: aliceSmartAccount.abi,
    functionName: 'updateThreshold',
    args: [newThreshold],
  });

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [
      {
        to: address,
        data: callData,
      },
      {
        to: recipient,
        value,
      },
    ],
    ...gasPrice,
  });

  const userOperationReceipt =
    await sponsoredBundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

  expect(userOperationReceipt.success, 'User operation should succeed').toBe(
    true,
  );

  const thresholdAfter = await publicClient.readContract({
    address,
    abi: aliceSmartAccount.abi,
    functionName: 'getThreshold',
  });

  expect(
    thresholdAfter,
    'Threshold should be updated to the new threshold',
  ).toBe(newThreshold);

  const balanceAfter = await publicClient.getBalance({ address: recipient });
  expect(
    balanceAfter,
    "Recipient's balance should match the transferred value",
  ).toBe(value);

  await expectCodeAt(
    address,
    `Expected code to be deployed to gator address: ${address}`,
  );
});

test('isDeployed() returns false for addresses with code that are not delegated to MultiSigDeleGator', async () => {
  // Deploy a regular contract to get an address with code
  const counterContract = await deployCounter(aliceSmartAccount.address);

  // Verify the contract has code
  const contractCode = await publicClient.getCode({
    address: counterContract.address,
  });
  expect(contractCode, 'Contract should have code deployed').toBeDefined();
  expect(
    contractCode!.length,
    'Contract code should not be empty',
  ).toBeGreaterThan(2); // More than just '0x'

  // Create a MultiSig smart account pointing to this contract address
  const contractAccount = privateKeyToAccount(generatePrivateKey());

  const contractSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.MultiSig,
    deployParams: [[contractAccount.address], 1n],
    deploySalt: '0x',
    address: counterContract.address, // Point to the contract address
    signatory: [{ account: contractAccount }],
  });

  // Test that isDeployed() returns false even though there is code at the address
  // because the code is not a MultiSigDeleGator delegation
  const isContractDeployed = await contractSmartAccount.isDeployed();

  expect(
    isContractDeployed,
    'Smart account should report as not deployed when address has non-MultiSigDeleGator code',
  ).toBe(false);

  // Also test with the standalone function to show it would return false too
  const { isValidImplementation } = await import(
    '@metamask/delegation-toolkit'
  );

  const isContractDelegated = await isValidImplementation({
    client: publicClient,
    accountAddress: counterContract.address,
    implementation: Implementation.MultiSig,
  });

  expect(
    isContractDelegated,
    'Contract address should not be identified as MultiSigDeleGator delegation',
  ).toBe(false);
});

test('isValidImplementation works with different implementations', async () => {
  const { isValidImplementation } = await import(
    '@metamask/delegation-toolkit'
  );

  // First deploy Alice's account so it has the proper delegation
  const { address } = aliceSmartAccount;
  await fundAddress(address, parseEther('0.1'));

  // Execute a transaction to deploy the account
  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [
      {
        to: randomAddress(),
        data: '0x',
        value: 1n,
      },
    ],
    ...gasPrice,
  });

  await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  // Test that Alice's account (which is delegated to MultiSigDeleGator) returns true
  // when checked with the correct implementation
  const isValidMultiSig = await isValidImplementation({
    client: publicClient,
    accountAddress: aliceSmartAccount.address,
    implementation: Implementation.MultiSig,
  });

  expect(
    isValidMultiSig,
    'Alice account should be valid for MultiSig implementation',
  ).toBe(true);

  // Test that the same account returns false when checked with wrong implementation
  const isValidStateless = await isValidImplementation({
    client: publicClient,
    accountAddress: aliceSmartAccount.address,
    implementation: Implementation.Stateless7702,
  });

  expect(
    isValidStateless,
    'Alice account should not be valid for Stateless7702 implementation',
  ).toBe(false);

  const isValidHybrid = await isValidImplementation({
    client: publicClient,
    accountAddress: aliceSmartAccount.address,
    implementation: Implementation.Hybrid,
  });

  expect(
    isValidHybrid,
    'Alice account should not be valid for Hybrid implementation',
  ).toBe(false);

  // Test with a random non-delegated address
  const randomAddr = '0x1234567890123456789012345678901234567890';
  const isRandomValid = await isValidImplementation({
    client: publicClient,
    accountAddress: randomAddr,
    implementation: Implementation.MultiSig,
  });

  expect(
    isRandomValid,
    'Random address should not be valid for any implementation',
  ).toBe(false);
});
