import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
} from '@metamask/delegation-toolkit/utils';
import {
  createExecution,
  Implementation,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
  ExecutionMode,
  ROOT_AUTHORITY,
  type Delegation,
} from '@metamask/delegation-toolkit';
import { createCaveatBuilder } from '@metamask/delegation-toolkit/utils';
import {
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  deployCounter,
  CounterContract,
  publicClient,
  stringToUnprefixedHex,
} from '../utils/helpers';
import { encodeFunctionData, AbiFunction, Hex, toFunctionSelector } from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import CounterMetadata from '../utils/counter/metadata.json';

let aliceSmartAccount: MetaMaskSmartAccount;
let bobSmartAccount: MetaMaskSmartAccount;
let aliceCounter: CounterContract;

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

/**
  Main test case:

  Alice creates a DeleGatorSmartAccount for a deployed Hybrid Delegator Account, and
  deploys a counter contract.

  Bob creates a DeleGatorSmartAccount for a counterfactual Hybrid Delegator Account.

  Alice creates a delegation to Bob's delegator account, with an AllowedMethods
  caveat specifying the increment function.

  Bob redeems the delegation with a call to the increment() function on the
  counter contract.
*/

test('maincase: Bob redeems the delegation with the exact target', async () => {
  const allowedMethods = ['increment()'];
  const calledMethod = 'increment';

  await runTest_expectSuccess(allowedMethods, calledMethod);
});

test('Redeems the delegation where multiple methods are allowed', async () => {
  const allowedMethods = ['increment()', 'decrement()'];
  const calledMethod = 'increment';

  await runTest_expectSuccess(allowedMethods, calledMethod);
});

test('Bob redeems the delegation where the caveat was built with the 4byte selector', async () => {
  const allowedMethods = [toFunctionSelector('increment()')];
  const calledMethod = 'increment';

  await runTest_expectSuccess(allowedMethods, calledMethod);
});

test('Bob redeems the delegation where the caveat was built with the AbiFunction', async () => {
  const allowedMethods = [
    CounterMetadata.abi.find(
      (item) => item.name === 'increment',
    ) as AbiFunction,
  ];
  const calledMethod = 'increment';

  await runTest_expectSuccess(allowedMethods, calledMethod);
});

test('Bob attempts to redeem the delegation with an unauthorized method', async () => {
  const allowedMethods = ['decrement()'];
  const calledMethod = 'increment';

  await runTest_expectFailure(
    allowedMethods,
    calledMethod,
    'AllowedMethodsEnforcer:method-not-allowed',
  );
});

test('Bob attempts to redeem the delegation with an unauthorized method, where multiple methods are allowed', async () => {
  const allowedMethods = ['decrement()', 'decrement(uint256)'];
  const calledMethod = 'increment';

  await runTest_expectFailure(
    allowedMethods,
    calledMethod,
    'AllowedMethodsEnforcer:method-not-allowed',
  );
});

const runTest_expectSuccess = async (
  allowedMethods: (string | AbiFunction | Hex)[],
  calledMethod: string,
) => {
  const { environment } = aliceSmartAccount;

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    authority: ROOT_AUTHORITY,
    salt: '0x0',
    caveats: createCaveatBuilder(environment)
      .addCaveat('allowedMethods', { selectors: allowedMethods })
      .build(),
    signature: '0x',
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const executedCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: calledMethod,
    args: [],
  });

  const execution = createExecution({
    target: aliceCounter.address,
    callData: executedCalldata,
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
  allowedMethods: (string | AbiFunction | Hex)[],
  calledMethod: string,
  expectedError: string,
) => {
  const { environment } = aliceSmartAccount;

  const delegation: Delegation = {
    delegate: bobSmartAccount.address,
    delegator: aliceSmartAccount.address,
    authority: ROOT_AUTHORITY,
    salt: '0x0',
    caveats: createCaveatBuilder(environment)
      .addCaveat('allowedMethods', { selectors: allowedMethods })
      .build(),
    signature: '0x',
  };

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const executedCalldata = encodeFunctionData({
    abi: CounterMetadata.abi,
    functionName: calledMethod,
    args: [],
  });

  const execution = createExecution({
    target: aliceCounter.address,
    callData: executedCalldata,
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
  ).rejects.toThrow(stringToUnprefixedHex(expectedError));

  const counterAfter = await aliceCounter.read.count();
  expect(counterAfter, 'Expected count to remain 0n').toEqual(0n);
};
