import { beforeEach, test, expect, describe } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  createCaveatBuilder,
  getDelegationHashOffchain,
} from '@metamask/delegation-toolkit/utils';
import {
  createDelegation,
  createExecution,
  Implementation,
  toMetaMaskSmartAccount,
  ExecutionMode,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import {
  createCaveatEnforcerClient,
  type CaveatEnforcerClient,
} from '@metamask/delegation-toolkit/actions';
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
  fundAddress,
} from '../utils/helpers';
import {
  createClient,
  encodeFunctionData,
  type Hex,
  parseEther,
  encodePacked,
} from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { chain } from '../../src/config';
import * as ERC20Token from '../../contracts/out/ERC20Token.sol/ERC20Token.json';

const { abi: erc20TokenAbi } = ERC20Token;

// Test accounts
let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let bobSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let charlieAddress: Hex;
let erc20TokenAddress: Hex;
let currentTime: number;
let caveatClient: CaveatEnforcerClient;

/**
 * These tests verify the caveat utilities functionality with live delegations.
 * Each test creates a delegation with a specific caveat enforcer, uses the caveat utils
 * to check available amounts before and after redeeming the delegation.
 */

beforeEach(async () => {
  const client = createClient({ transport, chain });
  const alice = privateKeyToAccount(generatePrivateKey());
  const bob = privateKeyToAccount(generatePrivateKey());
  charlieAddress = randomAddress();

  // Deploy test ERC20 token
  erc20TokenAddress = await deployErc20Token();

  // Create and deploy Alice's smart account
  aliceSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [alice.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: alice },
  });
  await deploySmartAccount(aliceSmartAccount);
  await fundAddress(aliceSmartAccount.address, parseEther('50'));
  await fundAddressWithErc20Token(
    aliceSmartAccount.address,
    erc20TokenAddress,
    parseEther('100'),
  );

  // Create Bob's smart account
  bobSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x2',
    signatory: { account: bob },
  });

  // Get current time
  const { timestamp } = await publicClient.getBlock({ blockTag: 'latest' });
  currentTime = Number(timestamp);

  // Create extended client with caveat enforcer actions
  caveatClient = createCaveatEnforcerClient(publicClient, {
    environment: aliceSmartAccount.environment,
  });
});

