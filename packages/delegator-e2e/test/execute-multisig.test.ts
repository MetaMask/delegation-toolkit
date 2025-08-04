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
