import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  createCaveatBuilder,
} from '@metamask/delegation-toolkit/utils';
import {
  createExecution,
  Implementation,
  toMetaMaskSmartAccount,
  ExecutionMode,
  ROOT_AUTHORITY,
  createDelegation,
} from '@metamask/delegation-toolkit';
import type {
  MetaMaskSmartAccount,
  Delegation,
} from '@metamask/delegation-toolkit';
import {
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  publicClient,
  randomAddress,
  deployErc20Token,
  fundAddressWithErc20Token,
  getErc20Balance,
  stringToUnprefixedHex,
} from '../utils/helpers';
import { encodeFunctionData, parseEther } from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

let aliceSmartAccount: MetaMaskSmartAccount;
let bobSmartAccount: MetaMaskSmartAccount;
let erc20TokenAddress: `0x${string}`;

/**
 * These tests verify the ERC20 transfer amount caveat functionality.
 *
 * The ERC20 transfer amount caveat ensures that:
 * 1. No more than the specified amount of ERC20 tokens may be transferred
 * 2. Transfers are limited to the specified token contract
 *
 * Alice creates a delegation to Bob with an ERC20 transfer amount caveat.
 * Bob redeems the delegation with ERC20 transfers that must respect the amount limits.
 */

beforeEach(async () => {
  const alice = privateKeyToAccount(generatePrivateKey());
  const bob = privateKeyToAccount(generatePrivateKey());

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [alice.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: alice },
  });

  await deploySmartAccount(aliceSmartAccount);

  bobSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: bob },
  });

  erc20TokenAddress = (await deployErc20Token()) as `0x${string}`;
  await fundAddressWithErc20Token(
    aliceSmartAccount.address,
    erc20TokenAddress,
    parseEther('100'),
  );
});

const runTest_expectSuccess = async (
  delegator: MetaMaskSmartAccount,
  delegate: `0x${string}`,
  maxAmount: bigint,
  transferAmount: bigint,
  recipient: string,
) => {
  const { environment } = delegator;

  const delegation: Delegation = {
    delegate,
    delegator: delegator.address,
    authority: ROOT_AUTHORITY,
    salt: '0x0',
    caveats: createCaveatBuilder(environment)
      .addCaveat('erc20TransferAmount', {
        tokenAddress: erc20TokenAddress,
        maxAmount,
      })
      .build(),
    signature: '0x',
  };

  const signedDelegation = {
    ...delegation,
    signature: await delegator.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc20TokenAddress,
    value: 0n,
    callData: encodeFunctionData({
      abi: [
        {
          type: 'function',
          name: 'transfer',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
        },
      ],
      functionName: 'transfer',
      args: [recipient as `0x${string}`, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [ExecutionMode.SingleDefault],
      encodeExecutionCalldatas([[execution]]),
    ],
  });

  const recipientBalanceBefore = await getErc20Balance(
    recipient as `0x${string}`,
    erc20TokenAddress,
  );

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: bobSmartAccount,
    calls: [
      {
        to: bobSmartAccount.address,
        data: redeemData,
      },
    ],
    ...gasPrice,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

  const recipientBalanceAfter = await getErc20Balance(
    recipient as `0x${string}`,
    erc20TokenAddress,
  );

  expect(
    recipientBalanceAfter,
    'Expected recipient balance to increase by transfer amount',
  ).toEqual(recipientBalanceBefore + transferAmount);
};

const runTest_expectFailure = async (
  delegator: MetaMaskSmartAccount,
  delegate: `0x${string}`,
  maxAmount: bigint,
  transferAmount: bigint,
  recipient: string,
  expectedError: string,
) => {
  const { environment } = delegator;

  const delegation: Delegation = {
    delegate,
    delegator: delegator.address,
    authority: ROOT_AUTHORITY,
    salt: '0x0',
    caveats: createCaveatBuilder(environment)
      .addCaveat('erc20TransferAmount', {
        tokenAddress: erc20TokenAddress,
        maxAmount,
      })
      .build(),
    signature: '0x',
  };

  const signedDelegation = {
    ...delegation,
    signature: await delegator.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc20TokenAddress,
    value: 0n,
    callData: encodeFunctionData({
      abi: [
        {
          type: 'function',
          name: 'transfer',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
        },
      ],
      functionName: 'transfer',
      args: [recipient as `0x${string}`, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [ExecutionMode.SingleDefault],
      encodeExecutionCalldatas([[execution]]),
    ],
  });

  const recipientBalanceBefore = await getErc20Balance(
    recipient as `0x${string}`,
    erc20TokenAddress,
  );

  await expect(
    sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [
        {
          to: bobSmartAccount.address,
          data: redeemData,
        },
      ],
      ...gasPrice,
    }),
  ).rejects.toThrow(stringToUnprefixedHex(expectedError));

  const recipientBalanceAfter = await getErc20Balance(
    recipient as `0x${string}`,
    erc20TokenAddress,
  );

  expect(
    recipientBalanceAfter,
    'Expected recipient balance to remain unchanged',
  ).toEqual(recipientBalanceBefore);
};

