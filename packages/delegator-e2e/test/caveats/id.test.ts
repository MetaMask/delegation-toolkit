import { beforeEach, test, expect } from 'vitest';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
} from '@metamask/delegation-toolkit/utils';
import {
  createCaveatBuilder,
  createDelegation,
  createExecution,
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
  randomBytes,
} from '../utils/helpers';
import { createClient, encodeFunctionData, hexToBigInt } from 'viem';
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
  
  Alice creates a delegation to Bob's delegator account, with an Id
  caveat specifying a unique identifier.
  
  Bob redeems the delegation with a call to the setCount() function
  on the counter contract, providing the correct Id.
*/

test('maincase: Bob redeems the delegation providing an id', async () => {
  const id = Math.floor(Math.random() * 2 ** 32);

  await runTest_expectSuccess(id);
});

test('Bob redeems two delegations with different ids', async () => {
  const id1 = Math.floor(Math.random() * 2 ** 32);
  const id2 = Math.floor(Math.random() * 2 ** 32);

  await runTest_expectSuccess(id1);
  await runTest_expectSuccess(id2);
});

test('Bob redeems a delegation with a different id, after attempting to redeem one with the same id', async () => {
  const id1 = Math.floor(Math.random() * 2 ** 32);
  const id2 = Math.floor(Math.random() * 2 ** 32);

  await runTest_expectSuccess(id1);
  await runTest_expectFailure(id1, 'IdEnforcer:id-already-used');
  await runTest_expectSuccess(id2);
});

test('Bob attempts to redeem a second delegation with the same id', async () => {
  const id = Math.floor(Math.random() * 2 ** 32);
  await runTest_expectSuccess(id);

  await runTest_expectFailure(id, 'IdEnforcer:id-already-used');
});

const runTest_expectSuccess = async (id: number) => {
  const newCount = hexToBigInt(randomBytes(32));

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'id',
      id,
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

  const countAfter = await publicClient.readContract({
    address: aliceCounter.address,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });

  expect(countAfter).toEqual(newCount);
};

const runTest_expectFailure = async (id: number, expectedError: string) => {
  const newCount = hexToBigInt(randomBytes(32));

  const delegation = createDelegation({
    to: bobSmartAccount.address,
    from: aliceSmartAccount.address,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'id',
      id,
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
  ).rejects.toThrow(expectedError);

  const countAfter = await publicClient.readContract({
    address: aliceCounter.address,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });

  expect(countAfter).not.toEqual(newCount);
};
