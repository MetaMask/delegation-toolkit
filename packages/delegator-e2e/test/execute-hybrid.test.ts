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
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createClient, encodeFunctionData, parseEther } from 'viem';
import { chain } from '../src/config';
import CounterMetadata from './utils/counter/metadata.json';
import { sponsoredBundlerClient } from './utils/helpers';

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;

beforeEach(async () => {
  const owner = privateKeyToAccount(generatePrivateKey());

  const client = createClient({ transport, chain });

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [owner.address, [], [], []],
    deploySalt: '0x',
    signatory: { account: owner },
  });
});

/*
  Alice creates a DeleGatorSmartAccount for a counterfactual Hybrid delegator account.
  
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

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

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

  const newOwner = privateKeyToAccount(generatePrivateKey());

  const callData = encodeFunctionData({
    abi: aliceSmartAccount.abi,
    functionName: 'updateSigners',
    args: [newOwner.address, [], [], []],
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

  const ownerAfter = await publicClient.readContract({
    address,
    abi: aliceSmartAccount.abi,
    functionName: 'owner',
  });

  expect(ownerAfter, 'Owner should be updated to the new address').toBe(
    newOwner.address,
  );

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

  const newOwner = privateKeyToAccount(generatePrivateKey());

  const balanceBefore = await publicClient.getBalance({ address: recipient });
  expect(balanceBefore, "Recipient's initial balance should be zero").toBe(0n);

  const callData = encodeFunctionData({
    abi: aliceSmartAccount.abi,
    functionName: 'updateSigners',
    args: [newOwner.address, [], [], []],
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

  const ownerAfter = await publicClient.readContract({
    address,
    abi: aliceSmartAccount.abi,
    functionName: 'owner',
  });

  expect(ownerAfter, 'Owner should be updated to the new address').toBe(
    newOwner.address,
  );

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

test('Alice executes multiple calls', async () => {
  const { address } = await aliceSmartAccount;

  const recipient = randomAddress();
  const value = parseEther('1');
  await fundAddress(aliceSmartAccount.address, value * 2n);

  const balanceBefore = await publicClient.getBalance({ address: recipient });
  expect(balanceBefore, "Recipient's initial balance should be zero").toBe(0n);

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [
      {
        to: recipient,
        value,
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

  const balanceAfter = await publicClient.getBalance({ address: recipient });
  expect(
    balanceAfter,
    "Recipient's balance should match the transferred value",
  ).toBe(value + value);

  await expectCodeAt(
    address,
    `Expected code to be deployed to gator address: ${address}`,
  );
});