test('maincase: Bob redeems the delegation with transfer within limit', async () => {
  const recipient = randomAddress();
  const maxAmount = parseEther('5');
  const transferAmount = parseEther('3');

  await runTest_expectSuccess(
    aliceSmartAccount,
    bobSmartAccount.address,
    maxAmount,
    transferAmount,
    recipient,
  );
});

test('Bob attempts to redeem the delegation with transfer exceeding limit', async () => {
  const recipient = randomAddress();
  const maxAmount = parseEther('2');
  const transferAmount = parseEther('3');

  await runTest_expectFailure(
    aliceSmartAccount,
    bobSmartAccount.address,
    maxAmount,
    transferAmount,
    recipient,
    'ERC20TransferAmountEnforcer:allowance-exceeded',
  );
});

test('Scope: Bob redeems the delegation with an allowed transfer amount using erc20TransferAmount scope', async () => {
  const maxAmount = parseEther('2');
  const transferAmount = parseEther('1');
  const recipient = randomAddress();

  await runScopeTest_expectSuccess(maxAmount, transferAmount, recipient);
});

test('Scope: Bob attempts to redeem the delegation exceeding max amount using erc20TransferAmount scope', async () => {
  const maxAmount = parseEther('2');
  const transferAmount = parseEther('3');
  const recipient = randomAddress();

  await runScopeTest_expectFailure(
    maxAmount,
    transferAmount,
    recipient,
    'ERC20TransferAmountEnforcer:allowance-exceeded',
  );
});

const runScopeTest_expectSuccess = async (
  maxAmount: bigint,
  transferAmount: bigint,
  recipient: string,
) => {
  const bobAddress = bobSmartAccount.address;
  const aliceAddress = aliceSmartAccount.address;

  const delegation = createDelegation({
    environment: aliceSmartAccount.environment,
    to: bobAddress,
    from: aliceAddress,
    scope: {
      type: 'erc20TransferAmount',
      tokenAddress: erc20TokenAddress,
      maxAmount,
    },
    caveats: [],
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc20TokenAddress,
    value: 0n,
    callData: encodeFunctionData({
      abi: [
        {
          type: 'function',
          name: 'transfer',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
        },
      ],
      functionName: 'transfer',
      args: [recipient as `0x${string}`, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [ExecutionMode.SingleDefault],
      encodeExecutionCalldatas([[execution]]),
    ],
  });

  const recipientBalanceBefore = await getErc20Balance(
    recipient as `0x${string}`,
    erc20TokenAddress,
  );

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: bobSmartAccount,
    calls: [
      {
        to: bobSmartAccount.address,
        data: redeemData,
      },
    ],
    ...gasPrice,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);

  const recipientBalanceAfter = await getErc20Balance(
    recipient as `0x${string}`,
    erc20TokenAddress,
  );

  expect(
    recipientBalanceAfter,
    'Expected recipient balance to increase by transfer amount',
  ).toEqual(recipientBalanceBefore + transferAmount);
};

const runScopeTest_expectFailure = async (
  maxAmount: bigint,
  transferAmount: bigint,
  recipient: string,
  expectedError: string,
) => {
  const bobAddress = bobSmartAccount.address;
  const aliceAddress = aliceSmartAccount.address;

  const delegation = createDelegation({
    environment: aliceSmartAccount.environment,
    to: bobAddress,
    from: aliceAddress,
    scope: {
      type: 'erc20TransferAmount',
      tokenAddress: erc20TokenAddress,
      maxAmount,
    },
    caveats: [],
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc20TokenAddress,
    value: 0n,
    callData: encodeFunctionData({
      abi: [
        {
          type: 'function',
          name: 'transfer',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
        },
      ],
      functionName: 'transfer',
      args: [recipient as `0x${string}`, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [ExecutionMode.SingleDefault],
      encodeExecutionCalldatas([[execution]]),
    ],
  });

  const recipientBalanceBefore = await getErc20Balance(
    recipient as `0x${string}`,
    erc20TokenAddress,
  );

  await expect(
    sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [
        {
          to: bobSmartAccount.address,
          data: redeemData,
        },
      ],
      ...gasPrice,
    }),
  ).rejects.toThrow(stringToUnprefixedHex(expectedError));

  const recipientBalanceAfter = await getErc20Balance(
    recipient as `0x${string}`,
    erc20TokenAddress,
  );

  expect(
    recipientBalanceAfter,
    'Expected recipient balance to remain unchanged',
  ).toEqual(recipientBalanceBefore);
};
