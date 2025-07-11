import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  SINGLE_DEFAULT_MODE,
} from '@metamask/delegation-toolkit/utils';
import {
  createDelegation,
  createCaveatBuilder,
  Implementation,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';

import {
  transport,
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  fundAddress,
  publicClient,
  randomAddress,
} from '../utils/helpers';
import {
  createClient,
  encodeFunctionData,
  type Hex,
  parseEther,
  concat,
  stringToHex,
} from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { chain } from '../../src/config';

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let bobSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let currentTime: number;
/**
 * These tests verify the native token period transfer caveat functionality.
 *
 * The native token period transfer caveat ensures that:
 * 1. No more than the specified amount of native token may be transferred per period
 * 2. The allowance resets at the beginning of each period.
 *
 * Alice creates a delegation to Bob with a native token period transfer caveat.
 * Bob redeems the delegation with native token transfers that must respect the period limits.
 */

beforeEach(async () => {
  const client = createClient({ transport, chain });
  const alice = privateKeyToAccount(generatePrivateKey());
  const bob = privateKeyToAccount(generatePrivateKey());

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [alice.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: alice },
  });

  await deploySmartAccount(aliceSmartAccount);
  await fundAddress(aliceSmartAccount.address, parseEther('10'));

  bobSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: bob },
  });

  const { timestamp } = await publicClient.getBlock({ blockTag: 'latest' });
  currentTime = Number(timestamp);
});

const runTest_expectSuccess = async (
  delegate: Hex,
  delegator: MetaMaskSmartAccount<Implementation>,
  periodAmount: bigint,
  periodDuration: number,
  startDate: number,
  transferAmount: bigint,
  recipient: Hex,
) => {
  const { environment } = aliceSmartAccount;

  const delegation = createDelegation({
    to: delegate,
    from: delegator.address,
    caveats: createCaveatBuilder(environment).addCaveat(
      'nativeTokenPeriodTransfer',
      periodAmount,
      periodDuration,
      startDate,
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await delegator.signDelegation({
      delegation,
    }),
  };

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([
        [{ target: recipient, value: transferAmount, callData: '0x' }],
      ]),
    ],
  });

  const balanceBefore = await publicClient.getBalance({
    address: recipient,
  });

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

  await expectUserOperationToSucceed(receipt);

  const balanceAfter = await publicClient.getBalance({
    address: recipient,
  });

  expect(balanceAfter).toBe(balanceBefore + transferAmount);
};

const runTest_expectFailure = async (
  delegate: Hex,
  delegator: MetaMaskSmartAccount<Implementation>,
  periodAmount: bigint,
  periodDuration: number,
  startDate: number,
  transferAmount: bigint,
  recipient: Hex,
  expectedError: string,
) => {
  const { environment } = aliceSmartAccount;

  const delegation = createDelegation({
    to: delegate,
    from: delegator.address,
    caveats: createCaveatBuilder(environment).addCaveat(
      'nativeTokenPeriodTransfer',
      periodAmount,
      periodDuration,
      startDate,
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await delegator.signDelegation({
      delegation,
    }),
  };

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([
        [{ target: recipient, value: transferAmount, callData: '0x' }],
      ]),
    ],
  });

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
  ).rejects.toThrow(stringToHex(expectedError));
};

test('maincase: Bob redeems the delegation with transfers within period limit', async () => {
  const recipient = randomAddress();

  const periodAmount = parseEther('3');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime;
  const transferAmount = parseEther('3');

  await runTest_expectSuccess(
    bobSmartAccount.address,
    aliceSmartAccount,
    periodAmount,
    periodDuration,
    startDate,
    transferAmount,
    recipient,
  );
});

test('Bob attempts to redeem the delegation with transfers exceeding period limit', async () => {
  const recipient = randomAddress();

  const periodAmount = parseEther('5');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime;
  const transferAmount = parseEther('6');

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    periodAmount,
    periodDuration,
    startDate,
    transferAmount,
    recipient,
    'NativeTokenPeriodTransferEnforcer:transfer-amount-exceeded',
  );
});

test('Bob attempts to redeem the delegation before start date', async () => {
  const recipient = randomAddress();

  const periodAmount = parseEther('5');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime + 3600; // 1 hour;
  const transferAmount = parseEther('3');

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    periodAmount,
    periodDuration,
    startDate,
    transferAmount,
    recipient,
    'NativeTokenPeriodTransferEnforcer:transfer-not-started',
  );
});

