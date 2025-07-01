import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
} from '@metamask/delegation-toolkit/utils';
import {
  createCaveatBuilder,
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
  randomBytes,
} from '../utils/helpers';
import { createClient, encodeFunctionData, Hex, concat, slice } from 'viem';
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

  Alice creates a delegation to Bob's delegator account, with an
  ArgsEqualityCheck caveat.

  Bob redeems the delegation with a call to increment() after setting the args
  to match the expected args.
*/

test('maincase: Bob redeems the delegation with matching arguments', async () => {
  const expectedArgs = randomBytes(32);

  await runTest_expectSuccess(expectedArgs, expectedArgs);
});

test('Bob redeems the delegation with empty arguments when expected', async () => {
  const expectedArgs = '0x';

  await runTest_expectSuccess(expectedArgs, expectedArgs);
});

test('Bob attempts to redeem the delegation with mismatched arguments', async () => {
  const expectedArgs = randomBytes(32);
  const actualArgs = randomBytes(32);

  await runTest_expectFailure(
    expectedArgs,
    actualArgs,
    'ArgsEqualityCheckEnforcer:different-args-and-terms',
  );
});

test('Bob attempts to redeem the delegation with args that begin with expected args', async () => {
  const expectedArgs = randomBytes(32);
  const actualArgs = concat([expectedArgs, randomBytes(32)]);

  await runTest_expectFailure(
    expectedArgs,
    actualArgs,
    'ArgsEqualityCheckEnforcer:different-args-and-terms',
  );
});

test('Bob attempts to redeem the delegation with args that are a prefix of expected args', async () => {
  const expectedArgs = randomBytes(32);
  const actualArgs = slice(expectedArgs, 0, 16);

  await runTest_expectFailure(
    expectedArgs,
    actualArgs,
    'ArgsEqualityCheckEnforcer:different-args-and-terms',
  );
});

test('Bob attempts to redeem the delegation with args when none are expected', async () => {
  const expectedArgs = '0x';
  const actualArgs = randomBytes(32);

  await runTest_expectFailure(
    expectedArgs,
    actualArgs,
    'ArgsEqualityCheckEnforcer:different-args-and-terms',
  );
});

const runTest_expectSuccess = async (expectedArgs: Hex, actualArgs: Hex) => {
  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'argsEqualityCheck',
      expectedArgs,
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  signedDelegation.caveats[0].args = actualArgs;

  const calldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
    args: [],
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
  expect(countAfter, 'Expected final count to be 1n').toEqual(1n);
};

const runTest_expectFailure = async (
  expectedArgs: Hex,
  actualArgs: Hex,
  expectedError: string,
) => {
  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'argsEqualityCheck',
      expectedArgs,
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  signedDelegation.caveats[0].args = actualArgs;

  const calldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
    args: [],
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
  ).rejects.toThrow(expectedError);

  const counterAfter = await aliceCounter.read.count();
  expect(counterAfter, 'Expected count to remain 0n').toEqual(0n);
};