describe('ERC20PeriodTransferEnforcer', () => {
  test('should track available amounts correctly before and after redemption (startDate = now)', async () => {
    const periodAmount = parseEther('5');
    const periodDuration = 3600; // 1 hour
    const transferAmount = parseEther('3');

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'erc20PeriodTransfer',
        {
          tokenAddress: erc20TokenAddress,
          periodAmount,
          periodDuration,
          startDate: currentTime,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({ delegation }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    const beforeResult =
      await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(beforeResult.availableAmount).toBe(periodAmount);
    expect(beforeResult.isNewPeriod).toBe(true);

    const execution = createExecution({
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [charlieAddress, transferAmount],
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

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [{ to: bobSmartAccount.address, data: redeemData }],
      ...gasPrice,
    });

    const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    await expectUserOperationToSucceed(receipt);

    const afterResult =
      await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(afterResult.availableAmount).toBe(periodAmount - transferAmount);
    expect(afterResult.isNewPeriod).toBe(false);

    const charlieBalance = await getErc20Balance(
      charlieAddress,
      erc20TokenAddress,
    );
    expect(charlieBalance).toBe(transferAmount);
  });

  test('should not allow transfer before startDate (startDate in the future)', async () => {
    const periodAmount = parseEther('5');
    const periodDuration = 3600; // 1 hour
    const transferAmount = parseEther('3');
    const futureStartDate = currentTime + 2 * periodDuration;

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'erc20PeriodTransfer',
        {
          tokenAddress: erc20TokenAddress,
          periodAmount,
          periodDuration,
          startDate: futureStartDate,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({ delegation }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    const beforeResult =
      await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(beforeResult.availableAmount).toBe(0n);
    expect(beforeResult.isNewPeriod).toBe(false);

    const execution = createExecution({
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [charlieAddress, transferAmount],
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

    await expect(
      sponsoredBundlerClient.sendUserOperation({
        account: bobSmartAccount,
        calls: [{ to: bobSmartAccount.address, data: redeemData }],
        ...gasPrice,
      }),
    ).rejects.toThrow();

    const afterResult =
      await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(afterResult.availableAmount).toBe(0n);
    expect(afterResult.isNewPeriod).toBe(false);

    const charlieBalance = await getErc20Balance(
      charlieAddress,
      erc20TokenAddress,
    );
    expect(charlieBalance).toBe(0n);
  });

  test('should track available amounts correctly with startDate in the past (2 periods ago)', async () => {
    const periodAmount = parseEther('5');
    const periodDuration = 3600; // 1 hour
    const transferAmount = parseEther('3');
    // Set startDate to 2 full periods ago
    const startDate = currentTime - 2 * periodDuration;

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'erc20PeriodTransfer',
        {
          tokenAddress: erc20TokenAddress,
          periodAmount,
          periodDuration,
          startDate,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({ delegation }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    // Should be a new period, availableAmount reset to periodAmount
    const beforeResult =
      await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(beforeResult.availableAmount).toBe(periodAmount);
    expect(beforeResult.isNewPeriod).toBe(true);

    const execution = createExecution({
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [charlieAddress, transferAmount],
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

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [{ to: bobSmartAccount.address, data: redeemData }],
      ...gasPrice,
    });

    const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    await expectUserOperationToSucceed(receipt);

    const afterResult =
      await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(afterResult.availableAmount).toBe(periodAmount - transferAmount);
    expect(afterResult.isNewPeriod).toBe(false);

    const charlieBalance = await getErc20Balance(
      charlieAddress,
      erc20TokenAddress,
    );
    expect(charlieBalance).toBe(transferAmount);
  });
});

describe('ERC20StreamingEnforcer', () => {
  test('should track available amounts correctly before and after redemption (startTime = now)', async () => {
    const initialAmount = parseEther('1');
    const maxAmount = parseEther('10');
    const amountPerSecond = parseEther('0.1');
    const transferAmount = parseEther('0.5');

    // Create delegation with ERC20 streaming caveat
    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'erc20Streaming',
        {
          tokenAddress: erc20TokenAddress,
          initialAmount,
          maxAmount,
          amountPerSecond,
          startTime: currentTime,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    // Get delegation hash
    const delegationHash = getDelegationHashOffchain(signedDelegation);

    // Check available amount before redemption
    const beforeResult =
      await caveatClient.getErc20StreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    // @note: This enforcer now simulates available amount before first use.
    expect(beforeResult.availableAmount).toBe(initialAmount);

    // Create execution to transfer tokens
    const execution = createExecution({
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [charlieAddress, transferAmount],
      }),
    });

    // Redeem delegation
    const redeemData = encodeFunctionData({
      abi: bobSmartAccount.abi,
      functionName: 'redeemDelegations',
      args: [
        encodePermissionContexts([[signedDelegation]]),
        [ExecutionMode.SingleDefault],
        encodeExecutionCalldatas([[execution]]),
      ],
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

    // Check available amount after redemption
    const afterResult =
      await caveatClient.getErc20StreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(afterResult.availableAmount).toBeGreaterThanOrEqual(
      initialAmount - transferAmount,
    );

    // Verify tokens were transferred
    const charlieBalance = await getErc20Balance(
      charlieAddress,
      erc20TokenAddress,
    );
    expect(charlieBalance).toBe(transferAmount);
  });

  test('should not allow transfer before startTime (startTime in the future)', async () => {
    const initialAmount = parseEther('1');
    const maxAmount = parseEther('10');
    const amountPerSecond = parseEther('0.1');
    const transferAmount = parseEther('1.5');
    const futureStartTime = currentTime + 7200; // 2 hours in future

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'erc20Streaming',
        {
          tokenAddress: erc20TokenAddress,
          initialAmount,
          maxAmount,
          amountPerSecond,
          startTime: futureStartTime,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    const beforeResult =
      await caveatClient.getErc20StreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(beforeResult.availableAmount).toBe(0n);

    const execution = createExecution({
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [charlieAddress, transferAmount],
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

    await expect(
      sponsoredBundlerClient.sendUserOperation({
        account: bobSmartAccount,
        calls: [{ to: bobSmartAccount.address, data: redeemData }],
        ...gasPrice,
      }),
    ).rejects.toThrow();

    const afterResult =
      await caveatClient.getErc20StreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(afterResult.availableAmount).toBe(0n);

    const charlieBalance = await getErc20Balance(
      charlieAddress,
      erc20TokenAddress,
    );
    expect(charlieBalance).toBe(0n);
  });

  test('should track available amounts correctly with startTime in the past', async () => {
    const initialAmount = parseEther('1');
    const maxAmount = parseEther('100');
    const amountPerSecond = parseEther('0.1');
    const transferAmount = parseEther('2');
    const pastStartTime = currentTime - 20; // 20 seconds ago

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'erc20Streaming',
        {
          tokenAddress: erc20TokenAddress,
          initialAmount,
          maxAmount,
          amountPerSecond,
          startTime: pastStartTime,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    const beforeResult =
      await caveatClient.getErc20StreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    // @note: This enforcer now simulates available amount before first use.
    // Since startTime is 20 seconds ago: initialAmount + (20 * amountPerSecond) = 1 + (20 * 0.1) = 3 ETH
    const expectedAmountBeforeUse =
      initialAmount + amountPerSecond * BigInt(20);
    expect(beforeResult.availableAmount).toBe(expectedAmountBeforeUse);

    const execution = createExecution({
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [charlieAddress, transferAmount],
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

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [{ to: bobSmartAccount.address, data: redeemData }],
      ...gasPrice,
    });

    const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    await expectUserOperationToSucceed(receipt);

    // Get current block timestamp to calculate actual time passed
    const currentBlock = await publicClient.getBlock({ blockTag: 'latest' });
    const currentBlockTime = Number(currentBlock.timestamp);
    const actualTimePassed = currentBlockTime - pastStartTime;

    const afterResult =
      await caveatClient.getErc20StreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    const expectedAmount =
      initialAmount -
      transferAmount +
      amountPerSecond * BigInt(actualTimePassed);
    expect(afterResult.availableAmount).toBe(expectedAmount);

    const charlieBalance = await getErc20Balance(
      charlieAddress,
      erc20TokenAddress,
    );
    expect(charlieBalance).toBe(transferAmount);
  });
});

describe('MultiTokenPeriodEnforcer', () => {
  test('should track available amounts correctly before and after redemption (startDate = now)', async () => {
    const periodAmount = parseEther('5');
    const periodDuration = 3600; // 1 hour

    // Create delegation with multi-token period caveat
    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'multiTokenPeriod',
        [
          {
            token: erc20TokenAddress,
            periodAmount,
            periodDuration,
            startDate: currentTime,
          },
        ],
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    // Get delegation hash
    const delegationHash = getDelegationHashOffchain(signedDelegation);

    // Prepare args for multi-token enforcer (token selector)
    const args = encodePacked(['uint256'], [BigInt(0)]); // token index 0
    signedDelegation.caveats[0].args = args;

    // Check available amount before redemption
    const beforeResult =
      await caveatClient.getMultiTokenPeriodEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
        args,
      });

    expect(beforeResult.availableAmount).toBe(periodAmount);
    expect(beforeResult.isNewPeriod).toBe(true);

    // Create execution to transfer tokens
    const execution = createExecution({
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [charlieAddress, beforeResult.availableAmount],
      }),
    });

    // Redeem delegation
    const redeemData = encodeFunctionData({
      abi: bobSmartAccount.abi,
      functionName: 'redeemDelegations',
      args: [
        encodePermissionContexts([[signedDelegation]]),
        [ExecutionMode.SingleDefault],
        encodeExecutionCalldatas([[execution]]),
      ],
    });

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [{ to: bobSmartAccount.address, data: redeemData }],
      ...gasPrice,
    });

    const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    await expectUserOperationToSucceed(receipt);

    // Check available amount after redemption
    const afterResult =
      await caveatClient.getMultiTokenPeriodEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
        args,
      });

    expect(afterResult.availableAmount).toBe(0n); // All tokens were transferred
    expect(afterResult.isNewPeriod).toBe(false);

    // Verify tokens were transferred
    const charlieBalance = await getErc20Balance(
      charlieAddress,
      erc20TokenAddress,
    );
    expect(charlieBalance).toBe(beforeResult.availableAmount);
  });

  test('should not allow transfer before startDate (startDate in the future)', async () => {
    const periodAmount = parseEther('5');
    const periodDuration = 3600; // 1 hour
    const transferAmount = parseEther('2');
    const futureStartDate = currentTime + 2 * periodDuration;

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'multiTokenPeriod',
        [
          {
            token: erc20TokenAddress,
            periodAmount,
            periodDuration,
            startDate: futureStartDate,
          },
        ],
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    // Prepare args for multi-token enforcer (token selector)
    const args = encodePacked(['uint256'], [BigInt(0)]); // token index 0
    signedDelegation.caveats[0].args = args;

    const beforeResult =
      await caveatClient.getMultiTokenPeriodEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
        args,
      });

    expect(beforeResult.availableAmount).toBe(0n);
    expect(beforeResult.isNewPeriod).toBe(false);

    const execution = createExecution({
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [charlieAddress, transferAmount],
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

    await expect(
      sponsoredBundlerClient.sendUserOperation({
        account: bobSmartAccount,
        calls: [{ to: bobSmartAccount.address, data: redeemData }],
        ...gasPrice,
      }),
    ).rejects.toThrow();

    const afterResult =
      await caveatClient.getMultiTokenPeriodEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
        args,
      });

    expect(afterResult.availableAmount).toBe(0n);
    expect(afterResult.isNewPeriod).toBe(false);

    const charlieBalance = await getErc20Balance(
      charlieAddress,
      erc20TokenAddress,
    );
    expect(charlieBalance).toBe(0n);
  });

  test('should track available amounts correctly with startDate in the past (2 periods ago)', async () => {
    const periodAmount = parseEther('5');
    const periodDuration = 3600; // 1 hour
    const transferAmount = parseEther('2');
    const startDate = currentTime - 2 * periodDuration;

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'multiTokenPeriod',
        [
          {
            token: erc20TokenAddress,
            periodAmount,
            periodDuration,
            startDate,
          },
        ],
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    // Prepare args for multi-token enforcer (token selector)
    const args = encodePacked(['uint256'], [BigInt(0)]); // token index 0
    signedDelegation.caveats[0].args = args;

    const beforeResult =
      await caveatClient.getMultiTokenPeriodEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
        args,
      });

    expect(beforeResult.availableAmount).toBe(periodAmount);
    expect(beforeResult.isNewPeriod).toBe(true);

    const execution = createExecution({
      target: erc20TokenAddress,
      value: 0n,
      callData: encodeFunctionData({
        abi: erc20TokenAbi,
        functionName: 'transfer',
        args: [charlieAddress, transferAmount],
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

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [{ to: bobSmartAccount.address, data: redeemData }],
      ...gasPrice,
    });

    const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    await expectUserOperationToSucceed(receipt);

    const afterResult =
      await caveatClient.getMultiTokenPeriodEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
        args,
      });

    expect(afterResult.availableAmount).toBe(periodAmount - transferAmount);
    expect(afterResult.isNewPeriod).toBe(false);

    const charlieBalance = await getErc20Balance(
      charlieAddress,
      erc20TokenAddress,
    );
    expect(charlieBalance).toBe(transferAmount);
  });
});

describe('NativeTokenPeriodTransferEnforcer', () => {
  test('should track available amounts correctly before and after redemption (startDate = now)', async () => {
    const periodAmount = parseEther('2');
    const periodDuration = 3600; // 1 hour
    const transferAmount = parseEther('1');

    // Create delegation with native token period transfer caveat
    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'nativeTokenPeriodTransfer',
        {
          periodAmount,
          periodDuration,
          startDate: currentTime,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    // Get delegation hash
    const delegationHash = getDelegationHashOffchain(signedDelegation);

    // Check available amount before redemption
    const beforeResult =
      await caveatClient.getNativeTokenPeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(beforeResult.availableAmount).toBe(periodAmount);
    expect(beforeResult.isNewPeriod).toBe(true);

    // Create execution to transfer native tokens
    const execution = createExecution({
      target: charlieAddress,
      value: transferAmount,
      callData: '0x',
    });

    // Redeem delegation
    const redeemData = encodeFunctionData({
      abi: bobSmartAccount.abi,
      functionName: 'redeemDelegations',
      args: [
        encodePermissionContexts([[signedDelegation]]),
        [ExecutionMode.SingleDefault],
        encodeExecutionCalldatas([[execution]]),
      ],
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

    // Check available amount after redemption
    const afterResult =
      await caveatClient.getNativeTokenPeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(afterResult.availableAmount).toBe(periodAmount - transferAmount);
    expect(afterResult.isNewPeriod).toBe(false);

    // Verify native tokens were transferred
    const charlieBalance = await publicClient.getBalance({
      address: charlieAddress,
    });
    expect(charlieBalance).toBe(transferAmount);
  });

  test('should not allow transfer before startDate (startDate in the future)', async () => {
    const periodAmount = parseEther('2');
    const periodDuration = 3600; // 1 hour
    const transferAmount = parseEther('1');
    const futureStartDate = currentTime + 2 * periodDuration;

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'nativeTokenPeriodTransfer',
        {
          periodAmount,
          periodDuration,
          startDate: futureStartDate,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    const beforeResult =
      await caveatClient.getNativeTokenPeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(beforeResult.availableAmount).toBe(0n);
    expect(beforeResult.isNewPeriod).toBe(false);

    const execution = createExecution({
      target: charlieAddress,
      value: transferAmount,
      callData: '0x',
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

    await expect(
      sponsoredBundlerClient.sendUserOperation({
        account: bobSmartAccount,
        calls: [{ to: bobSmartAccount.address, data: redeemData }],
        ...gasPrice,
      }),
    ).rejects.toThrow();

    const afterResult =
      await caveatClient.getNativeTokenPeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(afterResult.availableAmount).toBe(0n);
    expect(afterResult.isNewPeriod).toBe(false);

    const charlieBalance = await publicClient.getBalance({
      address: charlieAddress,
    });
    expect(charlieBalance).toBe(0n);
  });

  test('should track available amounts correctly with startDate in the past (2 periods ago)', async () => {
    const periodAmount = parseEther('2');
    const periodDuration = 3600; // 1 hour
    const transferAmount = parseEther('1');
    const startDate = currentTime - 2 * periodDuration;

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'nativeTokenPeriodTransfer',
        {
          periodAmount,
          periodDuration,
          startDate,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    const beforeResult =
      await caveatClient.getNativeTokenPeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(beforeResult.availableAmount).toBe(periodAmount);
    expect(beforeResult.isNewPeriod).toBe(true);

    const execution = createExecution({
      target: charlieAddress,
      value: transferAmount,
      callData: '0x',
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

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [{ to: bobSmartAccount.address, data: redeemData }],
      ...gasPrice,
    });

    const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    await expectUserOperationToSucceed(receipt);

    const afterResult =
      await caveatClient.getNativeTokenPeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(afterResult.availableAmount).toBe(periodAmount - transferAmount);
    expect(afterResult.isNewPeriod).toBe(false);

    const charlieBalance = await publicClient.getBalance({
      address: charlieAddress,
    });
    expect(charlieBalance).toBe(transferAmount);
  });
});

describe('NativeTokenStreamingEnforcer', () => {
  test('should track available amounts correctly before and after redemption (startTime = now)', async () => {
    const initialAmount = parseEther('1');
    const maxAmount = parseEther('10');
    const amountPerSecond = parseEther('0.1');
    const transferAmount = parseEther('0.5');

    // Create delegation with native token streaming caveat
    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'nativeTokenStreaming',
        {
          initialAmount,
          maxAmount,
          amountPerSecond,
          startTime: currentTime,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    // Get delegation hash
    const delegationHash = getDelegationHashOffchain(signedDelegation);

    // Check available amount before redemption
    const beforeResult =
      await caveatClient.getNativeTokenStreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    // @note: This enforcer now simulates available amount before first use.
    expect(beforeResult.availableAmount).toBe(initialAmount);

    // Create execution to transfer native tokens
    const execution = createExecution({
      target: charlieAddress,
      value: transferAmount,
      callData: '0x',
    });

    // Redeem delegation
    const redeemData = encodeFunctionData({
      abi: bobSmartAccount.abi,
      functionName: 'redeemDelegations',
      args: [
        encodePermissionContexts([[signedDelegation]]),
        [ExecutionMode.SingleDefault],
        encodeExecutionCalldatas([[execution]]),
      ],
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

    // Check available amount after redemption
    const afterResult =
      await caveatClient.getNativeTokenStreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(afterResult.availableAmount).toBeGreaterThanOrEqual(
      initialAmount - transferAmount,
    );

    // Verify native tokens were transferred
    const charlieBalance = await publicClient.getBalance({
      address: charlieAddress,
    });
    expect(charlieBalance).toBe(transferAmount);
  });

  test('should not allow transfer before startTime (startTime in the future)', async () => {
    const initialAmount = parseEther('0.5');
    const maxAmount = parseEther('5');
    const amountPerSecond = parseEther('0.01');
    const transferAmount = parseEther('0.8');
    const futureStartTime = currentTime + 7200; // 2 hours in future

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'nativeTokenStreaming',
        {
          initialAmount,
          maxAmount,
          amountPerSecond,
          startTime: futureStartTime,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    const beforeResult =
      await caveatClient.getNativeTokenStreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(beforeResult.availableAmount).toBe(0n);

    const execution = createExecution({
      target: charlieAddress,
      value: transferAmount,
      callData: '0x',
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

    await expect(
      sponsoredBundlerClient.sendUserOperation({
        account: bobSmartAccount,
        calls: [{ to: bobSmartAccount.address, data: redeemData }],
        ...gasPrice,
      }),
    ).rejects.toThrow();

    const afterResult =
      await caveatClient.getNativeTokenStreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(afterResult.availableAmount).toBe(0n);

    const charlieBalance = await publicClient.getBalance({
      address: charlieAddress,
    });
    expect(charlieBalance).toBe(0n);
  });

  test('should track available amounts correctly with startTime in the past', async () => {
    const initialAmount = parseEther('1');
    const maxAmount = parseEther('100');
    const amountPerSecond = parseEther('0.1');
    const transferAmount = parseEther('2');
    const pastStartTime = currentTime - 20; // 20 seconds ago

    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'nativeTokenStreaming',
        {
          initialAmount,
          maxAmount,
          amountPerSecond,
          startTime: pastStartTime,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    const delegationHash = getDelegationHashOffchain(signedDelegation);

    const beforeResult =
      await caveatClient.getNativeTokenStreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    // @note: This enforcer now simulates available amount before first use.
    // Since startTime is 20 seconds ago: initialAmount + (20 * amountPerSecond) = 1 + (20 * 0.1) = 3 ETH
    const expectedAmountBeforeUse =
      initialAmount + amountPerSecond * BigInt(20);
    expect(beforeResult.availableAmount).toBe(expectedAmountBeforeUse);

    const execution = createExecution({
      target: charlieAddress,
      value: transferAmount,
      callData: '0x',
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

    const userOpHash = await sponsoredBundlerClient.sendUserOperation({
      account: bobSmartAccount,
      calls: [{ to: bobSmartAccount.address, data: redeemData }],
      ...gasPrice,
    });

    const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });

    await expectUserOperationToSucceed(receipt);

    // Get current block timestamp to calculate actual time passed
    const currentBlock = await publicClient.getBlock({ blockTag: 'latest' });
    const currentBlockTime = Number(currentBlock.timestamp);
    const actualTimePassed = currentBlockTime - pastStartTime;

    const afterResult =
      await caveatClient.getNativeTokenStreamingEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    const expectedAmount =
      initialAmount -
      transferAmount +
      amountPerSecond * BigInt(actualTimePassed);
    expect(afterResult.availableAmount).toBe(expectedAmount);

    const charlieBalance = await publicClient.getBalance({
      address: charlieAddress,
    });
    expect(charlieBalance).toBe(transferAmount);
  });
});

describe('Generic caveat utils functionality', () => {
  test('should work with generic getCaveatAvailableAmount method', async () => {
    const periodAmount = parseEther('3');
    const periodDuration = 3600; // 1 hour

    // Create delegation with ERC20 period transfer caveat
    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'erc20PeriodTransfer',
        {
          tokenAddress: erc20TokenAddress,
          periodAmount,
          periodDuration,
          startDate: currentTime,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    // Get delegation hash
    const delegationHash = getDelegationHashOffchain(signedDelegation);

    // Use generic method
    const result =
      await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
      });

    expect(result.availableAmount).toBe(periodAmount);
    expect(result.isNewPeriod).toBe(true);
    expect(result.currentPeriod).toBeDefined();
  });

  test('should work with custom delegation manager', async () => {
    const customDelegationManager = randomAddress();
    const periodAmount = parseEther('2');
    const periodDuration = 3600;

    // Create delegation with custom delegation manager
    const delegation = createDelegation({
      to: bobSmartAccount.address,
      from: aliceSmartAccount.address,
      caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
        'erc20PeriodTransfer',
        {
          tokenAddress: erc20TokenAddress,
          periodAmount,
          periodDuration,
          startDate: currentTime,
        },
      ),
    });

    const signedDelegation = {
      ...delegation,
      signature: await aliceSmartAccount.signDelegation({
        delegation,
      }),
    };

    // Get delegation hash
    const delegationHash = getDelegationHashOffchain(signedDelegation);

    // This should fail with custom delegation manager since it's not the real one
    const result =
      await caveatClient.getErc20PeriodTransferEnforcerAvailableAmount({
        delegationHash,
        terms: delegation.caveats[0].terms,
        delegationManager: customDelegationManager,
      });

    // Should still return a result, check structure
    expect(result).toHaveProperty('availableAmount');
    expect(result).toHaveProperty('isNewPeriod');
    expect(result).toHaveProperty('currentPeriod');
  });
});