test('Bob attempts to redeem the delegation in the second period, with more than the period amount', async () => {
  const recipient = randomAddress();

  const periodAmount = parseEther('5');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime - 3600; // 1 hour ago;
  const transferAmount = parseEther('6');

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    periodAmount,
    periodDuration,
    startDate,
    transferAmount,
    recipient,
    'NativeTokenPeriodTransferEnforcer:transfer-amount-exceeded',
  );
});

test('Bob attempts to redeem with invalid terms length', async () => {
  const periodAmount = parseEther('1');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime;
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat(
      'nativeTokenPeriodTransfer',
      periodAmount,
      periodDuration,
      startDate,
    )
    .build();

  // Create invalid terms length by appending an empty byte
  caveats[0].terms = concat([caveats[0].terms, '0x00']);

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats,
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([
        [{ target: targetAddress, value: transferAmount, callData: '0x' }],
      ]),
    ],
  });

  const expectedError =
    'NativeTokenPeriodTransferEnforcer:invalid-terms-length';

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
  ).rejects.toThrow(stringToHex(expectedError));
});

test('Bob attempts to redeem with zero start date', async () => {
  const periodAmount = parseEther('1');
  const periodDuration = 3600; // 1 hour
  const startDate = 0; // Zero start date
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat(
      'nativeTokenPeriodTransfer',
      periodAmount,
      periodDuration,
      currentTime, // valid start date
    )
    .build();

  // Modify the terms to encode zero start date
  caveats[0].terms = concat([
    `0x${periodAmount.toString(16).padStart(64, '0')}`, // periodAmount
    `0x${periodDuration.toString(16).padStart(64, '0')}`, // periodDuration
    `0x${startDate.toString(16).padStart(64, '0')}`, // zero start date
  ]);

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats,
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([
        [{ target: targetAddress, value: transferAmount, callData: '0x' }],
      ]),
    ],
  });

  const expectedError =
    'NativeTokenPeriodTransferEnforcer:invalid-zero-start-date';

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
  ).rejects.toThrow(stringToHex(expectedError));
});

test('Bob attempts to redeem with zero period amount', async () => {
  const periodAmount = 0n; // Zero period amount
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime;
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat(
      'nativeTokenPeriodTransfer',
      1n, // valid period amount
      periodDuration,
      startDate,
    )
    .build();

  // Modify the terms to encode zero period amount
  caveats[0].terms = concat([
    `0x${periodAmount.toString(16).padStart(64, '0')}`, // zero period amount
    `0x${periodDuration.toString(16).padStart(64, '0')}`, // periodDuration
    `0x${startDate.toString(16).padStart(64, '0')}`, // startDate
  ]);

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats,
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([
        [{ target: targetAddress, value: transferAmount, callData: '0x' }],
      ]),
    ],
  });

  const expectedError =
    'NativeTokenPeriodTransferEnforcer:invalid-zero-period-amount';

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
  ).rejects.toThrow(stringToHex(expectedError));
});

test('Bob attempts to redeem with zero period duration', async () => {
  const periodAmount = parseEther('1');
  const periodDuration = 0; // Zero period duration
  const startDate = currentTime;
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat(
      'nativeTokenPeriodTransfer',
      periodAmount,
      3600, // valid period duration
      startDate,
    )
    .build();

  // Modify the terms to encode zero period duration
  caveats[0].terms = concat([
    `0x${periodAmount.toString(16).padStart(64, '0')}`, // periodAmount
    `0x${periodDuration.toString(16).padStart(64, '0')}`, // zero period duration
    `0x${startDate.toString(16).padStart(64, '0')}`, // startDate
  ]);

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats,
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([
        [{ target: targetAddress, value: transferAmount, callData: '0x' }],
      ]),
    ],
  });

  const expectedError =
    'NativeTokenPeriodTransferEnforcer:invalid-zero-period-duration';

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
  ).rejects.toThrow(stringToHex(expectedError));
});

test('Bob attempts to redeem before start date', async () => {
  const periodAmount = parseEther('1');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime + 3600; // 1 hour in the future
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat(
      'nativeTokenPeriodTransfer',
      periodAmount,
      periodDuration,
      startDate,
    )
    .build();

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats,
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([
        [{ target: targetAddress, value: transferAmount, callData: '0x' }],
      ]),
    ],
  });

  const expectedError =
    'NativeTokenPeriodTransferEnforcer:transfer-not-started';

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
  ).rejects.toThrow(stringToHex(expectedError));
});
