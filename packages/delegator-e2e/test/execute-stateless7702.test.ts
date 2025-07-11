import { beforeEach, expect, test } from 'vitest';
import {
  publicClient,
  fundAddress,
  randomAddress,
  deployCounter,
  transport,
  gasPrice,
  deployerClient,
} from './utils/helpers';
import { expectUserOperationToSucceed } from './utils/assertions';

import {
  Implementation,
  toMetaMaskSmartAccount,
  MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createClient, encodeFunctionData, parseEther } from 'viem';
import { chain } from '../src/config';
import CounterMetadata from './utils/counter/metadata.json';
import { sponsoredBundlerClient } from './utils/helpers';

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Stateless7702>;
let aliceAccount: ReturnType<typeof privateKeyToAccount>;

/**
 * Utility function to upgrade Alice's EOA to use EIP-7702 delegation
 */
async function upgradeAliceEOAWithEIP7702() {
  // because Alice is not self-submitting, we do not need to increment the nonce
  const nonce = await publicClient.getTransactionCount({
    address: aliceAccount.address,
  });

  const { EIP7702StatelessDeleGatorImpl } =
    aliceSmartAccount.environment.implementations;

  const signedAuthorization = await aliceAccount.signAuthorization({
    contractAddress: EIP7702StatelessDeleGatorImpl,
    chainId: chain.id,
    nonce,
  });

  const txHash = await deployerClient.sendTransaction({
    to: aliceAccount.address,
    authorizationList: [signedAuthorization],
  });

  await publicClient.waitForTransactionReceipt({ hash: txHash });

  const code = await publicClient.getCode({
    address: aliceAccount.address,
  });

  // Magic 7702 delegation code
  expect(code).to.equal(`0xef0100${EIP7702StatelessDeleGatorImpl.slice(2)}`);
}

beforeEach(async () => {
  aliceAccount = privateKeyToAccount(generatePrivateKey());

  const client = createClient({ transport, chain });

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Stateless7702,
    address: aliceAccount.address,
    signatory: { account: aliceAccount },
  });

  await upgradeAliceEOAWithEIP7702();
});

/*
  Alice creates a DeleGatorSmartAccount for a Stateless7702 delegator account using her EOA address.
  
  She then uses the smart account to submit various user operations.
*/

test('maincase: Send value to a recipient', async () => {
  const value = 1n;
  const recipient = randomAddress();

  const beforeBalance = await publicClient.getBalance({ address: recipient });
  expect(beforeBalance, "Recipient's initial balance should be zero").toBe(0n);

  const { address } = aliceSmartAccount;
  await fundAddress(address, parseEther('0.1'));

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
});

test('Deploy Counter contract and increment via user operation', async () => {
  const { address } = aliceSmartAccount;
  await fundAddress(address, parseEther('1'));

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
});

test('Execute multiple calls in a single UserOperation', async () => {
  const address = await aliceSmartAccount.getAddress();
  const value = parseEther('1');
  await fundAddress(address, value);

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

test('Alice executes multiple calls, including a call to a function directly on her smart contract account', async () => {
  const { address } = aliceSmartAccount;

  const recipient = randomAddress();
  const value = parseEther('0.5');
  const depositAmount = parseEther('0.3');
  await fundAddress(aliceSmartAccount.address, parseEther('1'));

  const balanceBefore = await publicClient.getBalance({ address: recipient });
  expect(balanceBefore, "Recipient's initial balance should be zero").toBe(0n);

  const depositBefore = await publicClient.readContract({
    address,
    abi: aliceSmartAccount.abi,
    functionName: 'getDeposit',
  });

  const callData = encodeFunctionData({
    abi: aliceSmartAccount.abi,
    functionName: 'addDeposit',
    args: [],
  });

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [
      {
        to: address,
        data: callData,
        value: depositAmount,
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

  const depositAfter = await publicClient.readContract({
    address,
    abi: aliceSmartAccount.abi,
    functionName: 'getDeposit',
  });

  expect(
    depositAfter,
    'Deposit should be increased by the deposit amount',
  ).toBe(depositBefore + depositAmount);

  const balanceAfter = await publicClient.getBalance({ address: recipient });
  expect(
    balanceAfter,
    "Recipient's balance should match the transferred value",
  ).toBe(value);
});

test('Alice executes multiple value transfers', async () => {
  const recipient = randomAddress();
  const value = parseEther('0.4');
  await fundAddress(aliceSmartAccount.address, parseEther('1'));

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
    "Recipient's balance should match the total transferred value",
  ).toBe(value + value);
});

test('Alice can check the contract version and name', async () => {
  const { address } = aliceSmartAccount;

  // These are view functions that don't require transactions
  const contractName = await publicClient.readContract({
    address,
    abi: aliceSmartAccount.abi,
    functionName: 'NAME',
  });

  const contractVersion = await publicClient.readContract({
    address,
    abi: aliceSmartAccount.abi,
    functionName: 'VERSION',
  });

  const domainVersion = await publicClient.readContract({
    address,
    abi: aliceSmartAccount.abi,
    functionName: 'DOMAIN_VERSION',
  });

  expect(
    contractName,
    'Contract name should be EIP7702StatelessDeleGator',
  ).toBe('EIP7702StatelessDeleGator');

  expect(contractVersion, 'Contract version should be 1.3.0').toBe('1.3.0');

  expect(domainVersion, 'Domain version should be 1').toBe('1');
});
