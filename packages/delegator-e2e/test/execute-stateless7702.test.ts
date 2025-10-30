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
} from '@metamask/smart-accounts-kit';
import { isValid7702Implementation } from '@metamask/smart-accounts-kit/actions';
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
    signer: { account: aliceAccount },
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

test('isDeployed() method correctly identifies EIP7702 delegation for Stateless7702 accounts', async () => {
  // Test that Alice's smart account's isDeployed() method returns true
  // because her EOA is properly delegated to EIP7702StatelessDeleGator
  const isAliceDeployed = await aliceSmartAccount.isDeployed();

  expect(
    isAliceDeployed,
    'Alice smart account should report as deployed when properly delegated to EIP7702StatelessDeleGator',
  ).toBe(true);

  // Create a smart account for a non-delegated EOA
  const nonDelegatedAccount = privateKeyToAccount(generatePrivateKey());
  const client = createClient({ transport, chain });

  const nonDelegatedSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Stateless7702,
    address: nonDelegatedAccount.address,
    signer: { account: nonDelegatedAccount },
  });

  // Test that a non-delegated account's isDeployed() method returns false
  const isNonDelegatedDeployed = await nonDelegatedSmartAccount.isDeployed();

  expect(
    isNonDelegatedDeployed,
    'Non-delegated smart account should report as not deployed',
  ).toBe(false);

  // Verify that the non-delegated account has no code at all
  const code = await publicClient.getCode({
    address: nonDelegatedAccount.address,
  });
  expect(code, 'Non-delegated account should have no code').toBeUndefined();
});

test('isDeployed() returns false for addresses with code that are not delegated to EIP7702StatelessDeleGator', async () => {
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

  // Create a Stateless7702 smart account pointing to this contract address
  const contractAccount = privateKeyToAccount(generatePrivateKey());

  const contractSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Stateless7702,
    address: counterContract.address, // Point to the contract address
    signer: { account: contractAccount },
  });

  // Test that isDeployed() returns false even though there is code at the address
  // because the code is not an EIP7702StatelessDeleGator delegation
  const isContractDeployed = await contractSmartAccount.isDeployed();

  expect(
    isContractDeployed,
    'Smart account should report as not deployed when address has non-EIP7702StatelessDeleGator code',
  ).toBe(false);

  // Also test with the standalone function to show it would return false too

  const isContractDelegated = await isValid7702Implementation({
    client: publicClient,
    accountAddress: counterContract.address,
    environment: aliceSmartAccount.environment,
  });

  expect(
    isContractDelegated,
    'Contract address should not be identified as EIP7702StatelessDeleGator delegation',
  ).toBe(false);
});

test('isValid7702Implementation works with EIP-7702 delegations', async () => {
  // Test that Alice's account (which is delegated to EIP7702StatelessDeleGator) returns true
  const isValidStateless = await isValid7702Implementation({
    client: publicClient,
    accountAddress: aliceSmartAccount.address,
    environment: aliceSmartAccount.environment,
  });

  expect(
    isValidStateless,
    'Alice account should be valid for EIP-7702 implementation',
  ).toBe(true);

  // Test with a random non-delegated address
  const randomAddress = '0x1234567890123456789012345678901234567890';
  const isRandomValid = await isValid7702Implementation({
    client: publicClient,
    accountAddress: randomAddress,
    environment: aliceSmartAccount.environment,
  });

  expect(
    isRandomValid,
    'Random address should not be valid for EIP-7702 implementation',
  ).toBe(false);
});
