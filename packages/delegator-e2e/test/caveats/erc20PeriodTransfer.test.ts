import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  SINGLE_DEFAULT_MODE,
} from '@metamask/delegation-toolkit/utils';
import {
  createExecution,
  Delegation,
  Implementation,
  ROOT_AUTHORITY,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import { createCaveatBuilder } from '@metamask/delegation-toolkit/utils';
import {
  transport,
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  publicClient,
  randomAddress,
  deployErc20Token,
  fundAddressWithErc20Token,
  getErc20Balance,
} from '../utils/helpers';
import {
  createClient,
  encodeFunctionData,
  type Hex,
  parseEther,
  concat,
} from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { chain } from '../../src/config';
import * as ERC20Token from '../../contracts/out/ERC20Token.sol/ERC20Token.json';
const { abi: erc20TokenAbi } = ERC20Token;

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let bobSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let erc20TokenAddress: Hex;
let currentTime: number;

/**
 * These tests verify the ERC20 period transfer caveat functionality.
 *
 * The ERC20 period transfer caveat allows a delegator to grant permission to a delegate
 * to transfer ERC20 tokens with the following constraints:
 * - periodAmount: Maximum amount that can be transferred per period
 * - periodDuration: Duration of each period in seconds
 * - startDate: Timestamp when the first period begins
 *
 * The available amount resets at the beginning of each period, and any unused tokens
 * are forfeited once the period ends.
 *
 * Alice creates a delegation to Bob with an ERC20 token period transfer caveat.
 * Bob redeems the delegation, transferring the amount to a third party.
 */

beforeEach(async () => {
  const client = createClient({ transport, chain });
  const alice = privateKeyToAccount(generatePrivateKey());
  const bob = privateKeyToAccount(generatePrivateKey());

  erc20TokenAddress = await deployErc20Token();

  aliceSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [alice.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: alice },
  });

  await deploySmartAccount(aliceSmartAccount);

  bobSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: bob },
  });

  await fundAddressWithErc20Token(
    aliceSmartAccount.address,
    erc20TokenAddress,
    parseEther('10'),
  );

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

  const delegation: Delegation = {
    delegate,
    delegator: delegator.address,
    authority: ROOT_AUTHORITY,
    caveats: createCaveatBuilder(environment)
      .addCaveat('erc20PeriodTransfer', {
        tokenAddress: erc20TokenAddress,
        periodAmount,
        periodDuration,
        startDate,
      })
      .build(),
    salt: '0x',
    signature: '0x',
  };

  const signedDelegation = {
    ...delegation,
    signature: await delegator.signDelegation({
      delegation,
    }),
  };

  // Create an ERC20 transfer execution
  const execution = createExecution({
    target: erc20TokenAddress,
    callData: encodeFunctionData({
      abi: erc20TokenAbi,
      functionName: 'transfer',
      args: [recipient, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([[execution]]),
    ],
  });

  const recipientBalanceBefore = await getErc20Balance(
    recipient,
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

  await expectUserOperationToSucceed(receipt);

  const recipientBalanceAfter = await getErc20Balance(
    recipient,
    erc20TokenAddress,
  );

  expect(recipientBalanceAfter).toBe(recipientBalanceBefore + transferAmount);
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

  const delegation: Delegation = {
    delegate,
    delegator: delegator.address,
    caveats: createCaveatBuilder(environment)
      .addCaveat('erc20PeriodTransfer', {
        tokenAddress: erc20TokenAddress,
        periodAmount,
        periodDuration,
        startDate,
      })
      .build(),
    salt: '0x',
    signature: '0x',
    authority: ROOT_AUTHORITY,
  };

  const signedDelegation = {
    ...delegation,
    signature: await delegator.signDelegation({
      delegation,
    }),
  };

  // Create an ERC20 transfer execution
  const execution = createExecution({
    target: erc20TokenAddress,
    callData: encodeFunctionData({
      abi: erc20TokenAbi,
      functionName: 'transfer',
      args: [recipient, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([[execution]]),
    ],
  });

  const recipientBalanceBefore = await getErc20Balance(
    recipient,
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
  ).rejects.toThrow(expectedError);

  const recipientBalanceAfter = await getErc20Balance(
    recipient,
    erc20TokenAddress,
  );

  expect(recipientBalanceAfter).toBe(recipientBalanceBefore);
};

test('maincase: Bob redeems the delegation with a transfer within the period limit', async () => {
  const recipient = randomAddress();
  const periodAmount = parseEther('5');
  const periodDuration = 3600; // 1 hour
  const transferAmount = parseEther('3');

  await runTest_expectSuccess(
    bobSmartAccount.address,
    aliceSmartAccount,
    periodAmount,
    periodDuration,
    currentTime,
    transferAmount,
    recipient,
  );
});

test('Bob attempts to redeem the delegation with a transfer exceeding the period limit', async () => {
  const recipient = randomAddress();
  const periodAmount = parseEther('5');
  const periodDuration = 3600; // 1 hour
  const transferAmount = parseEther('6');

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    periodAmount,
    periodDuration,
    currentTime,
    transferAmount,
    recipient,
    'ERC20PeriodTransferEnforcer:transfer-amount-exceeded',
  );
});

test('Bob attempts to redeem the delegation before the start date', async () => {
  const recipient = randomAddress();
  const periodAmount = parseEther('5');
  const periodDuration = 3600; // 1 hour
  const transferAmount = parseEther('3');
  const futureStartDate = currentTime + 3600; // 1 hour in the future

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    periodAmount,
    periodDuration,
    futureStartDate,
    transferAmount,
    recipient,
    'ERC20PeriodTransferEnforcer:transfer-not-started',
  );
});

test('Bob attempts to redeem the delegation in the second period, with more than the period amount', async () => {
  const recipient = randomAddress();
  const periodAmount = parseEther('5');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime - 3600; // 1 hour ago
  const transferAmount = parseEther('6');

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    periodAmount,
    periodDuration,
    startDate,
    transferAmount,
    recipient,
    'ERC20PeriodTransferEnforcer:transfer-amount-exceeded',
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
    .addCaveat('erc20PeriodTransfer', {
      tokenAddress: erc20TokenAddress,
      periodAmount,
      periodDuration,
      startDate,
    })
    .build();

  // Create invalid terms length by appending an empty byte
  caveats[0].terms = concat([caveats[0].terms, '0x00']);

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    caveats,
    salt: '0x',
    signature: '0x',
    authority: ROOT_AUTHORITY,
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc20TokenAddress,
    callData: encodeFunctionData({
      abi: erc20TokenAbi,
      functionName: 'transfer',
      args: [targetAddress, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([[execution]]),
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
  ).rejects.toThrow('ERC20PeriodTransferEnforcer:invalid-terms-length');
});

test('Bob attempts to redeem with invalid execution length', async () => {
  const periodAmount = parseEther('1');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime;
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat('erc20PeriodTransfer', {
      tokenAddress: erc20TokenAddress,
      periodAmount,
      periodDuration,
      startDate,
    })
    .build();

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    caveats,
    salt: '0x',
    signature: '0x',
    authority: ROOT_AUTHORITY,
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  // Create invalid execution length by appending an empty byte
  const execution = createExecution({
    target: erc20TokenAddress,
    callData: concat([
      encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [targetAddress, transferAmount],
      }),
      '0x00',
    ]),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([[execution]]),
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
  ).rejects.toThrow('ERC20PeriodTransferEnforcer:invalid-execution-length');
});

test('Bob attempts to redeem with invalid contract', async () => {
  const periodAmount = parseEther('1');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime;
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();
  const invalidTokenAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat('erc20PeriodTransfer', {
      tokenAddress: erc20TokenAddress,
      periodAmount,
      periodDuration,
      startDate,
    })
    .build();

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    caveats,
    salt: '0x',
    signature: '0x',
    authority: ROOT_AUTHORITY,
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  // Create execution with invalid token address
  const execution = createExecution({
    target: invalidTokenAddress,
    callData: encodeFunctionData({
      abi: erc20TokenAbi,
      functionName: 'transfer',
      args: [targetAddress, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([[execution]]),
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
  ).rejects.toThrow('ERC20PeriodTransferEnforcer:invalid-contract');
});

test('Bob attempts to redeem with invalid method', async () => {
  const periodAmount = parseEther('1');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime;
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat('erc20PeriodTransfer', {
      tokenAddress: erc20TokenAddress,
      periodAmount,
      periodDuration,
      startDate,
    })
    .build();

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    caveats,
    salt: '0x',
    signature: '0x',
    authority: ROOT_AUTHORITY,
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  // Create execution with approve instead of transfer
  const execution = createExecution({
    target: erc20TokenAddress,
    callData: encodeFunctionData({
      abi: erc20TokenAbi,
      functionName: 'approve',
      args: [targetAddress, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([[execution]]),
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
  ).rejects.toThrow('ERC20PeriodTransferEnforcer:invalid-method');
});

test('Bob attempts to redeem with zero start date', async () => {
  const periodAmount = parseEther('1');
  const periodDuration = 3600; // 1 hour
  const startDate = 0; // Zero start date
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat('erc20PeriodTransfer', {
      tokenAddress: erc20TokenAddress,
      periodAmount,
      periodDuration,
      startDate: currentTime,
    })
    .build();

  // Modify the terms to encode zero start date
  caveats[0].terms = concat([
    erc20TokenAddress, // token address (20 bytes)
    `0x${periodAmount.toString(16).padStart(64, '0')}`, // periodAmount
    `0x${periodDuration.toString(16).padStart(64, '0')}`, // periodDuration
    `0x${startDate.toString(16).padStart(64, '0')}`, // zero start date
  ]);

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    caveats,
    salt: '0x',
    signature: '0x',
    authority: ROOT_AUTHORITY,
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc20TokenAddress,
    callData: encodeFunctionData({
      abi: erc20TokenAbi,
      functionName: 'transfer',
      args: [targetAddress, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([[execution]]),
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
  ).rejects.toThrow('ERC20PeriodTransferEnforcer:invalid-zero-start-date');
});

test('Bob attempts to redeem with zero period amount', async () => {
  const periodAmount = 0n; // Zero period amount
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime;
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat('erc20PeriodTransfer', {
      tokenAddress: erc20TokenAddress,
      periodAmount: 1n,
      periodDuration,
      startDate,
    })
    .build();

  // Modify the terms to encode zero period amount
  caveats[0].terms = concat([
    erc20TokenAddress, // token address (20 bytes)
    `0x${periodAmount.toString(16).padStart(64, '0')}`, // zero period amount
    `0x${periodDuration.toString(16).padStart(64, '0')}`, // periodDuration
    `0x${startDate.toString(16).padStart(64, '0')}`, // startDate
  ]);

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    caveats,
    salt: '0x',
    signature: '0x',
    authority: ROOT_AUTHORITY,
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc20TokenAddress,
    callData: encodeFunctionData({
      abi: erc20TokenAbi,
      functionName: 'transfer',
      args: [targetAddress, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([[execution]]),
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
  ).rejects.toThrow('ERC20PeriodTransferEnforcer:invalid-zero-period-amount');
});

test('Bob attempts to redeem with zero period duration', async () => {
  const periodAmount = parseEther('1');
  const periodDuration = 0; // Zero period duration
  const startDate = currentTime;
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat('erc20PeriodTransfer', {
      tokenAddress: erc20TokenAddress,
      periodAmount,
      periodDuration,
      startDate,
    })
    .build();

  // Modify the terms to encode zero period duration
  caveats[0].terms = concat([
    erc20TokenAddress, // token address (20 bytes)
    `0x${periodAmount.toString(16).padStart(64, '0')}`, // periodAmount
    `0x${periodDuration.toString(16).padStart(64, '0')}`, // zero period duration
    `0x${startDate.toString(16).padStart(64, '0')}`, // startDate
  ]);

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    caveats,
    salt: '0x',
    signature: '0x',
    authority: ROOT_AUTHORITY,
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc20TokenAddress,
    callData: encodeFunctionData({
      abi: erc20TokenAbi,
      functionName: 'transfer',
      args: [targetAddress, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([[execution]]),
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
  ).rejects.toThrow('ERC20PeriodTransferEnforcer:invalid-zero-period-duration');
});

test('Bob attempts to redeem before start date', async () => {
  const periodAmount = parseEther('1');
  const periodDuration = 3600; // 1 hour
  const startDate = currentTime + 3600; // 1 hour in the future
  const transferAmount = parseEther('1');

  const targetAddress = randomAddress();

  const { environment } = aliceSmartAccount;
  const caveats = createCaveatBuilder(environment)
    .addCaveat('erc20PeriodTransfer', {
      tokenAddress: erc20TokenAddress,
      periodAmount,
      periodDuration,
      startDate,
    })
    .build();

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    caveats,
    salt: '0x',
    signature: '0x',
    authority: ROOT_AUTHORITY,
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: erc20TokenAddress,
    callData: encodeFunctionData({
      abi: erc20TokenAbi,
      functionName: 'transfer',
      args: [targetAddress, transferAmount],
    }),
  });

  const redeemData = encodeFunctionData({
    abi: bobSmartAccount.abi,
    functionName: 'redeemDelegations',
    args: [
      encodePermissionContexts([[signedDelegation]]),
      [SINGLE_DEFAULT_MODE],
      encodeExecutionCalldatas([[execution]]),
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
  ).rejects.toThrow('ERC20PeriodTransferEnforcer:transfer-not-started');
});
