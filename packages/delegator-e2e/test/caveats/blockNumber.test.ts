import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  createCaveatBuilder,
} from '@metamask/delegation-toolkit/utils';
import {
  createExecution,
  createDelegation,
  Implementation,
  toMetaMaskSmartAccount,
  ExecutionMode,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import {
  transport,
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  deployCounter,
  CounterContract,
  publicClient,
} from '../utils/helpers';
import { createClient, encodeFunctionData, stringToHex } from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { chain } from '../../src/config';
import CounterMetadata from '../utils/counter/metadata.json';

let aliceSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let bobSmartAccount: MetaMaskSmartAccount<Implementation.Hybrid>;
let aliceCounter: CounterContract;

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

  bobSmartAccount = await toMetaMaskSmartAccount({
    client,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: bob },
  });

  aliceCounter = await deployCounter(aliceSmartAccount.address);
});

/*
  Main test case:

  Alice creates a DeleGatorSmartAccount for a deployed Hybrid Delegator Account, and
  deploys a counter contract.

  Bob creates a DeleGatorSmartAccount for a counterfactual Hybrid Delegator Account.

  Alice creates a delegation to Bob's delegator account, with a BlockNumber
  caveat that specifies a valid block range.

  Bob redeems the delegation by calling setCount() on the counter
  contract. 
*/

// this increment needs to be large enough to avoid issues as the number of parallel tests increases
const arbitraryBlockNumberIncrement = 50n;

test('maincase: Bob redeems the delegation within the specified block range', async () => {
  const currentBlock = await publicClient.getBlockNumber();

  const afterThreshold = currentBlock;
  const beforeThreshold = currentBlock + arbitraryBlockNumberIncrement;

  await runTest_expectSuccess(1n, afterThreshold, beforeThreshold);
});

test('Bob redeems the delegation with only afterThreshold specified', async () => {
  const currentBlock = await publicClient.getBlockNumber();
  const afterThreshold = currentBlock;
  const beforeThreshold = 0n;

  await runTest_expectSuccess(2n, afterThreshold, beforeThreshold);
});

test('Bob redeems the delegation with only beforeThreshold specified', async () => {
  const currentBlock = await publicClient.getBlockNumber();
  const afterThreshold = 0n;
  const beforeThreshold = currentBlock + arbitraryBlockNumberIncrement;

  await runTest_expectSuccess(3n, afterThreshold, beforeThreshold);
});

test('Bob redeems the delegation at the exact afterThreshold', async () => {
  const currentBlock = await publicClient.getBlockNumber();
  const afterThreshold = currentBlock;
  const beforeThreshold = currentBlock + arbitraryBlockNumberIncrement;

  await runTest_expectSuccess(4n, afterThreshold, beforeThreshold);
});

test('Bob redeems the delegation at the exact beforeThreshold', async () => {
  const currentBlock = await publicClient.getBlockNumber();
  const afterThreshold = currentBlock;
  const beforeThreshold = currentBlock + arbitraryBlockNumberIncrement;

  await runTest_expectSuccess(5n, afterThreshold, beforeThreshold);
});

test('Bob attempts to redeem the delegation before the afterThreshold', async () => {
  const currentBlock = await publicClient.getBlockNumber();
  const afterThreshold = currentBlock + arbitraryBlockNumberIncrement;
  const beforeThreshold = currentBlock + arbitraryBlockNumberIncrement * 2n;

  await runTest_expectFailure(
    4n,
    afterThreshold,
    beforeThreshold,
    'BlockNumberEnforcer:early-delegation',
  );
});

test('Bob attempts to redeem the delegation after the beforeThreshold', async () => {
  const currentBlock = await publicClient.getBlockNumber();
  const afterThreshold = currentBlock - 1n;
  const beforeThreshold = currentBlock;

  await runTest_expectFailure(
    5n,
    afterThreshold,
    beforeThreshold,
    'BlockNumberEnforcer:expired-delegation',
  );
});

test('Bob attempts to redeem the delegation with afterThreshold in the future', async () => {
  const currentBlock = await publicClient.getBlockNumber();
  const afterThreshold = currentBlock + arbitraryBlockNumberIncrement;
  const beforeThreshold = currentBlock + arbitraryBlockNumberIncrement * 2n;

  await runTest_expectFailure(
    6n,
    afterThreshold,
    beforeThreshold,
    'BlockNumberEnforcer:early-delegation',
  );
});

test('Bob attempts to redeem the delegation with beforeThreshold in the past', async () => {
  const currentBlock = await publicClient.getBlockNumber();
  const afterThreshold = currentBlock - 1n;
  const beforeThreshold = currentBlock;

  await runTest_expectFailure(
    7n,
    afterThreshold,
    beforeThreshold,
    'BlockNumberEnforcer:expired-delegation',
  );
});

const runTest_expectSuccess = async (
  newCount: bigint,
  afterThreshold: bigint,
  beforeThreshold: bigint,
) => {
  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'blockNumber',
      {
        afterThreshold,
        beforeThreshold,
      },
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const calldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'setCount',
    args: [newCount],
  });

  const execution = createExecution({
    target: aliceCounter.address,
    callData: calldata,
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

  const countBefore = await aliceCounter.read.count();
  expect(countBefore, 'Expected initial count to be 0n').toEqual(0n);

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

  const countAfter = await aliceCounter.read.count();
  expect(countAfter, `Expected final count to be ${newCount}`).toEqual(
    newCount,
  );
};

const runTest_expectFailure = async (
  newCount: bigint,
  afterThreshold: bigint,
  beforeThreshold: bigint,
  expectedError: string,
) => {
  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'blockNumber',
      {
        afterThreshold,
        beforeThreshold,
      },
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const calldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'setCount',
    args: [newCount],
  });

  const execution = createExecution({
    target: aliceCounter.address,
    callData: calldata,
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
      calls: [
        {
          to: bobSmartAccount.address,
          data: redeemData,
        },
      ],
      ...gasPrice,
    }),
  ).rejects.toThrow(stringToHex(expectedError));

  const countAfter = await aliceCounter.read.count();
  expect(countAfter, 'Expected count to remain 0n').toEqual(0n);
};
