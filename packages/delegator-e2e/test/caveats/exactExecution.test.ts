import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  createCaveatBuilder,
} from '@metamask/delegation-toolkit/utils';
import {
  createDelegation,
  Implementation,
  toMetaMaskSmartAccount,
  ExecutionMode,
  type ExecutionStruct,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';

import {
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  deployCounter,
  CounterContract,
  stringToUnprefixedHex,
  publicClient,
} from '../utils/helpers';
import { encodeFunctionData, type Hex, parseEther } from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import CounterMetadata from '../utils/counter/metadata.json';

let aliceSmartAccount: MetaMaskSmartAccount;
let bobSmartAccount: MetaMaskSmartAccount;
let aliceCounter: CounterContract;

/**
 * These tests verify the exact execution caveat functionality.
 *
 * The exact execution caveat ensures that a single execution matches exactly
 * with the expected execution (target, value, and calldata).
 *
 * Alice creates a delegation to Bob with an exact execution caveat.
 * Bob redeems the delegation with an execution that must match exactly.
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

  aliceCounter = await deployCounter(aliceSmartAccount.address);
});

const runTest_expectSuccess = async (
  delegate: Hex,
  delegator: MetaMaskSmartAccount<Implementation>,
  execution: ExecutionStruct,
) => {
  const { environment } = aliceSmartAccount;

  const delegation = createDelegation({
    to: delegate,
    from: delegator.address,
    caveats: createCaveatBuilder(environment).addCaveat('exactExecution', {
      execution,
    }),
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
};

const runTest_expectFailure = async (
  delegate: Hex,
  delegator: MetaMaskSmartAccount<Implementation>,
  expectedExecution: ExecutionStruct,
  actualExecution: ExecutionStruct,
  expectedError: string,
) => {
  const { environment } = aliceSmartAccount;

  const delegation = createDelegation({
    to: delegate,
    from: delegator.address,
    caveats: createCaveatBuilder(environment).addCaveat('exactExecution', {
      execution: expectedExecution,
    }),
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
      [ExecutionMode.SingleDefault],
      encodeExecutionCalldatas([[actualExecution]]),
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
  ).rejects.toThrow(stringToUnprefixedHex(expectedError));
};

test('maincase: Bob redeems the delegation with exact matching execution', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const execution = {
    target: aliceCounter.address,
    value: 0n,
    callData: incrementCalldata,
  };

  await runTest_expectSuccess(
    bobSmartAccount.address,
    aliceSmartAccount,
    execution,
  );
});

test('Bob attempts to redeem the delegation with mismatched target address', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const expectedExecution = {
    target: aliceCounter.address, // different target address
    value: 0n,
    callData: incrementCalldata,
  };

  const actualExecution = {
    target: bobSmartAccount.address,
    value: 0n,
    callData: incrementCalldata,
  };

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    expectedExecution,
    actualExecution,
    'ExactExecutionEnforcer:invalid-execution',
  );
});

test('Bob attempts to redeem the delegation with mismatched value', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const expectedExecution = {
    target: aliceCounter.address,
    value: 0n,
    callData: incrementCalldata,
  };

  const actualExecution = {
    target: aliceCounter.address,
    value: parseEther('1'), // Different value
    callData: incrementCalldata,
  };

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    expectedExecution,
    actualExecution,
    'ExactExecutionEnforcer:invalid-execution',
  );
});

test('Bob attempts to redeem the delegation with mismatched calldata', async () => {
  const incrementCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'increment',
  });

  const setCountCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: 'setCount',
    args: [1n],
  });

  const expectedExecution = {
    target: aliceCounter.address,
    value: 0n,
    callData: incrementCalldata,
  };

  const actualExecution = {
    target: aliceCounter.address,
    value: 0n,
    callData: setCountCalldata, // Different calldata
  };

  await runTest_expectFailure(
    bobSmartAccount.address,
    aliceSmartAccount,
    expectedExecution,
    actualExecution,
    'ExactExecutionEnforcer:invalid-execution',
  );
});
