import { beforeEach, test, expect } from 'vitest';
import { NonceEnforcer } from '@metamask/delegation-abis';
import {
  encodeExecutionCalldatas,
  encodePermissionContexts,
  createCaveatBuilder,
} from '@metamask/delegation-toolkit/utils';
import {
  createDelegation,
  createExecution,
  ExecutionMode,
  Implementation,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
} from '@metamask/delegation-toolkit';
import {
  gasPrice,
  sponsoredBundlerClient,
  deploySmartAccount,
  randomBytes,
  fundAddress,
  deployCounter,
  publicClient,
} from '../utils/helpers';
import CounterMetadata from '../utils/counter/metadata.json';

import { Address, encodeFunctionData, parseEther, toHex } from 'viem';
import { expectUserOperationToSucceed } from '../utils/assertions';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

let aliceSmartAccount: MetaMaskSmartAccount;
let bobSmartAccount: MetaMaskSmartAccount;
let aliceCounterAddress: Address;

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
  await fundAddress(aliceSmartAccount.address, parseEther('2'));

  bobSmartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [bob.address, [], [], []],
    deploySalt: '0x1',
    signatory: { account: bob },
  });

  const aliceCounter = await deployCounter(aliceSmartAccount.address);
  aliceCounterAddress = aliceCounter.address;
});

test('maincase: Bob redeems the delegation with a nonce of 0', async () => {
  const newCount = BigInt(randomBytes(32));
  const nonce = 0n;
  await runTest_expectSuccess(newCount, nonce);
});

test('Bob attempts to redeem the delegation with a nonce of 1', async () => {
  const newCount = BigInt(randomBytes(32));
  const nonce = 1n;
  await runTest_expectFailure(newCount, nonce, 'NonceEnforcer:invalid-nonce');
});

test('Bob redeems a delegation with nonce 1 after alice increments the nonce', async () => {
  const newCount = BigInt(randomBytes(32));
  const nonce = 1n;

  await runTest_expectFailure(newCount, nonce, 'NonceEnforcer:invalid-nonce');

  await incrementNonce();

  await runTest_expectSuccess(newCount, nonce);
});

test('Bob redeems a delegation with nonce 4 after alice increments the nonce 4 times', async () => {
  const newCount = BigInt(randomBytes(32));
  const nonce = 4n;

  for (let i = 0; i < 4; i++) {
    await runTest_expectFailure(newCount, nonce, 'NonceEnforcer:invalid-nonce');
    await incrementNonce();
  }

  await runTest_expectSuccess(newCount, nonce);
});

test('Bob attempts to redeem a delegation with a nonce of 0 after alice increments the nonce', async () => {
  const newCount = BigInt(randomBytes(32));
  const nonce = 0n;

  await incrementNonce();

  await runTest_expectFailure(newCount, nonce, 'NonceEnforcer:invalid-nonce');
});

const runTest_expectSuccess = async (newCount: bigint, nonce: bigint) => {
  const bobAddress = bobSmartAccount.address;
  const aliceAddress = aliceSmartAccount.address;

  const delegation = createDelegation({
    to: bobAddress,
    from: aliceAddress,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'nonce',
      { nonce: toHex(nonce) },
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: aliceCounterAddress,
    callData: encodeFunctionData({
      abi: CounterMetadata.abi,
      functionName: 'setCount',
      args: [newCount],
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
    address: aliceCounterAddress,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countAfter, `Expected final count to be ${newCount}`).toEqual(
    newCount,
  );
};

const runTest_expectFailure = async (
  newCount: bigint,
  nonce: bigint,
  expectedError: string,
) => {
  const bobAddress = bobSmartAccount.address;
  const aliceAddress = aliceSmartAccount.address;

  const delegation = createDelegation({
    to: bobAddress,
    from: aliceAddress,
    caveats: createCaveatBuilder(aliceSmartAccount.environment).addCaveat(
      'nonce',
      { nonce: toHex(nonce) },
    ),
  });

  const signedDelegation = {
    ...delegation,
    signature: await aliceSmartAccount.signDelegation({
      delegation,
    }),
  };

  const execution = createExecution({
    target: aliceCounterAddress,
    callData: encodeFunctionData({
      abi: CounterMetadata.abi,
      functionName: 'setCount',
      args: [newCount],
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
    address: aliceCounterAddress,
    abi: CounterMetadata.abi,
    functionName: 'count',
  });
  expect(countAfter, 'Expected count to remain 0n').toEqual(0n);
};

const incrementNonce = async () => {
  const { environment } = aliceSmartAccount;

  const userOpHash = await sponsoredBundlerClient.sendUserOperation({
    account: aliceSmartAccount,
    calls: [
      {
        to: environment.caveatEnforcers.NonceEnforcer!,
        data: encodeFunctionData({
          abi: NonceEnforcer.abi,
          functionName: 'incrementNonce',
          args: [environment.DelegationManager],
        }),
      },
    ],
    ...gasPrice,
  });

  const receipt = await sponsoredBundlerClient.waitForUserOperationReceipt({
    hash: userOpHash,
  });

  expectUserOperationToSucceed(receipt);
};
